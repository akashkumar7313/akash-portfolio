import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import BackToTop from "@/components/layout/BackToTop";
import FloatingSocialSidebar from "@/components/layout/FloatingSocialSidebar";
import Chatbot from "@/components/sections/Chatbot";
import { ThemeProvider } from "next-themes";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ScrollProgress />
      <Navbar />
      <FloatingSocialSidebar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <Chatbot />
    </ThemeProvider>
  );
}
