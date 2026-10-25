"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiArrowUpRight,
  FiLink,
  FiMapPin,
  FiPhone,
  FiSend,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import TiltCard from "@/components/ui/TiltCard";
import { FOOTER_DEFAULTS } from "@/lib/defaults";
import { resolveIcon } from "@/lib/iconMap";

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

const SOCIAL_FALLBACK: { icon: React.ComponentType<{ className?: string }>; href: string; label: string }[] = [
  { icon: FiGithub, href: "https://github.com/akashkumar7313", label: "GitHub" },
  { icon: FiLinkedin, href: "https://www.linkedin.com/in/akash-kumar-prajapati/", label: "LinkedIn" },
  { icon: FaWhatsapp, href: "https://wa.me/916393342727?text=Hi%20Akash!%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect.", label: "WhatsApp" },
  { icon: FiMail, href: "mailto:akashkumarprajapati2003@gmail.com", label: "Email" },
];

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const year = new Date().getFullYear();
  const [content, setContent] = useState(FOOTER_DEFAULTS);
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetch("/api/footer")
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d === "object" && !d.error) {
          setContent({ ...FOOTER_DEFAULTS, ...d });
        }
      })
      .catch(() => {});
    fetch("/api/socialLinks")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d) && d.length) setSocials(d);
      })
      .catch(() => {});
  }, []);

  const f = content;
  const quickLinks = Array.isArray(f.quickLinks) && f.quickLinks.length ? f.quickLinks : FOOTER_DEFAULTS.quickLinks;
  const socialLinks = socials.length
    ? socials.map((s) => ({
        icon: resolveIcon(s.icon, FiLink),
        href: s.url,
        label: s.platform,
      }))
    : SOCIAL_FALLBACK;

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-[#101412]/5 px-4 pb-8 pt-14 dark:border-[#c9f36c]/8 sm:px-8 md:pt-20">
      <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-[#c9f36c]/8 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute right-1/4 top-10 h-52 w-52 rounded-full bg-[#a8d94a]/5 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="bento mb-4 overflow-hidden"
        >
          <div className="relative grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center lg:p-10">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#c9f36c]/[0.12] blur-[90px]" />
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "linear-gradient(rgba(201,243,108,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(201,243,108,0.12) 1px, transparent 1px)", backgroundSize: "38px 38px", maskImage: "radial-gradient(circle at 70% 40%, black, transparent 70%)" }} />
            <div className="relative">
              <span className="bento-label">{f.ctaKicker}</span>
              <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-[#101412] sm:text-4xl dark:text-[#f4f7f2]">
                {f.ctaBefore}{" "}
                <span className="text-[#16a34a] dark:text-[#c9f36c]">{f.ctaAccent}</span>{" "}
                {f.ctaAfter}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#6b7280] dark:text-[#91a096]">
                {f.ctaDesc}
              </p>
            </div>
            <Link
              href="/contact"
              className="group relative inline-flex w-fit items-center gap-2 rounded-full bg-[#c9f36c] px-6 py-3.5 text-sm font-semibold text-[#101412] shadow-lg shadow-[#c9f36c]/20 transition-all duration-300 hover:scale-[1.03] hover:bg-[#d9ff8a]"
            >
              {f.ctaButton}
              <FiSend className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </motion.div>

        <div className="bento-grid">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="bento bento-pad md:col-span-5"
          >
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] text-lg font-black text-[#101412]">A</span>
              <span className="text-lg font-bold text-[#101412] dark:text-[#f4f7f2]">
                {f.brand}<span className="text-[#16a34a] dark:text-[#c9f36c]">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#6b7280] dark:text-[#91a096]">
              {f.bio}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="bento-chip"><FiMapPin /> {f.location}</span>
              <span className="bento-chip"><FiPhone /> {f.phone}</span>
            </div>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-4xl font-black tracking-tight text-[#16a34a] dark:text-[#c9f36c]">
                {isInView ? <CountUp end={Number(f.years) || 4} duration={1.8} /> : 0}
              </span>
              <span className="pb-1 text-xs leading-tight text-[#6b7280] dark:text-[#91a096]">{f.yearsLabel}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bento bento-pad md:col-span-3"
          >
            <h4 className="bento-label mb-4">{f.navigateLabel}</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 md:grid-cols-1">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="group inline-flex items-center gap-1 text-sm text-[#4b5563] transition-colors hover:text-[#16a34a] dark:text-[#91a096] dark:hover:text-[#c9f36c]">
                    <FiArrowUpRight className="text-[10px] opacity-0 transition-all group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bento bento-pad md:col-span-4"
          >
            <h4 className="bento-label mb-4">{f.connectLabel}</h4>
            <div className="grid grid-cols-2 gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-xl border border-[#101412]/8 bg-[#101412]/[0.02] px-3 py-2.5 text-xs font-medium text-[#4b5563] transition-all duration-300 hover:border-[#c9f36c]/40 hover:bg-[#c9f36c]/10 hover:text-[#16a34a] dark:border-[#c9f36c]/10 dark:bg-white/[0.03] dark:text-[#91a096] dark:hover:text-[#c9f36c]"
                >
                  <link.icon className="text-sm transition-transform duration-300 group-hover:scale-110" />
                  {link.label}
                </a>
              ))}
            </div>
            <TiltCard intensity={4} glow="201 243 108" className="mt-3 rounded-2xl">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  {f.availabilityTitle}
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">
                  {f.availabilityDesc}
                </p>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#101412]/5 pt-6 text-[11px] text-[#6b7280] dark:border-[#c9f36c]/8 dark:text-[#91a096] sm:flex-row">
          <p>&copy; {year} {f.bottomLeft}</p>
          <p className="font-mono uppercase tracking-[0.18em]">{f.bottomRight}</p>
        </div>
      </div>
    </footer>
  );
}
