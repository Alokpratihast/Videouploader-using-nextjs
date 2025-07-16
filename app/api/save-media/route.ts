// File: app/api/save-media/route.ts

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import Video from "@/models/video";

// ✅ DB connection
const MONGO_URI = process.env.MONGODB_URI || "your_mongodb_connection_string";
async function connectToDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
}

// ✅ POST: Save media (only if authenticated)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDB();
    const body = await req.json();

    const { url, name, fileType, thumbnail } = body;

    if (!url || !fileType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newMedia = await Video.create({
      url,
      name,
      fileType,
      thumbnail: thumbnail || "",
      uploadedBy: session.user.id,
    });

    return NextResponse.json({
      message: "Media saved successfully",
      data: newMedia,
    }, { status: 201 });
  } catch (error) {
    console.error("Error saving media:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ GET: Fetch all media (or only user's media if userOnly=true)
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const userOnly = searchParams.get("userOnly") === "true";

    let mediaList;

    if (userOnly) {
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      mediaList = await Video.find({ uploadedBy: session.user.id }).sort({ createdAt: -1 });
    } else {
      mediaList = await Video.find().sort({ createdAt: -1 }).lean();
    }
     const sanitized = mediaList.map((item) => ({
      ...item,
      uploadedBy: item.uploadedBy?.toString(),
    }));

    return NextResponse.json(mediaList, { status: 200 });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
