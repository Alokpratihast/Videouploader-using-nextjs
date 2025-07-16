// app/api/video/by-user/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectedToDatabase } from "@/lib/db";
import Video from "@/models/video";

export async function GET(
  req: NextRequest,
  context:{ params :  { userId: string } }
) {
  try {
    await connectedToDatabase();

    const { userId } = context.params;

    const videos = await Video.find({ uploadedBy: userId }).sort({ createdAt: -1 });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("GET /api/video/by-user/[userId] error:", error);
    return NextResponse.json({ error: "Failed to fetch user videos" }, { status: 500 });
  }
}
