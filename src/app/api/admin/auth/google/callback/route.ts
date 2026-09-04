import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/admin/login?error=access_denied", req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!clientId || !clientSecret || !adminEmail) {
    return NextResponse.redirect(new URL("/admin/login?error=not_configured", req.url));
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${req.nextUrl.origin}/api/admin/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL("/admin/login?error=token_exchange_failed", req.url));
    }

    const tokens = await tokenRes.json();

    // Get user info
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(new URL("/admin/login?error=user_info_failed", req.url));
    }

    const user = await userRes.json();

    // Debug: log user info
    console.log("Google user:", JSON.stringify(user));
    console.log("ADMIN_EMAIL env:", adminEmail);
    console.log("User email:", user.email);

    // Check if email matches admin email
    if (!user.email || user.email.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.redirect(new URL(`/admin/login?error=unauthorized&email=${user.email || "none"}`, req.url));
    }

    // Set session cookie
    const response = NextResponse.redirect(new URL("/admin", req.url));
    response.cookies.set("admin_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    // Store user info in cookie for display
    response.cookies.set("admin_user", JSON.stringify({
      name: user.name,
      email: user.email,
      picture: user.picture,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL("/admin/login?error=server_error", req.url));
  }
}
