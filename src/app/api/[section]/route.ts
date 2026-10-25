import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { DEFAULTS } from "@/lib/defaults";

const validSections = [
  "hero", "about", "skills", "experience", "education",
  "projects", "testimonials", "stats", "contact", "settings",
  "socialLinks", "marquee", "explore", "navbar", "footer", "featured", "process",
];

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  if (!validSections.includes(section)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 404 });
  }
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection(section).findOne({ slug: "main" });
    if (doc) {
      const { _id, slug, ...rest } = doc;
      if (section === "socialLinks") {
        return NextResponse.json(rest.socialLinks || []);
      }
      return NextResponse.json(rest);
    }
    if (section === "socialLinks") {
      return NextResponse.json([]);
    }
    if (DEFAULTS[section]) {
      return NextResponse.json(DEFAULTS[section]);
    }
    return NextResponse.json({});
  } catch {
    if (section === "socialLinks") return NextResponse.json([]);
    if (DEFAULTS[section]) return NextResponse.json(DEFAULTS[section]);
    return NextResponse.json({ error: "Failed to fetch section" }, { status: 500 });
  }
}
