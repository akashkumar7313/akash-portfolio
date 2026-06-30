import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const iconUrl = await fetchAppIcon(url);
    if (iconUrl) {
      return NextResponse.json({ iconUrl });
    }
    return NextResponse.json({ error: "Could not fetch app icon" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch app icon" }, { status: 500 });
  }
}

async function fetchAppIcon(url: string): Promise<string | null> {
  // Google Play Store
  if (url.includes("play.google.com")) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
      });
      const html = await res.text();
      const match = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
      if (match?.[1]) {
        const base = match[1].split("=")[0];
        return base + "=s512";
      }
    } catch {
      return null;
    }
  }

  // Apple App Store
  if (url.includes("apps.apple.com")) {
    const idMatch = url.match(/id(\d+)/);
    if (idMatch?.[1]) {
      try {
        const res = await fetch(`https://itunes.apple.com/lookup?id=${idMatch[1]}`);
        const data = await res.json();
        if (data.results?.[0]?.artworkUrl512) {
          return data.results[0].artworkUrl512;
        }
      } catch {
        return null;
      }
    }
  }

  return null;
}
