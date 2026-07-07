import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const RESUME_FILE = process.env.VERCEL
  ? "/tmp/resume.pdf"
  : path.join(process.cwd(), ".data/resume.pdf");

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const isCheck = req.nextUrl.searchParams.get("check") === "true";

  if (isCheck) {
    try {
      if (!fs.existsSync(RESUME_FILE)) {
        return NextResponse.json({ exists: false, size: 0, modified: null });
      }
      const stat = fs.statSync(RESUME_FILE);
      return NextResponse.json({ exists: true, size: stat.size, modified: stat.mtime.toISOString() });
    } catch {
      return NextResponse.json({ exists: false, size: 0, modified: null });
    }
  }

  try {
    if (!fs.existsSync(RESUME_FILE)) {
      return NextResponse.json({ success: false, error: "No resume uploaded" }, { status: 404 });
    }
    const fileBuffer = fs.readFileSync(RESUME_FILE);
    const stat = fs.statSync(RESUME_FILE);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(stat.size),
        "Content-Disposition": `inline; filename="resume.pdf"`,
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
    const dir = path.dirname(RESUME_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(RESUME_FILE, Buffer.from(bytes));
    const stat = fs.statSync(RESUME_FILE);
    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      actualSize: stat.size,
      modified: stat.mtime.toISOString(),
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
    if (fs.existsSync(RESUME_FILE)) {
      fs.unlinkSync(RESUME_FILE);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete resume" }, { status: 500 });
  }
}
