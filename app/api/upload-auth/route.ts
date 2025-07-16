// File: app/api/upload-auth/route.ts

import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";

export async function GET() {
  const session = await getServerSession(authOptions);

    // ❌ Step 2: If no session, block access
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      console.error("❌ Missing ImageKit keys in environment variables.");
      return NextResponse.json(
        { error: "ImageKit keys are not configured." },
        { status: 500 }
      );
      
    }

    const authenticationParameter = getUploadAuthParams({
      privateKey,
      publicKey,
    });

    return NextResponse.json({
      authenticationParameter,
      publicKey,
      token: authenticationParameter.token,
  expire: authenticationParameter.expire,
  signature: authenticationParameter.signature,
    });
  } catch (error) {
    console.error("❌ Error generating ImageKit auth parameters:", error);
    return NextResponse.json(
      { error: "Failed to generate upload token." },
      { status: 500 }
    );
  }
}
