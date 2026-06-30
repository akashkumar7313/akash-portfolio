import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const RESUME_FILE = process.env.VERCEL
  ? "/tmp/resume.pdf"
  : path.join(process.cwd(), "public/uploads/resume.pdf");

export async function GET() {
  try {
    if (!fs.existsSync(RESUME_FILE)) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    const fileBuffer = fs.readFileSync(RESUME_FILE);
    const stat = fs.statSync(RESUME_FILE);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(stat.size),
        "Content-Disposition": `inline; filename="resume.pdf"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to read resume" }, { status: 500 });
  }
}
