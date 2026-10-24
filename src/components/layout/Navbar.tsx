"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { FiArrowUpRight } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Experience", href: "/experience" },
  { label: "Process", href: "/process" },
  { label: "Education", href: "/education" },
  { label: "Projects", href: "/projects" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <nav
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl px-3 transition-all duration-500 sm:h-16 sm:px-4 ${
          scrolled
            ? "glass-nav"
            : "border border-transparent bg-transparent"
        }`}
      >
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] shadow-lg shadow-[#c9f36c]/20 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">
            <span className="text-lg font-black text-[#101412]">A</span>
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full border border-[#101412] bg-[#101412] dark:border-[#0b0f0c]" />
          </span>
          <span className="text-lg font-bold tracking-tight text-[#101412] dark:text-[#f4f7f2]">
            Akash<span className="text-[#16a34a] dark:text-[#c9f36c]">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative whitespace-nowrap rounded-full px-2.5 py-2 text-[12px] font-medium transition-colors duration-300 xl:px-3 xl:text-[13px] ${
                  isActive
                    ? "text-[#101412]"
                    : "text-[#4b5563] hover:text-[#101412] dark:text-[#91a096] dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[#c9f36c] shadow-[0_0_24px_rgba(201,243,108,0.25)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#101412]/10 bg-[#101412] px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#16a34a] dark:border-[#c9f36c]/20 dark:bg-[#c9f36c] dark:text-[#101412] dark:hover:bg-[#d9ff8a] sm:flex"
          >
            Let&apos;s talk <FiArrowUpRight />
          </Link>
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#101412]/10 bg-white/60 text-lg text-[#101412] backdrop-blur transition-colors hover:bg-white dark:border-[#c9f36c]/15 dark:bg-white/[0.04] dark:text-[#f4f7f2] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-[#101412]/10 bg-[#f7faf4]/95 p-3 shadow-2xl shadow-black/20 backdrop-blur-2xl dark:border-[#c9f36c]/[0.12] dark:bg-[#0b0f0c]/95 lg:hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${idx === navLinks.length - 1 ? "col-span-2" : ""} ${
                        isActive
                          ? "bg-[#c9f36c] text-[#101412]"
                          : "bg-[#101412]/[0.03] text-[#374151] hover:bg-[#c9f36c]/15 dark:bg-white/[0.04] dark:text-[#c9f36c]/80"
                      }`}
                    >
                      {link.label}
                      <FiArrowUpRight className="text-xs opacity-50" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <Link
              href="/contact"
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[#101412] px-4 py-3.5 text-sm font-semibold text-white dark:bg-[#c9f36c] dark:text-[#101412]"
            >
              Start a project <FiArrowUpRight />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
