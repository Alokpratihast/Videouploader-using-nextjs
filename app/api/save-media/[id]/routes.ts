// app/api/save-media/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import { connectedToDatabase } from "@/lib/db";
import Video from "@/models/video";

// ✅ GET: Fetch all media by user ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectedToDatabase();

    const videos = await Video.find({ uploadedBy: params.id }).sort({ createdAt: -1 });

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error("GET /save-media/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

// ✅ DELETE: Delete media by media ID (not user ID!)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectedToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const media = await Video.findById(params.id);

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // ✅ Check ownership before allowing delete
    if (media.uploadedBy.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Video.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error("DELETE /save-media/[id] error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
