import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

const COLLECTIONS = ["settings", "hero", "about", "skills", "experience", "education", "projects", "testimonials", "stats", "contact", "socialLinks"];

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { db } = await connectToDatabase();
    const result: Record<string, unknown> = {};
    for (const col of COLLECTIONS) {
      const doc = await db.collection(col).findOne({ slug: "main" });
      if (doc) {
        const { _id, slug, ...rest } = doc;
        if (col === "socialLinks") {
          result[col] = rest.socialLinks || rest || [];
        } else {
          result[col] = rest;
        }
      }
    }
    return NextResponse.json(result);
  } catch (e) {
    console.error("Admin data fetch error:", e);
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
    const { db } = await connectToDatabase();
    if (section === "socialLinks") {
      await db.collection(section).updateOne(
        { slug: "main" },
        { $set: { slug: "main", socialLinks: data } },
        { upsert: true }
      );
    } else {
      await db.collection(section).updateOne(
        { slug: "main" },
        { $set: { ...data, slug: "main" } },
        { upsert: true }
      );
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Admin data save error:", e);
    return NextResponse.json({ success: false, error: "Failed to update data" }, { status: 500 });
  }
}
