// ✅ File: app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectedToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { z } from "zod";

// Input validation schema
const RegisterSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = RegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { username, email, password } = result.data;

    await connectedToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered", user });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
