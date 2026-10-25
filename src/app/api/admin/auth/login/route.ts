import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCredentials } from "@/lib/credentials";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const creds = await getCredentials();

    if (email !== creds.email || password !== creds.password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_token", "authenticated", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
