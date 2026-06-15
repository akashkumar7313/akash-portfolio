import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import BackToTop from "@/components/layout/BackToTop";
import FloatingSocialSidebar from "@/components/layout/FloatingSocialSidebar";
import Chatbot from "@/components/sections/Chatbot";

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
    description:
      "Software Engineer | Flutter & React Native Developer",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="relative">
        <ScrollProgress />
        <Navbar />
        <FloatingSocialSidebar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <BackToTop />
        <Chatbot />
      </body>
    </html>
  );
}
