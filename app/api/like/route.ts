// File: app/api/like/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Video from "@/models/video";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const { mediaId } = body;

  console.log("✅ Reached POST /api/like with:", body);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(mediaId)) {
      return NextResponse.json({ error: "Invalid media ID" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const video = await Video.findById(mediaId);
    if (!video) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const userId = user._id.toString();
    const hasLiked = video.likes.some((id: mongoose.Types.ObjectId) => id.toString() === userId);

    if (hasLiked) {
      // Unlike
      video.likes = video.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like
      video.likes.push(user._id);
    }

    await video.save();

    return NextResponse.json({
      success: true,
      liked: !hasLiked,
      totalLikes: video.likes.length,
    });
  } catch (err) {
    console.error("Like API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "✅ API is working" });
}
