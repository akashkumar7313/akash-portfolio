import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/admin/login?error=access_denied", req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/admin/login?error=not_configured", req.url));
  }

  // Use hardcoded redirect URI to avoid origin issues on Vercel
  const redirectUri = "https://the-dev-akash.vercel.app/api/admin/auth/google/callback";

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("Token exchange failed:", errText);
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

    // Only this email is allowed
    const userEmail = (user.email || "").trim().toLowerCase();
    if (userEmail !== "akashkumarprajapati2003@gmail.com") {
      return NextResponse.redirect(new URL("/admin/login?error=unauthorized", req.url));
    }

    // Build response with redirect to admin
    const response = NextResponse.redirect("https://the-dev-akash.vercel.app/admin");

    // Set session cookie
    response.cookies.set("admin_token", "authenticated", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
      domain: ".vercel.app",
    });

    // Store user info cookie
    response.cookies.set("admin_user", JSON.stringify({
      name: user.name,
      email: user.email,
      picture: user.picture,
    }), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
      domain: ".vercel.app",
    });

    return response;
  } catch (e) {
    console.error("Google auth error:", e);
    return NextResponse.redirect(new URL("/admin/login?error=server_error", req.url));
  }
}
