"use client";

import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface MediaUploaderProps {
  onSuccess: (url: string) => void;
}

export default function MediaUploader({ onSuccess }: MediaUploaderProps) {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = new AbortController();

  const getAuthParams = async () => {
    const res = await fetch("/api/upload-auth");
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Auth failed: ${errorText}`);
    }
    return await res.json();
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return alert("Please select a video or image file");

    try {
      setUploading(true);
      const { signature, expire, token, publicKey } = await getAuthParams();

      const result = await upload({
        file,
        fileName: file.name,
        signature,
        expire,
        token,
        publicKey,
        useUniqueFileName: true,
        folder: "/uploads", // optional: general folder
        onProgress: (e) => setProgress((e.loaded / e.total) * 100),
        abortSignal: abortController.signal,
      });

      console.log("✅ Upload Success:", result);
      onSuccess(result.url);

       await fetch("/api/save-media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: result.url,
        name: result.name,
        fileType: file.type,
      }),
      

    });
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
        accept="video/*,image/*"
        className="border border-gray-400 p-2 rounded w-full"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Media"}
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
