// app/api/video/by-id/[videoId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectedToDatabase } from "@/lib/db";
import Video from "@/models/video";

export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    await connectedToDatabase();

    const { videoId } = params;

    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("GET /api/video/by-id error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
