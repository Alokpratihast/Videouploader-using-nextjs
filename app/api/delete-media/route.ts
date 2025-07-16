// File: app/api/delete-media/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import { connectedToDatabase } from "@/lib/db";
import Video from "@/models/video"; // ✅ Use your centralized Video model


export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    await connectedToDatabase();

    console.log("🧑 Session user ID:", session.user.id);
    console.log("🧾 Media ID to delete:", id);

    const media = await Video.findById(id);

    if (!media) {
      console.log("❌ Media not found:", id);
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    if (!media.uploadedBy || media.uploadedBy.toString() !== session.user.id) {
      console.log("🚫 Forbidden: Media not owned by user.");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Video.deleteOne({ _id: id });

    console.log("✅ Deleted media:", id);
    

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
