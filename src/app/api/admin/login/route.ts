import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    const valid = verifyPassword(password);
    if (!valid) {
      return NextResponse.json({ success: false }, { status: 401 });
    }
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
