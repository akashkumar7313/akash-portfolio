import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  return NextResponse.json({ authenticated: token === "authenticated" });
}
