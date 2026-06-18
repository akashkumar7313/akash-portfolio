import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, updatePassword } from "@/lib/db";

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }
    const result = updatePassword(oldPassword, newPassword);
    if (!result) {
      return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 401 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
