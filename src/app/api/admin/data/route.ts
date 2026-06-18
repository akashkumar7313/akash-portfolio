import { NextRequest, NextResponse } from "next/server";
import { getData, updateSection, type SiteData } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  return NextResponse.json(getData());
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    const { section, data } = await req.json();
    if (!section || data === undefined) {
      return NextResponse.json({ success: false, error: "Missing section or data" }, { status: 400 });
    }
    const updated = updateSection(section as keyof SiteData, data);
    return NextResponse.json({ success: true, data: updated[section as keyof SiteData] });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
