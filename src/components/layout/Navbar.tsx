"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Experience", href: "/experience" },
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
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#f4f7f2]/80 dark:bg-[#101412]/80 backdrop-blur-2xl border-b border-[#c9f36c]/10 shadow-lg shadow-black/5 dark:shadow-2xl dark:shadow-black/20"
          : "bg-transparent"
      }`}
    >
      {/* Animated gradient line at top */}
      {scrolled && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9f36c]/60 to-transparent" />
      )}

      <div className="max-width flex items-center justify-between px-4 sm:px-8 h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group relative">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] flex items-center justify-center shadow-lg shadow-[#c9f36c]/20 group-hover:shadow-[#c9f36c]/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <span className="text-[#101412] font-bold text-sm font-heading">A</span>
            </div>
          </div>
          <span className="text-xl md:text-2xl font-bold gradient-text">
            Akash<span className="text-[#101412] dark:text-white">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 relative">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  isActive
                    ? "text-[#101412] dark:text-white"
                    : "text-gray-600 dark:text-dark-400 hover:text-[#101412] dark:hover:text-white"
                }`}
              >
                {/* Active bg */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/[0.08] rounded-xl border border-white/[0.06]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {/* Hover bg */}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/[0.03] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-dark-300 text-xl relative group"
            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
            aria-label="Toggle menu"
          >
            <div className="absolute inset-0 bg-white/[0.05] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">
              {mobileOpen ? <HiX /> : <HiMenu />}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t backdrop-blur-2xl"
            style={{ borderColor: "rgba(255,255,255,0.04)", backgroundColor: "rgba(6,6,11,0.95)" }}
          >
            <div className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                        isActive
                          ? "text-white bg-white/[0.08] border border-white/[0.06]"
                          : "text-dark-400 hover:text-white hover:bg-white/[0.03]"
                      }`}
                    >
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                      )}
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
