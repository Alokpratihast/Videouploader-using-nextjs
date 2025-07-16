"use client";

import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
} from "@imagekit/next";
import { useRef, useState } from "react";

// ✅ Props for parent callback
interface FileUploaderProps {
  onSuccess: (url: string) => void;
}

export default function FileUploader({ onSuccess }: FileUploaderProps) {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = new AbortController();

  // ✅ Fetch upload auth from /api/upload-auth
  const getAuthParams = async () => {
    const res = await fetch("/api/upload-auth");
    if (!res.ok) {
      throw new Error("Failed to fetch upload auth params");
    }
    const { authenticationParameter, publicKey } = await res.json();
    return { ...authenticationParameter, publicKey };
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return alert("Please select an image or video file");

    try {
      setUploading(true);
      const { signature, expire, token, publicKey } = await getAuthParams();

      const result = await upload({
        file,
        fileName: file.name as string,
        signature,
        expire,
        token,
        publicKey,
        useUniqueFileName: true,
        folder: "/uploads",
        onProgress: (e) => setProgress((e.loaded / e.total) * 100),
        abortSignal: abortController.signal,
      });

      console.log("✅ Upload Success:", result);
      onSuccess(result.url);
    } catch (err) {
      if (err instanceof ImageKitAbortError) {
        console.error("❌ Upload Aborted");
      } else if (err instanceof ImageKitInvalidRequestError) {
        console.error("❌ Invalid Request", err.message);
      } else if (err instanceof ImageKitUploadNetworkError) {
        console.error("❌ Network Error", err.message);
      } else if (err instanceof ImageKitServerError) {
        console.error("❌ Server Error", err.message);
      } else {
        console.error("❌ Unexpected Error", err);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,video/*"
        className="border border-gray-400 p-2 rounded w-full"
      />
      <button
        onClick={handleUpload}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>

      {uploading && (
        <div>
          <label className="text-sm text-gray-600">Progress:</label>
          <progress value={progress} max={100} className="w-full mt-1" />
        </div>
      )}
    </div>
  );
}
