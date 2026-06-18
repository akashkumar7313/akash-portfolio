import { NextRequest, NextResponse } from "next/server";
import { getData, type SiteData } from "@/lib/db";

const validSections: (keyof SiteData)[] = [
  "hero", "about", "skills", "experience", "education",
  "projects", "testimonials", "stats", "contact", "settings",
  "socialLinks",
];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  if (!validSections.includes(section as keyof SiteData)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 404 });
  }
  const data = getData();
  const sectionData = data[section as keyof SiteData];
  return NextResponse.json(sectionData);
}
