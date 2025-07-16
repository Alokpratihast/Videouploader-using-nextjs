// components/UploadCard.tsx
"use client";

import { useState } from "react";
import "./UploadCard.css";
import { UploadCloud } from "lucide-react";
import VideoUploader from "@/components/FileUpload"; // assumes you already have this
import { useRouter } from "next/navigation";

export default function UploadCard() {
  const [uploadedUrl, setUploadedUrl] = useState("");
  const router = useRouter();

  return (
    <div className="upload-card">
      <div className="upload-header">
        <UploadCloud className="icon" />
        <h2>Upload Your Video</h2>
      </div>

      <p className="upload-subtext">Only MP4/MOV files under 100MB supported.</p>

      <VideoUploader
        onSuccess={(url) => {
          setUploadedUrl(url);
        }}
      />

      {uploadedUrl && (
        <button
          onClick={() => router.push("/dashboard/gallery")}
          className="upload-btn"
        >
          View All Videos
        </button>
      )}
    </div>
  );
}
