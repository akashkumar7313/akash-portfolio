import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const resume = await db.collection("resume").findOne({ slug: "current" });

    if (!resume || !resume.data) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const buffer = Buffer.from(resume.data, "base64");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(buffer.length),
        "Content-Disposition": `inline; filename="${resume.fileName || 'resume.pdf'}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to read resume" }, { status: 500 });
  }
}
