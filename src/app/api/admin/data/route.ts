import { NextRequest, NextResponse } from "next/server";
import { getData, updateSection } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = getData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ success: false, error: "Failed to read data" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { section, data } = await req.json();
    if (!section || data === undefined) {
      return NextResponse.json({ success: false, error: "Section and data required" }, { status: 400 });
    }
    updateSection(section, data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update data" }, { status: 500 });
  }
}
