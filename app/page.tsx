"use client";

import Link from "next/link";
import "./page.css"; // ✅ external CSS for styles

export default function HomePage() {
  return (
    <main className="landing-container">
      <div className="landing-box">
        <h1 className="landing-title">🎬 Welcome to the Video Uploader</h1>
        <p className="landing-subtext">Your secure space for uploading and managing your videos.</p>

        <div className="landing-buttons">
          <Link href="/login" className="landing-btn">Login</Link>
          <Link href="/register" className="landing-btn">Register</Link>
          <Link href="/dashboard/gallery" className="landing-btn outline">Gallery</Link>
        </div>
      </div>
    </main>
  );
}
