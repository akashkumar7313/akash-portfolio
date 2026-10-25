"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiBriefcase,
  FiChevronRight,
  FiMapPin,
} from "react-icons/fi";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  type: string;
  location: string;
  color: string;
  skills: string[];
  description: string[];
}

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/experience")
      .then((r) => r.json())
      .then((data) => setExperiences(data.experiences || []))
      .catch(() => {});
  }, []);

  const toggleExpanded = (idx: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
      <div className="relative z-10 mx-auto max-w-6xl px-1 sm:px-0">
        <SectionHeading
          title="Work Experience"
          kicker="Experience"
          subtitle="A timeline of teams, products, and problems I have helped solved."
          icon={<FiBriefcase />}
        />

        <div className="relative">
          <div
            aria-hidden
            className="absolute bottom-6 left-[19px] top-4 w-px bg-gradient-to-b from-[#c9f36c] via-[#c9f36c]/35 to-transparent sm:left-[23px]"
          />

          <div className="space-y-4">
            {experiences.map((exp, idx) => {
              const isOpen = expanded.has(idx);
              const isLast = idx === experiences.length - 1;
              return (
                <motion.div
                  key={`${exp.role}-${idx}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.07 }}
                  className="relative grid grid-cols-[40px_1fr] gap-3 sm:grid-cols-[48px_1fr] sm:gap-4"
                >
                  {/* rail node */}
                  <div className="relative flex justify-center pt-6">
                    <span className="absolute left-1/2 top-6 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border border-[#c9f36c]/45 bg-[#0d1512] shadow-[0_0_18px_-4px_rgba(201,243,108,0.65)] sm:h-6 sm:w-6">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c9f36c]" />
                    </span>
                    {!isLast && (
                      <span className="absolute left-1/2 top-11 h-[calc(100%-11px)] w-px -translate-x-1/2 bg-[#101412]/10 dark:bg-[#c9f36c]/12" />
                    )}
                  </div>

                  <TiltCard intensity={2} glow="201 243 108" className="min-w-0 rounded-[26px]">
                    <div className="bento min-w-0 overflow-hidden">
                      <button
                        onClick={() => toggleExpanded(idx)}
                        className="group relative block w-full min-w-0 p-5 text-left sm:p-6"
                      >
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-y-0 left-0 w-1"
                          style={{
                            background: `linear-gradient(to bottom, ${exp.color || "#c9f36c"}, transparent)`,
                          }}
                        />
                        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#c9f36c]/25 bg-[#c9f36c]/10 font-mono text-[11px] font-bold text-[#16a34a] dark:text-[#c9f36c]">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[#101412] dark:text-[#f4f7f2]">{exp.company}</p>
                              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#6b7280] dark:text-[#91a096]">
                                <FiMapPin /> {exp.location}
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 rounded-full border border-[#101412]/8 bg-[#101412]/[0.03] px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[#6b7280] dark:border-[#c9f36c]/10 dark:bg-white/[0.03] dark:text-[#91a096]">
                            {exp.period}
                          </span>
                        </div>

                        <h3 className="mt-4 text-lg font-black tracking-tight text-[#101412] sm:text-xl dark:text-[#f4f7f2]">
                          {exp.role}
                        </h3>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <span className="bento-chip">
                            <FaApple className="text-[9px]" /><FaGooglePlay className="text-[9px]" /> {exp.type}
                          </span>
                          <span className="flex flex-wrap gap-1.5">
                            {exp.skills.slice(0, isOpen ? 6 : 3).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full border border-[#101412]/8 bg-[#101412]/[0.02] px-2 py-0.5 text-[9px] text-[#4b5563] dark:border-[#c9f36c]/10 dark:bg-white/[0.03] dark:text-[#91a096]"
                              >
                                {skill}
                              </span>
                            ))}
                            {!isOpen && exp.skills.length > 3 && (
                              <span className="text-[9px] leading-5 text-[#6b7280] dark:text-[#91a096]">
                                +{exp.skills.length - 3}
                              </span>
                            )}
                          </span>
                        </div>

                        <span className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#16a34a] transition-colors group-hover:text-[#101412] dark:text-[#c9f36c] dark:group-hover:text-[#d9ff8a]">
                          {isOpen ? "Hide details" : "Impact & stack"}
                          <FiChevronRight
                            className={`transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                          />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.32, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-[#101412]/6 px-5 pb-5 pt-4 sm:px-6 dark:border-[#c9f36c]/8">
                              <div className="grid gap-4 md:grid-cols-12">
                                <div className="md:col-span-3">
                                  <p className="bento-label mb-2">Stack</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {exp.skills.map((skill) => (
                                      <span key={skill} className="bento-chip">{skill}</span>
                                    ))}
                                  </div>
                                </div>
                                <div className="md:col-span-9">
                                  <p className="bento-label mb-2">Impact</p>
                                  <ul className="space-y-2">
                                    {exp.description.map((item, i) => (
                                      <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.22, delay: i * 0.04 }}
                                        className="flex gap-2 text-xs leading-relaxed text-[#4b5563] dark:text-[#c5cdc8]"
                                      >
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9f36c]" />
                                        {item}
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
