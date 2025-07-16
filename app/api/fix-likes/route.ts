// File: app/api/fix-likes/route.ts

import {  NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions"; // adjust path if needed
import { connectedToDatabase } from "@/lib/db";
import Video from "@/models/video";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectedToDatabase();

    const result = await Video.updateMany(
      { likes: { $exists: false } },
      { $set: { likes: [] } }
    );

    return NextResponse.json({
      message: "Likes field added to existing videos (if missing)",
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.error("Fix-likes error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
