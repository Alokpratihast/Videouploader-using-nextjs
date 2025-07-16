import { NextRequest, NextResponse } from "next/server";
import { connectedToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import Video, { IVideo } from "@/models/video";
import { authOptions } from "@/lib/authoptions";

// 🔹 GET: Fetch videos by the authenticated user
export async function GET(req: NextRequest) {
  try {
    await connectedToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const videos = await Video.find({ uploadedBy: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(videos || [], { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/video error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

// 🔹 POST: Upload a new video
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectedToDatabase();

    const body = (await req.json()) as IVideo;

    const { videoUrl, thumbnailUrl, description, title, transformation, controls } = body;

    if (!videoUrl || !thumbnailUrl || !description || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const videoData = {
      ...body,
      controls: controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo);
  } catch (error: unknown) {
    console.error("POST /api/video error:", error);
    return NextResponse.json({ error: "Uploading failed" }, { status: 500 });
  }
}
