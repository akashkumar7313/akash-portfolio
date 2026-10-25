"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import DeliveryPipeline from "./DeliveryPipeline";
import {
  FiArrowUpRight,
  FiCheck,
  FiChevronDown,
  FiShield,
} from "react-icons/fi";
import { PROCESS_DEFAULTS } from "@/lib/defaults";
import { resolveIcon } from "@/lib/iconMap";

function SectionIntro({ kicker, title, desc }: { kicker: string; title: string; desc: string }) {
  return (
    <div className="mb-6 max-w-2xl">
      <span className="bento-label">{kicker}</span>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#101412] sm:text-3xl dark:text-[#f4f7f2]">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#6b7280] dark:text-[#91a096]">{desc}</p>
    </div>
  );
}

export default function ProcessDetails() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
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
  const phases: any[] = Array.isArray(p.phases) ? p.phases : PROCESS_DEFAULTS.phases;
  const deliverables: any[] = Array.isArray(p.deliverables) ? p.deliverables : PROCESS_DEFAULTS.deliverables;
  const models: any[] = Array.isArray(p.models) ? p.models : PROCESS_DEFAULTS.models;
  const qualityGates: string[] = Array.isArray(p.qualityGates) ? p.qualityGates : PROCESS_DEFAULTS.qualityGates;
  const faqs: any[] = Array.isArray(p.faqs) ? p.faqs : PROCESS_DEFAULTS.faqs;
  const rules: string[] = Array.isArray(p.rules) ? p.rules : PROCESS_DEFAULTS.rules;
  const ruleTags: string[] = Array.isArray(p.ruleTags) ? p.ruleTags : PROCESS_DEFAULTS.ruleTags;
  const startPoints: string[] = Array.isArray(p.startPoints) ? p.startPoints : PROCESS_DEFAULTS.startPoints;
  const faqTags: string[] = Array.isArray(p.faqTags) ? p.faqTags : PROCESS_DEFAULTS.faqTags;

  return (
    <>
      <section id="pipeline" className="relative overflow-hidden px-4 pb-16 sm:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro kicker={p.pipeKicker} title={p.pipeTitle} desc={p.pipeDesc} />
          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <DeliveryPipeline />
            <div className="bento relative h-full overflow-hidden p-5 sm:p-6">
              <div aria-hidden className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#c9f36c]/[0.12] blur-3xl" />
              <span className="bento-label">Pipeline rules</span>
              <h3 className="mt-2 text-lg font-bold tracking-tight text-[#101412] dark:text-[#f4f7f2]">{p.rulesTitle}</h3>
              <div className="mt-4 space-y-2.5">
                {rules.map((rule) => (
                  <div key={rule} className="flex items-start gap-2.5 rounded-xl border border-[#101412]/6 bg-white/40 px-3 py-2.5 dark:border-[#c9f36c]/8 dark:bg-white/[0.02]">
                    <FiCheck className="mt-0.5 shrink-0 text-[#16a34a] dark:text-[#c9f36c]" />
                    <span className="text-[10px] leading-relaxed text-[#4b5563] dark:text-[#cbd5ce]">{rule}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {ruleTags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#101412]/8 px-2.5 py-1 text-center text-[9px] text-[#6b7280] dark:border-[#c9f36c]/10 dark:text-[#91a096]">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 pb-16 sm:px-8">
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro kicker={p.phasesKicker} title={p.phasesTitle} desc={p.phasesDesc} />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bento overflow-hidden"
          >
            <div className="hidden grid-cols-12 gap-3 border-b border-[#101412]/8 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6b7280] dark:border-[#c9f36c]/10 dark:text-[#91a096] md:grid">
              <span className="col-span-3">Phase</span>
              <span className="col-span-5">Output</span>
              <span className="col-span-4">Sign-off</span>
            </div>
            {phases.map((phase) => (
              <div
                key={phase.n}
                className="grid gap-1.5 border-b border-[#101412]/6 px-5 py-4 last:border-0 dark:border-[#c9f36c]/8 md:grid-cols-12 md:items-center md:gap-3"
              >
                <div className="flex items-center gap-2 md:col-span-3">
                  <span className="font-mono text-[10px] text-[#16a34a] dark:text-[#c9f36c]">{phase.n}</span>
                  <span className="text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">{phase.title}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#6b7280] dark:text-[#91a096] md:col-span-5">{phase.output}</p>
                <span className="w-fit rounded-full border border-[#c9f36c]/25 bg-[#c9f36c]/10 px-2 py-0.5 font-mono text-[9px] text-[#16a34a] dark:text-[#c9f36c] md:col-span-4">
                  {phase.gate}
                </span>
              </div>
            ))}
          </motion.div>
          <p className="mt-2 text-[10px] text-[#6b7280] dark:text-[#6b7a70]">Each gate is a decision point — approved, revised or blocked.</p>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 pb-16 sm:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro kicker={p.delKicker} title={p.delTitle} desc={p.delDesc} />
          <div className="bento-grid">
            {deliverables.map((item, idx) => {
              const Icon = resolveIcon(item.icon, FiShield);
              return (
                <motion.div
                  key={`${item.title}-${idx}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="bento bento-hover p-4 md:col-span-6 lg:col-span-3"
                >
                  <span className="bento-icon"><Icon /></span>
                  <h3 className="mt-3 text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">{item.title}</h3>
                  <p className="mt-1 text-[10px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 pb-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionIntro kicker={p.modKicker} title={p.modTitle} desc={p.modDesc} />
          <div className="bento-grid">
            {models.map((model, idx) => (
              <motion.div
                key={`${model.title}-${idx}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                className="md:col-span-4"
              >
                <div className={`relative h-full overflow-hidden rounded-[26px] border p-5 sm:p-6 ${model.accent ? "border-[#c9f36c]/45 bg-gradient-to-br from-[#c9f36c]/[0.14] to-transparent" : "border-[#101412]/8 bg-white/45 dark:border-[#c9f36c]/10 dark:bg-white/[0.03]"}`}>
                  {model.accent && (
                    <span className="absolute right-4 top-4 rounded-full bg-[#c9f36c] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#101412]">Most popular</span>
                  )}
                  <span className="bento-chip">{model.tag}</span>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-[#101412] dark:text-[#f4f7f2]">{model.title}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">{model.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {(model.points || []).map((point: string) => (
                      <li key={point} className="flex items-start gap-2 text-[10px] text-[#4b5563] dark:text-[#cbd5ce]">
                        <FiCheck className="mt-0.5 shrink-0 text-[#16a34a] dark:text-[#c9f36c]" /> {point}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="mt-5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#16a34a] hover:underline dark:text-[#c9f36c]">
                    Discuss this model <FiArrowUpRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 pb-16 sm:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
        <div className="relative mx-auto max-w-6xl">
          <div className="bento-grid">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="md:col-span-7"
            >
              <div className="bento h-full p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <span className="bento-icon"><FiShield /></span>
                  <div>
                    <p className="text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">{p.qualityTitle}</p>
                    <p className="text-[10px] text-[#6b7280] dark:text-[#91a096]">{p.qualitySub}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {qualityGates.map((gate) => (
                    <div key={gate} className="flex items-center gap-2 rounded-xl border border-[#101412]/6 bg-white/40 px-3 py-2 dark:border-[#c9f36c]/8 dark:bg-white/[0.02]">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#c9f36c]/20 text-[8px] text-[#16a34a] dark:text-[#c9f36c]"><FiCheck /></span>
                      <span className="text-[10px] text-[#4b5563] dark:text-[#cbd5ce]">{gate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="md:col-span-5"
            >
              <div className="bento relative h-full overflow-hidden p-5 sm:p-6">
                <div aria-hidden className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#c9f36c]/[0.12] blur-3xl" />
                <span className="bento-label">{p.startKicker}</span>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-[#101412] dark:text-[#f4f7f2]">{p.startTitle}</h3>
                <p className="mt-2 text-[11px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">
                  {p.startDesc}
                </p>
                <div className="mt-4 space-y-2">
                  {startPoints.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[10px] text-[#4b5563] dark:text-[#cbd5ce]">
                      <FiCheck className="text-[#16a34a] dark:text-[#c9f36c]" /> {item}
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#c9f36c] px-4 py-2.5 text-xs font-semibold text-[#101412] transition-colors hover:bg-[#d9ff8a]">
                  {p.startCta} <FiArrowUpRight />
                </Link>
                <p className="mt-2 text-center text-[9px] text-[#6b7280] dark:text-[#6b7a70]">{p.startNote}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="faq" className="relative overflow-hidden px-4 pb-20 sm:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
        <div className="relative mx-auto max-w-6xl">
          <div className="bento overflow-hidden">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="relative overflow-hidden border-b border-[#101412]/8 p-6 sm:p-8 lg:border-b-0 lg:border-r dark:border-[#c9f36c]/10"
              >
                <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#c9f36c]/[0.1] blur-[80px]" />
                <span className="bento-kicker">{p.faqKicker}</span>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#101412] sm:text-3xl dark:text-[#f4f7f2]">
                  {p.faqTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#6b7280] dark:text-[#91a096]">
                  {p.faqDesc}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  {faqTags.map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-xl border border-[#101412]/6 bg-white/40 px-2.5 py-2 dark:border-[#c9f36c]/8 dark:bg-white/[0.02]">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#c9f36c]/20 text-[8px] text-[#16a34a] dark:text-[#c9f36c]"><FiCheck /></span>
                      <span className="text-[9px] font-medium text-[#4b5563] dark:text-[#cbd5ce]">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-[#c9f36c]/25 bg-[#c9f36c]/[0.08] p-4">
                  <p className="text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">{p.faqStillTitle}</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-[#6b7280] dark:text-[#91a096]">{p.faqStillDesc}</p>
                  <Link href="/contact" className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-[#16a34a] hover:underline dark:text-[#c9f36c]">
                    {p.faqStillCta} <FiArrowUpRight />
                  </Link>
                </div>
              </motion.div>

              <div className="divide-y divide-[#101412]/6 dark:divide-[#c9f36c]/8">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <motion.div
                      key={`${faq.q}-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.2) }}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="group flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-[#c9f36c]/[0.04] sm:px-6"
                        aria-expanded={isOpen}
                      >
                        <span className="pt-0.5 font-mono text-[9px] text-[#16a34a] dark:text-[#c9f36c]">{String(idx + 1).padStart(2, "0")}</span>
                        <span className="flex-1 text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">{faq.q}</span>
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? "border-[#c9f36c] bg-[#c9f36c] text-[#101412]" : "border-[#101412]/10 text-[#16a34a] group-hover:border-[#c9f36c]/40 dark:border-[#c9f36c]/15 dark:text-[#c9f36c]"}`}>
                          <FiChevronDown className={`text-xs transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <p className="px-5 pb-4 pl-[52px] pr-10 text-[11px] leading-relaxed text-[#6b7280] sm:px-6 sm:pl-[58px] dark:text-[#91a096]">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
