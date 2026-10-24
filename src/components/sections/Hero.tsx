"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiDownload,
  FiMapPin,
  FiStar,
} from "react-icons/fi";
import { SiFlutter, SiReact } from "react-icons/si";
import Link from "next/link";
import Stats from "./Stats";
import CodeShowcase from "./CodeShowcase";
import TiltCard from "@/components/ui/TiltCard";

const roles = [
  "Software Engineer",
  "Flutter Developer",
  "React Native Developer",
  "Mobile & Web Developer",
  "Mobile App Architect",
];

function useTypingAnimation(texts: string[]) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout: NodeJS.Timeout;

    if (!deleting && charIndex < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayed(currentText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 70);
    } else if (!deleting && charIndex === currentText.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(currentText.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, 35);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts]);

  return displayed;
}

export default function Hero() {
  const typedRole = useTypingAnimation(roles);
  const [resumeUrl, setResumeUrl] = useState("");
  const [particles, setParticles] = useState(true);

  useEffect(() => {
    fetch("/api/hero")
      .then((r) => r.json())
      .then((d) => {
        if (d?.resumeUrl) setResumeUrl(d.resumeUrl);
      })
      .catch(() => {});
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        if (s?.particles === false) setParticles(false);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="hero" className="relative overflow-hidden pb-14 pt-28 sm:pt-32 lg:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
      {particles && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-[#c9f36c]/50"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                opacity: 0.15 + ((i * 7) % 10) / 28,
                boxShadow: "0 0 10px rgba(201,243,108,0.5)",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-8">
        <div className="grid items-start gap-4 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="bento relative overflow-hidden p-5 sm:p-7 lg:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,243,108,0.16),transparent_52%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(201,243,108,0.1),transparent_48%)]"
              />
              <div aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#c9f36c]/50 to-transparent" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-[18px] border border-[#c9f36c]/30 bg-[#101412] font-mono text-[13px] font-bold tracking-tight text-[#c9f36c] shadow-[0_18px_34px_-22px_rgba(201,243,108,0.6)] dark:border-[#c9f36c]/[0.35]">
                      AK
                      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#f7faf4] bg-emerald-400 dark:border-[#0b0f0c]" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#101412] dark:text-[#f4f7f2]">
                          Available for work
                        </span>
                        <span className="hidden h-1 w-1 rounded-full bg-[#16a34a]/60 dark:bg-[#c9f36c]/60 sm:block" />
                        <span className="hidden font-mono text-[8.5px] uppercase tracking-[0.18em] text-[#16a34a] dark:text-[#c9f36c] sm:inline">
                          Remote / On-site
                        </span>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#6b7280] dark:text-[#91a096]">
                        <FiMapPin className="text-[10px]" /> Lucknow, India · IST
                      </p>
                    </div>
                  </div>
                  <span className="hidden shrink-0 rounded-full border border-[#101412]/8 bg-white/40 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#6b7280] dark:border-[#c9f36c]/10 dark:bg-white/[0.03] dark:text-[#91a096] lg:block">
                    Portfolio / 26
                  </span>
                </div>

                <div className="my-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-gradient-to-r from-[#101412]/10 to-transparent dark:from-[#c9f36c]/15" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#6b7280] dark:text-[#91a096]">
                    Product engineer · Mobile + Web
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-l from-[#101412]/10 to-transparent dark:from-[#c9f36c]/15" />
                </div>

                <h1 className="text-[clamp(2.5rem,6.4vw,4.9rem)] font-black leading-[0.94] tracking-[-0.055em] text-[#101412] dark:text-[#f4f7f2]">
                  Akash Kumar
                  <br />
                  <span className="bg-gradient-to-r from-[#16a34a] via-[#84cc16] to-[#a8d94a] bg-clip-text text-transparent dark:from-[#c9f36c] dark:via-[#d9ff8a] dark:to-[#a8d94a]">
                    Prajapati
                  </span>
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <div className="flex min-h-8 items-center gap-2 rounded-full border border-[#101412]/8 bg-white/45 px-3 py-1.5 font-mono text-[11px] text-[#4b5563] dark:border-[#c9f36c]/10 dark:bg-white/[0.03] dark:text-[#91a096] sm:text-xs">
                    <span className="text-[#16a34a] dark:text-[#c9f36c]">{"//"}</span>
                    <span>{typedRole}</span>
                    <span className="inline-block h-3.5 w-[2px] animate-pulse bg-[#16a34a] dark:bg-[#c9f36c]" />
                  </div>
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-[#6b7280] dark:text-[#91a096]">
                    4+ years · Android · iOS · Web
                  </span>
                </div>

                <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#6b7280] dark:text-[#91a096] sm:text-[15px]">
                  I turn complex product ideas into fast, polished mobile apps and web storefronts.{" "}
                  <span className="font-medium text-[#101412] dark:text-[#f4f7f2]">4+ years</span> shipping
                  production Android, iOS and web experiences with Flutter, React Native, and modern web tooling.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="bento-chip"><FiStar className="text-amber-400" /> Best Developer of the Year</span>
                  <span className="bento-chip"><FiStar className="text-[#16a34a] dark:text-[#c9f36c]" /> Employee of the Month</span>
                </div>

                <div className="mt-7 border-t border-[#101412]/8 pt-5 dark:border-[#c9f36c]/10">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      href="/projects"
                      className="group inline-flex items-center gap-2 rounded-full bg-[#c9f36c] px-5 py-3 text-sm font-semibold text-[#101412] shadow-lg shadow-[#c9f36c]/20 transition-all hover:bg-[#d9ff8a] hover:shadow-[#c9f36c]/35"
                    >
                      View projects
                      <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                    <a
                      href={resumeUrl && !resumeUrl.startsWith("data:") ? resumeUrl : "/api/resume"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[#101412]/10 bg-white/50 px-5 py-3 text-sm font-semibold text-[#374151] backdrop-blur transition-all hover:border-[#c9f36c]/50 hover:bg-[#c9f36c]/10 dark:border-[#c9f36c]/15 dark:bg-white/[0.03] dark:text-[#f4f7f2]"
                    >
                      <FiDownload /> Resume
                    </a>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-3 text-sm font-semibold text-[#16a34a] transition-colors hover:text-[#101412] dark:text-[#c9f36c] dark:hover:text-white sm:ml-auto"
                    >
                      Contact <FiArrowUpRight />
                    </Link>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-[#6b7280] dark:text-[#91a096]">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Open to select projects
                    </span>
                    <span className="hidden h-1 w-1 rounded-full bg-[#101412]/15 dark:bg-[#c9f36c]/20 sm:block" />
                    <span>Android · iOS · Web</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
            >
              <TiltCard intensity={5} glow="201 243 108" className="rounded-[26px]">
                <CodeShowcase />
              </TiltCard>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22 }}
                className="bento bento-hover p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="bento-icon"><SiFlutter /></span>
                  <span className="bento-icon"><SiReact /></span>
                </div>
                <p className="mt-3 text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">Mobile + web, one partner</p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">Flutter, React Native & web</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28 }}
                className="bento bento-hover p-4"
              >
                <div className="flex items-center gap-1.5">
                  <FiStar className="text-[#16a34a] dark:text-[#c9f36c]" />
                  <span className="text-2xl font-black tracking-tight text-[#101412] dark:text-[#f4f7f2]">4.9</span>
                  <span className="text-[10px] text-[#6b7280] dark:text-[#91a096]">/ 5</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">Client rating</p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">Across shipped products</p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Stats />
        </div>

        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#6b7280] transition-colors hover:text-[#16a34a] dark:text-[#91a096] dark:hover:text-[#c9f36c]"
        >
          Scroll to explore <FiArrowDown className="animate-bounce" />
        </motion.a>
      </div>
    </section>
  );
}
