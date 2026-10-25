import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import BackToTop from "@/components/layout/BackToTop";

import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Akash Kumar Prajapati | Mobile & Web Developer | Flutter, React Native & Web";
const FALLBACK_DESCRIPTION =
  "Portfolio of Akash Kumar Prajapati — Senior Software Engineer specializing in Flutter, React Native and web. Crafting high-performance mobile apps and web storefronts.";
const FALLBACK_KEYWORDS = [
  "Flutter Developer",
  "React Native Developer",
  "Mobile App Developer",
  "Web Developer",
  "Web App Developer",
  "Software Engineer",
  "Akash Kumar Prajapati",
  "Cross-platform Apps",
  "iOS Developer",
  "Android Developer",
];

async function getSettings(): Promise<{ title?: string; description?: string; keywords?: string[] }> {
  try {
    const { connectToDatabase } = await import("@/lib/mongodb");
    const { db } = await connectToDatabase();
    const doc = await db.collection("settings").findOne({ slug: "main" });
    if (doc) {
      const { _id, slug, ...rest } = doc;
      return rest as { title?: string; description?: string; keywords?: string[] };
    }
  } catch {
    /* fall back to defaults */
  }
  return {};
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.title || FALLBACK_TITLE;
  const description = settings.description || FALLBACK_DESCRIPTION;
  const keywords = Array.isArray(settings.keywords) && settings.keywords.length
    ? settings.keywords
    : FALLBACK_KEYWORDS;

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Akash Kumar Prajapati" }],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: "index, follow",
    icons: { icon: "/favicon.svg" },
  };
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ScrollProgress />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </ThemeProvider>
  );
}
