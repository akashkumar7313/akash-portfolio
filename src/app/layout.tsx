import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akash Kumar Prajapati | Senior Mobile App Developer",
  description:
    "Portfolio of Akash Kumar Prajapati — Software Engineer specializing in Flutter & React Native. Builds scalable, high-performance mobile apps for Android & iOS.",
  keywords: [
    "Flutter Developer",
    "React Native Developer",
    "Mobile App Developer",
    "Software Engineer",
    "Akash Kumar Prajapati",
    "Cross-platform Apps",
  ],
  authors: [{ name: "Akash Kumar Prajapati" }],
  openGraph: {
    title: "Akash Kumar Prajapati | Senior Mobile App Developer",
    description:
      "Software Engineer specializing in Flutter & React Native. I build scalable, high-performance mobile apps.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akash Kumar Prajapati",
    description: "Software Engineer | Flutter & React Native Developer",
  },
  robots: "index, follow",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative">{children}</body>
    </html>
  );
}
