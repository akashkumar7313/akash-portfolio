import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const data = await db.collection("contact").findOne({ slug: "main" });
    return NextResponse.json(data || {});
  } catch {
    return NextResponse.json({ error: "Failed to fetch contact" }, { status: 500 });
  }
}
