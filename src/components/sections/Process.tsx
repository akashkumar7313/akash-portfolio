"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiCheck,
  FiLayers,
  FiGlobe,
  FiServer,
} from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";import { PROCESS_DEFAULTS } from "@/lib/defaults";
import { resolveIcon } from "@/lib/iconMap";

const positions = [
  { x: 17, y: 18 }, { x: 50, y: 18 }, { x: 83, y: 18 },
  { x: 83, y: 50 }, { x: 50, y: 50 }, { x: 17, y: 50 },
  { x: 17, y: 82 }, { x: 50, y: 82 }, { x: 83, y: 82 },
];

const flowPath = "M17,18 H80 Q83,18 83,21 V47 Q83,50 80,50 H20 Q17,50 17,53 V79 Q17,82 20,82 H83";

interface ProcessProps {
  fullPage?: boolean;
}

export default function Process({ fullPage = false }: ProcessProps) {
  const [active, setActive] = useState<number | null>(null);
  const [data, setData] = useState<any>(PROCESS_DEFAULTS);

  useEffect(() => {
    fetch("/api/process")
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d === "object" && !d.error) {
          setData({ ...PROCESS_DEFAULTS, ...d });
        }
      })
      .catch(() => {});
  }, []);

  const p = data;
  const steps: any[] = Array.isArray(p.steps) && p.steps.length ? p.steps : PROCESS_DEFAULTS.steps;
  const stats: any[] = Array.isArray(p.stats) ? p.stats : PROCESS_DEFAULTS.stats;
  const platforms: any[] = Array.isArray(p.platforms) && p.platforms.length ? p.platforms : PROCESS_DEFAULTS.platforms;
  const freelanceBullets: string[] = Array.isArray(p.freelanceBullets) ? p.freelanceBullets : PROCESS_DEFAULTS.freelanceBullets;

  return (
    <section id="process" className="section-padding relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
      <div className="relative z-10 mx-auto max-w-6xl px-1 sm:px-0">
        <SectionHeading
          title={fullPage ? p.titleFull : p.titleHome}
          kicker="Process"
          subtitle={fullPage ? p.subtitleFull : p.subtitleHome}
          icon={<FiLayers />}
        />

        <div className="bento-grid">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="md:col-span-12 lg:col-span-8"
          >
            <div className="bento relative overflow-hidden p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="bento-label flex items-center gap-1.5"><FiLayers /> {p.flowLabel}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[#6b7280] dark:text-[#91a096]">{p.flowMeta}</span>
                  {!fullPage && (
                    <Link href={p.flowLinkHref || "/process"} className="inline-flex items-center gap-1 rounded-full border border-[#101412]/10 px-2.5 py-1 text-[9px] font-semibold text-[#16a34a] transition-colors hover:border-[#c9f36c]/50 dark:border-[#c9f36c]/15 dark:text-[#c9f36c]">
                      {p.flowLink} <FiArrowUpRight />
                    </Link>
                  )}
                </div>
              </div>

              <div className="relative hidden h-[440px] w-full lg:block" onMouseLeave={() => setActive(null)}>
                <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                  <path
                    d={flowPath}
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="process-link"
                  />
                  <circle r="1" fill="#c9f36c">
                    <animateMotion dur="12s" repeatCount="indefinite" path={flowPath} />
                  </circle>
                </svg>

                {steps.map((step, i) => {
                  const pos = positions[i % positions.length];
                  const Icon = resolveIcon(step.icon, FiLayers);
                  const isActive = active === i;
                  return (
                    <div
                      key={`${step.n}-${i}`}
                      onMouseEnter={() => setActive(i)}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      className="absolute z-10 w-[29%] -translate-x-1/2 -translate-y-1/2"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.94 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className={`min-h-[128px] rounded-2xl border p-3.5 backdrop-blur transition-all duration-300 ${
                          isActive
                            ? "border-[#c9f36c] bg-[#c9f36c]/[0.13] shadow-[0_0_42px_-10px_rgba(201,243,108,0.55)]"
                            : "border-[#101412]/10 bg-white/70 hover:border-[#c9f36c]/50 dark:border-[#c9f36c]/[0.13] dark:bg-[#0d1512]/85"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-[#16a34a] dark:text-[#c9f36c]">{step.n}</span>
                          <span className="rounded-full border border-[#101412]/8 px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-[#6b7280] dark:border-[#c9f36c]/10 dark:text-[#91a096]">
                            {step.phase}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Icon className="shrink-0 text-sm text-[#16a34a] dark:text-[#c9f36c]" />
                          <h3 className="text-xs font-semibold leading-tight text-[#101412] dark:text-[#f4f7f2]">{step.title}</h3>
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-[10px] leading-snug text-[#6b7280] dark:text-[#91a096]">{step.desc}</p>
                        <div className="mt-2 flex items-center gap-1.5 border-t border-[#101412]/6 pt-1.5 dark:border-[#c9f36c]/10">
                          <span className="h-1 w-1 rounded-full bg-[#16a34a] dark:bg-[#c9f36c]" />
                          <span className="truncate text-[8px] font-medium text-[#16a34a] dark:text-[#c9f36c]">{step.deliverable}</span>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              <div className="relative lg:hidden">
                <div aria-hidden className="absolute bottom-3 left-[17px] top-3 w-px bg-gradient-to-b from-[#c9f36c] via-[#c9f36c]/35 to-transparent" />
                {steps.map((step, i) => {
                  const Icon = resolveIcon(step.icon, FiLayers);
                  return (
                    <motion.div
                      key={`${step.n}-${i}`}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.03 }}
                      className="relative mb-2.5 pl-10"
                    >
                      <span className="absolute left-[17px] top-4 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border border-[#c9f36c]/40 bg-[#0d1512] font-mono text-[8px] text-[#16a34a] dark:text-[#c9f36c]">
                        {step.n}
                      </span>
                      <div className="rounded-xl border border-[#101412]/8 bg-white/50 p-3 dark:border-[#c9f36c]/10 dark:bg-white/[0.03]">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Icon className="text-xs text-[#16a34a] dark:text-[#c9f36c]" />
                            <h3 className="text-[11px] font-semibold text-[#101412] dark:text-[#f4f7f2]">{step.title}</h3>
                          </div>
                          <span className="text-[8px] uppercase tracking-wider text-[#6b7280] dark:text-[#91a096]">{step.phase}</span>
                        </div>
                        <p className="mt-1 text-[10px] leading-snug text-[#6b7280] dark:text-[#91a096]">{step.desc}</p>
                        <div className="mt-1.5 flex items-center gap-1.5 border-t border-[#101412]/6 pt-1.5 dark:border-[#c9f36c]/10">
                          <span className="h-1 w-1 rounded-full bg-[#16a34a] dark:bg-[#c9f36c]" />
                          <span className="text-[8px] font-medium text-[#16a34a] dark:text-[#c9f36c]">{step.deliverable}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-xl border border-[#101412]/8 bg-white/40 px-2.5 py-2 dark:border-[#c9f36c]/10 dark:bg-white/[0.03]">
                    <p className="text-sm font-black text-[#101412] dark:text-[#f4f7f2]">{item.value}</p>
                    <p className="text-[8px] uppercase tracking-wider text-[#6b7280] dark:text-[#91a096]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 md:col-span-12 md:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bento h-full p-5">
                <div className="flex items-center justify-between">
                  <span className="bento-label">{p.surfacesLabel}</span>
                  <FiGlobe className="text-[#16a34a] dark:text-[#c9f36c]" />
                </div>
                <div className="mt-5 flex flex-col items-center">
                  <div className="rounded-2xl bg-gradient-to-br from-[#d9ff8a] via-[#c9f36c] to-[#a8d94a] px-4 py-2 text-center text-[#101412] shadow-lg shadow-[#c9f36c]/20">
                    <p className="text-[11px] font-black leading-tight">{p.surfacesHeadline}</p>
                    <p className="text-[8px] font-medium opacity-60">{p.surfacesSub}</p>
                  </div>
                  <div className="h-4 w-px bg-[#16a34a]/30 dark:bg-[#c9f36c]/30" />
                  <div className="grid w-full grid-cols-3 gap-1.5">
                    {platforms.map((surface) => {
                      const SurfaceIcon = resolveIcon(surface.icon, FiGlobe);
                      return (
                        <div key={surface.label} className="flex flex-col items-center gap-1 rounded-xl border border-[#101412]/8 bg-white/45 py-2 dark:border-[#c9f36c]/10 dark:bg-white/[0.03]">
                          <SurfaceIcon className="text-sm text-[#16a34a] dark:text-[#c9f36c]" />
                          <span className="text-[9px] font-medium text-[#4b5563] dark:text-[#cbd5ce]">{surface.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#16a34a]/20 px-2 py-1.5 text-[9px] text-[#6b7280] dark:border-[#c9f36c]/20 dark:text-[#91a096]">
                    <FiServer /> {p.surfacesNote}
                  </div>
                </div>
                <p className="mt-4 text-center text-[10px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">
                  {p.surfacesFooter}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.18 }}
            >
              <div className="bento relative h-full overflow-hidden p-5">
                <div aria-hidden className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[#c9f36c]/[0.12] blur-3xl" />
                <span className="bento-kicker">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9f36c]" />
                  {p.freelanceKicker}
                </span>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-[#101412] dark:text-[#f4f7f2]">{p.freelanceTitle}</h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">
                  {p.freelanceDesc}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {freelanceBullets.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[10px] text-[#4b5563] dark:text-[#cbd5ce]">
                      <FiCheck className="shrink-0 text-[#16a34a] dark:text-[#c9f36c]" /> {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#c9f36c] px-4 py-2.5 text-xs font-semibold text-[#101412] transition-colors hover:bg-[#d9ff8a]"
                >
                  {p.freelanceCta} <FiArrowUpRight />
                </Link>
                <p className="mt-2 text-center text-[9px] text-[#6b7280] dark:text-[#6b7a70]">{p.freelanceNote}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
