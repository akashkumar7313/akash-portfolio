import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const isCheck = req.nextUrl.searchParams.get("check") === "true";

  try {
    const { db } = await connectToDatabase();
    const resume = await db.collection("resume").findOne({ slug: "current" });

    if (isCheck) {
      if (!resume) {
        return NextResponse.json({ exists: false, size: 0, modified: null });
      }
      return NextResponse.json({
        exists: true,
        size: resume.size || 0,
        modified: resume.modified || null,
      });
    }

    if (!resume || !resume.data) {
      return NextResponse.json({ success: false, error: "No resume uploaded" }, { status: 404 });
    }

    const buffer = Buffer.from(resume.data, "base64");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(buffer.length),
        "Content-Disposition": `inline; filename="${resume.fileName || 'resume.pdf'}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to read resume" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ success: false, error: "Only PDF files are allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const { db } = await connectToDatabase();
    await db.collection("resume").updateOne(
      { slug: "current" },
      {
        $set: {
          data: base64,
          fileName: file.name,
          fileSize: file.size,
          size: base64.length,
          modified: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      modified: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to upload resume" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();
    await db.collection("resume").deleteOne({ slug: "current" });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete resume" }, { status: 500 });
  }
}
