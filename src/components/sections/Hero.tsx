"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiDownload,
  FiMapPin,
} from "react-icons/fi";
import { SiFlutter, SiReact } from "react-icons/si";
import Link from "next/link";
import Stats from "./Stats";
import CodeShowcase from "./CodeShowcase";
import TiltCard from "@/components/ui/TiltCard";
import { HERO_DEFAULTS } from "@/lib/defaults";

const ROLE_STYLES = [
  "text-[#16a34a] dark:text-[#c9f36c] font-mono font-bold",
  "text-[#2563eb] dark:text-[#7dd3fc] font-sans font-extrabold italic",
  "text-[#c026d3] dark:text-[#f0abfc] font-serif font-black",
  "text-[#ea580c] dark:text-[#fdba74] font-mono font-black tracking-[0.04em]",
  "text-[#0d9488] dark:text-[#5eead4] font-sans font-black uppercase tracking-[0.03em]",
];

function useTypingAnimation(texts: string[]) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (texts.length === 0) return;
    const currentText = texts[textIndex % texts.length];
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

  return { displayed, textIndex };
}

export default function Hero() {
  const [hero, setHero] = useState<any>(null);
  const [particles, setParticles] = useState(true);
  const [photoBroken, setPhotoBroken] = useState(false);

  useEffect(() => {
    fetch("/api/hero")
      .then((r) => r.json())
      .then((d) => setHero(d || {}))
      .catch(() => setHero({}));
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        if (s?.particles === false) setParticles(false);
      })
      .catch(() => {});
  }, []);

  const h = { ...HERO_DEFAULTS, ...(hero || {}) };
  const roles = useMemo<string[]>(
    () => (Array.isArray(h.roles) && h.roles.length ? h.roles : HERO_DEFAULTS.roles),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(h.roles)]
  );
  const badges = useMemo<any[]>(
    () => (Array.isArray(h.badges) ? h.badges : HERO_DEFAULTS.badges),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(h.badges)]
  );

  const { displayed: typedRole, textIndex: roleIndex } = useTypingAnimation(roles);
  const roleStyle = ROLE_STYLES[roleIndex % ROLE_STYLES.length];
  const resumeUrl = h.resumeUrl || "";

  return (
    <section id="hero" className="relative overflow-hidden pb-10 pt-20 sm:pt-24 lg:pb-16">
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
            className="min-w-0 lg:col-span-7"
          >
            <div className="bento relative flex min-h-[580px] flex-col overflow-hidden lg:min-h-[630px]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,243,108,0.16),transparent_52%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(201,243,108,0.1),transparent_48%)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.5]"
                style={{
                  backgroundImage: "radial-gradient(rgba(16,20,18,0.08) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                  maskImage: "radial-gradient(circle at 20% 0%, black, transparent 65%)",
                }}
              />
              <span aria-hidden className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 border-l border-t border-[#c9f36c]/60" />
              <span aria-hidden className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 border-r border-t border-[#c9f36c]/60" />
              <span aria-hidden className="pointer-events-none absolute bottom-2.5 left-2.5 h-3.5 w-3.5 border-b border-l border-[#c9f36c]/60" />
              <span aria-hidden className="pointer-events-none absolute bottom-2.5 right-2.5 h-3.5 w-3.5 border-b border-r border-[#c9f36c]/60" />

              {/* ── top strip: availability + id ───────────── */}
              <div className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-dashed border-[#101412]/12 px-5 py-2 sm:px-7 dark:border-[#c9f36c]/15">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#101412] dark:text-[#f4f7f2]">
                    {h.availableText}
                  </span>
                </div>
                <span className="rounded-full border border-dashed border-[#101412]/18 bg-white/45 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#6b7280] dark:border-[#c9f36c]/25 dark:bg-white/[0.03] dark:text-[#91a096]">
                  {h.portfolioTag}
                </span>
              </div>

              {/* ── name (full width) ────────────────────── */}
              <div className="relative px-5 pt-4 sm:px-7 lg:px-8">
                <h1
                  className="animate-name-gradient bg-clip-text text-[clamp(2.3rem,5.6vw,4.3rem)] font-black leading-[0.98] tracking-[-0.05em] text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(115deg, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
                  }}
                >
                  {h.prefix ? `${h.prefix} ` : ""}
                  {h.name}
                  <br />
                  {h.surname}
                </h1>
              </div>

              {/* ── body: content + identity rail ─────────── */}
              <div className="relative grid flex-1 gap-3 p-4 sm:p-4 lg:grid-cols-[1fr_230px] lg:gap-5 lg:p-5">
                <div className="order-2 min-w-0 lg:order-1">
                  {/* typewriter role */}
                  <div className="mt-3 flex min-h-10 w-full items-center gap-2 font-mono text-[16px] text-[#4b5563] dark:text-[#91a096] sm:text-[18px]">
                    <span className={`truncate transition-colors duration-500 ${roleStyle}`}>
                      {typedRole}
                    </span>
                    <span className="inline-block h-4 w-[2px] shrink-0 animate-pulse bg-[#16a34a] dark:bg-[#c9f36c]" />
                  </div>

                  <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.16em] text-[#6b7280] dark:text-[#91a096]">
                    {h.experienceLine}
                  </p>

                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6b7280] dark:text-[#91a096] sm:text-[15px]">
                    {h.tagline}
                  </p>

                  {/* CTA row */}
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                      <Link
                        href="/projects"
                        className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#c9f36c] px-5 py-3 text-sm font-semibold text-[#101412] shadow-lg shadow-[#c9f36c]/20 transition-all hover:bg-[#d9ff8a] hover:shadow-[#c9f36c]/35"
                      >
                        {h.ctaProjects}
                        <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#101412]/10 bg-[#101412] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#16a34a] dark:border-[#c9f36c]/20 dark:bg-[#c9f36c] dark:text-[#101412] dark:hover:bg-[#d9ff8a]"
                      >
                        Let's talk <FiArrowUpRight />
                      </Link>
                    </div>
                    <a
                      href={resumeUrl && !resumeUrl.startsWith("data:") ? resumeUrl : "/api/resume"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#101412]/10 bg-white/50 px-5 py-3 text-sm font-semibold text-[#374151] backdrop-blur transition-all hover:border-[#c9f36c]/50 hover:bg-[#c9f36c]/10 dark:border-[#c9f36c]/15 dark:bg-white/[0.03] dark:text-[#f4f7f2]"
                    >
                      <FiDownload /> {h.ctaResume}
                    </a>
                  </div>
                </div>

                {/* identity rail */}
                <aside className="order-1 min-w-0 lg:order-2 lg:border-l lg:border-dashed lg:border-[#101412]/12 lg:pl-6 lg:dark:border-[#c9f36c]/15">
                  <div className="flex flex-row flex-wrap items-center gap-4 lg:flex-col lg:items-stretch lg:gap-0">
                    <div className="relative w-fit shrink-0 self-start">
                      <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-[#c9f36c]/30 bg-[#101412] font-mono text-lg font-bold tracking-tight text-[#c9f36c] shadow-[0_18px_34px_-22px_rgba(201,243,108,0.6)] sm:h-20 sm:w-20 sm:text-xl dark:border-[#c9f36c]/[0.35]">
                        {h.photoUrl && !photoBroken ? (
                          <img
                            src={h.photoUrl}
                            alt={`${h.prefix ? `${h.prefix} ` : ""}${h.name} ${h.surname}`}
                            className="h-full w-full object-cover"
                            onError={() => setPhotoBroken(true)}
                          />
                        ) : (
                          "AK"
                        )}
                      </div>
                      <span className="absolute -bottom-[3.5px] -right-[3.5px] z-10 h-4 w-4 rounded-full border-2 border-[#f7faf4] bg-emerald-400 shadow-[0_2px_6px_rgba(16,185,129,0.45)] dark:border-[#0b0f0c]" />
                    </div>

                    <dl className="flex min-w-0 flex-1 flex-wrap gap-2 lg:mt-5 lg:flex-col lg:gap-0">
                      <div className="min-w-[128px] flex-1 rounded-xl border border-[#101412]/8 bg-white/45 px-3 py-2 lg:min-w-0 lg:rounded-none lg:border-0 lg:border-t lg:border-dashed lg:bg-transparent lg:px-0 lg:pt-2.5 lg:pb-0 dark:border-[#c9f36c]/10 dark:bg-white/[0.03] lg:dark:border-[#c9f36c]/12 lg:dark:bg-transparent">
                        <dt className="font-mono text-[8px] uppercase tracking-[0.24em] text-[#9ca3af] dark:text-[#6b7280]">Role</dt>
                        <dd className="mt-0.5 break-words text-[11px] font-semibold leading-snug text-[#374151] dark:text-[#f4f7f2]">{h.kicker}</dd>
                      </div>
                      <div className="min-w-[128px] flex-1 rounded-xl border border-[#101412]/8 bg-white/45 px-3 py-2 lg:min-w-0 lg:rounded-none lg:border-0 lg:border-t lg:border-dashed lg:bg-transparent lg:px-0 lg:pt-2.5 lg:pb-0 dark:border-[#c9f36c]/10 dark:bg-white/[0.03] lg:dark:border-[#c9f36c]/12 lg:dark:bg-transparent">
                        <dt className="font-mono text-[8px] uppercase tracking-[0.24em] text-[#9ca3af] dark:text-[#6b7280]">Location</dt>
                        <dd className="mt-0.5 flex items-center gap-1 break-words text-[11px] font-semibold leading-snug text-[#374151] dark:text-[#f4f7f2]">
                          <FiMapPin className="shrink-0 text-[#16a34a] dark:text-[#c9f36c]" /> {h.location}
                        </dd>
                      </div>
                      <div className="min-w-[128px] flex-1 rounded-xl border border-[#101412]/8 bg-white/45 px-3 py-2 lg:min-w-0 lg:rounded-none lg:border-0 lg:border-t lg:border-dashed lg:bg-transparent lg:px-0 lg:pt-2.5 lg:pb-0 dark:border-[#c9f36c]/10 dark:bg-white/[0.03] lg:dark:border-[#c9f36c]/12 lg:dark:bg-transparent">
                        <dt className="font-mono text-[8px] uppercase tracking-[0.24em] text-[#9ca3af] dark:text-[#6b7280]">Mode</dt>
                        <dd className="mt-0.5 break-words text-[11px] font-semibold leading-snug text-[#16a34a] dark:text-[#c9f36c]">{h.workMode}</dd>
                      </div>
                    </dl>

                    {badges.length > 0 && (
                      <div className="flex w-full flex-col gap-2 lg:mt-5">
                        {badges.map((b: any, i: number) => (
                          <span key={`${b.text}-${i}`} className="bento-chip w-full">
                            <span>{b.icon || "🏆"}</span> {b.text}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </aside>
              </div>

              {/* ── bottom status strip ───────────────────── */}
              <div className="relative mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-dashed border-[#101412]/12 px-5 py-2 sm:px-7 dark:border-[#c9f36c]/15">
                <span className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#101412] dark:text-[#f4f7f2]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> {h.statusLine}
                </span>
                <span className="rounded-full border border-dashed border-[#101412]/18 bg-white/45 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#6b7280] dark:border-[#c9f36c]/25 dark:bg-white/[0.03] dark:text-[#91a096]">
                  {h.platforms}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid min-w-0 gap-4 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="min-w-0"
            >
              <TiltCard intensity={4} glow="201 243 108" className="rounded-[26px]">
                <CodeShowcase
                  flutterFile={h.flutterFile}
                  flutterCode={h.flutterCode}
                  rnFile={h.rnFile}
                  rnCode={h.rnCode}
                />
              </TiltCard>
            </motion.div>

            <div className="grid min-w-0 grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22 }}
                className="bento bento-hover min-w-0 p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="bento-icon"><SiFlutter /></span>
                  <span className="bento-icon"><SiReact /></span>
                </div>
                <p className="mt-3 break-words text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">{h.card1Title}</p>
                <p className="mt-0.5 break-words text-[10px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">{h.card1Desc}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28 }}
                className="bento bento-hover min-w-0 p-4"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-[#101412] dark:text-[#f4f7f2]">{h.card2Value}</span>
                  <span className="text-[10px] text-[#6b7280] dark:text-[#91a096]">{h.card2Suffix}</span>
                </div>
                <p className="mt-2 break-words text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">{h.card2Title}</p>
                <p className="mt-0.5 break-words text-[10px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">{h.card2Desc}</p>
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
