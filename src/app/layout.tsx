import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akash Kumar Prajapati | Mobile App Developer | Flutter & React Native Expert",
  description:
    "Portfolio of Akash Kumar Prajapati — Senior Software Engineer specializing in Flutter & React Native. Crafting beautiful, high-performance cross-platform mobile apps.",
  keywords: [
    "Flutter Developer",
    "React Native Developer",
    "Mobile App Developer",
    "Software Engineer",
    "Akash Kumar Prajapati",
    "Cross-platform Apps",
    "iOS Developer",
    "Android Developer",
  ],
  authors: [{ name: "Akash Kumar Prajapati" }],
  openGraph: {
    title: "Akash Kumar Prajapati | Mobile App Developer",
    description:
      "Senior Software Engineer specializing in Flutter & React Native. Crafting beautiful, high-performance cross-platform mobile apps.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akash Kumar Prajapati | Mobile App Developer",
    description: "Senior Software Engineer | Flutter & React Native Expert",
  },
  robots: "index, follow",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="relative">{children}</body>
    </html>
  );
}
