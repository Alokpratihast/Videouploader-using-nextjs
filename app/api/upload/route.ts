// File: app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

// ✅ Create ImageKit instance
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
  try {
    const { file, fileName } = await req.json();

    if (!file || !fileName) {
      return NextResponse.json(
        { error: "Missing file or fileName" },
        { status: 400 }
      );
    }

    // ✅ Upload to ImageKit
    const result = await imagekit.upload({
      file, // base64 format with data:image/... prefix
      fileName,
      folder: "uploads", // optional
      useUniqueFileName: true,
    });

    return NextResponse.json({
      message: "Upload successful",
      data: result,
    });
  } catch (error: unknown) {
    console.error("Upload Error:", error.message);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}
