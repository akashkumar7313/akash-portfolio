"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiArrowUpRight,
  FiSend,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { icon: FiGithub, href: "https://github.com/akashkumar7313", label: "GitHub", color: "hover:text-white" },
  { icon: FiLinkedin, href: "https://www.linkedin.com/in/akash-kumar-prajapati/", label: "LinkedIn", color: "hover:text-blue-400" },
  { icon: FaWhatsapp, href: "https://wa.me/916393342727?text=Hi%20Akash!%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect.", label: "WhatsApp", color: "hover:text-green-400" },
  { icon: FiMail, href: "mailto:akashkumarprajapati2003@gmail.com", label: "Email", color: "hover:text-[#c9f36c]" },
];

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden" ref={ref}>
      {/* Top gradient line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="h-px bg-gradient-to-r from-transparent via-[#c9f36c]/40 to-transparent origin-center"
      />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#c9f36c]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#a8d94a]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-width px-4 py-12 sm:px-8 md:py-16 relative">
        {/* Top section - CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            <span className="gradient-text">Let&apos;s Build Something</span>
            <br />
            <span className="text-dark-100 dark:text-white">Amazing Together</span>
          </h2>
          <p className="text-dark-400 text-sm sm:text-base max-w-md mx-auto mb-6">
            Have a project in mind? I&apos;m always open to discussing new opportunities.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#c9f36c] to-[#a8d94a] text-[#101412] text-sm font-semibold shadow-lg shadow-[#c9f36c]/20 hover:shadow-[#c9f36c]/40 hover:scale-105 transition-all duration-300 group"
          >
            <FiSend className="group-hover:translate-x-1 transition-transform" />
            Start a Conversation
          </Link>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="sm:col-span-2 lg:col-span-4"
          >
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] flex items-center justify-center shadow-lg shadow-[#c9f36c]/20 group-hover:shadow-[#c9f36c]/40 group-hover:scale-110 transition-all duration-500">
                  <span className="text-white font-bold text-base font-heading">A</span>
                </div>
              </div>
              <span className="text-xl font-bold gradient-text">
                Akash<span className="text-dark-100 dark:text-white">.</span>
              </span>
            </Link>

            <p className="text-dark-400 text-sm leading-relaxed mb-4 max-w-xs">
              Software Engineer specializing in Flutter & React Native. Building high-performance cross-platform mobile apps.
            </p>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 text-dark-400 text-xs">
                <FiMapPin className="text-[#c9f36c]" />
                <span>Lucknow, India</span>
              </div>
              <div className="flex items-center gap-2 text-dark-400 text-xs">
                <FiPhone className="text-[#a8d94a]" />
                <span>+91 63933 42727</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-heading text-[#c9f36c] tabular-nums">
                {isInView ? <CountUp end={4} duration={2} /> : 0}
              </span>
              <span className="text-dark-400 text-xs">+ Years of Experience</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="sm:col-span-1 lg:col-span-2"
          >
            <h4 className="text-dark-100 dark:text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-dark-400 text-sm hover:text-white transition-all duration-300 flex items-center gap-1.5 group/link"
                  >
                    <FiArrowUpRight className="text-[10px] opacity-0 group-hover/link:opacity-100 -ml-4 group-hover/link:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="sm:col-span-1 lg:col-span-3"
          >
            <h4 className="text-dark-100 dark:text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-dark-400 ${link.color} hover:border-current/30 hover:bg-current/[0.05] transition-all duration-300 group relative overflow-hidden`}
                  title={link.label}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-current/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <link.icon className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="sm:col-span-2 lg:col-span-3"
          >
            <h4 className="text-dark-100 dark:text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Availability
            </h4>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-400 text-sm font-medium">Available for Work</span>
                </div>
                <p className="text-dark-400 text-xs leading-relaxed">
                  Open to freelance projects and full-time opportunities. Let&apos;s create something exceptional.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-white/[0.04]"
        >
          <p className="text-dark-500 text-xs sm:text-sm">
            &copy; {year} Copyright by Akash Kumar Prajapati
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-transparent to-[#c9f36c]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9f36c]/40" />
            <div className="w-8 h-0.5 rounded-full bg-gradient-to-l from-transparent to-[#a8d94a]/30" />
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
