import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

const PUBLIC_COLLECTIONS = ["settings", "hero", "about", "skills", "experience", "education", "projects", "testimonials", "stats"];
const ADMIN_COLLECTIONS = [...PUBLIC_COLLECTIONS, "resume"];

export async function GET(req: NextRequest) {
  const collection = req.nextUrl.searchParams.get("collection");

  if (!collection) {
    return NextResponse.json({ error: "Collection parameter required" }, { status: 400 });
  }

  // Public access for read-only
  if (PUBLIC_COLLECTIONS.includes(collection)) {
    try {
      const { db } = await connectToDatabase();
      const data = await db.collection(collection).findOne({ slug: "main" });
      return NextResponse.json(data || {});
    } catch {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
  }

  // Admin access for all
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ADMIN_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    const data = await db.collection(collection).findOne({ slug: "main" });
    return NextResponse.json(data || {});
  } catch {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const collection = req.nextUrl.searchParams.get("collection");
  if (!collection || !ADMIN_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { db } = await connectToDatabase();
    await db.collection(collection).updateOne(
      { slug: "main" },
      { $set: { ...body, slug: "main" } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
}
