"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiAward,
  FiBookOpen,
  FiCompass,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";

interface EducationItem {
  degree: string;
  school: string;
  period: string;
  icon: string;
}

interface AchievementItem {
  icon: string;
  text: string;
  gradient: string;
  accent: string;
}

export default function Education() {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);

  useEffect(() => {
    fetch("/api/education")
      .then((r) => r.json())
      .then((data) => {
        setEducation(data.education || []);
        setAchievements(data.achievements || []);
      })
      .catch(() => {});
  }, []);

  if (education.length === 0 && achievements.length === 0) return null;

  return (
    <section id="education" className="section-padding relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
      <div className="relative z-10 mx-auto max-w-6xl px-1 sm:px-0">
        <SectionHeading
          title="Education & Achievements"
          kicker="Education"
          subtitle="A computer-science foundation, sharpened by products and recognition in the field."
          icon={<FiBookOpen />}
        />

        <div className="bento-grid">
          <div className="md:col-span-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="bento-icon"><FiBookOpen /></span>
              <div>
                <h3 className="text-sm font-semibold text-[#101412] dark:text-[#f4f7f2]">Education</h3>
                <p className="text-[10px] text-[#6b7280] dark:text-[#91a096]">Formal foundations</p>
              </div>
            </div>

            <div className="relative space-y-3">
              <div aria-hidden className="absolute bottom-6 left-[21px] top-6 w-px bg-gradient-to-b from-[#c9f36c]/70 via-[#a8d94a]/30 to-transparent" />
              {education.map((edu, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="relative pl-14"
                >
                  <span className="absolute left-0 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#c9f36c]/30 bg-[#f7faf4] font-mono text-[10px] font-bold text-[#16a34a] shadow-[0_0_20px_rgba(201,243,108,0.25)] dark:bg-[#101612] dark:text-[#c9f36c]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <TiltCard intensity={6} glow="201 243 108" className="rounded-[26px]">
                    <div className="bento bento-hover relative overflow-hidden p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#c9f36c]/20 bg-[#c9f36c]/10 text-xl">
                          {edu.icon}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold leading-snug text-[#101412] dark:text-[#f4f7f2] sm:text-base">
                            {edu.degree}
                          </h4>
                          <p className="mt-1 text-xs text-[#6b7280] dark:text-[#91a096]">{edu.school}</p>
                          <span className="mt-2.5 inline-flex items-center gap-1 rounded-full border border-[#c9f36c]/25 bg-[#c9f36c]/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[#16a34a] dark:text-[#c9f36c]">
                            <FiTrendingUp /> {edu.period}
                          </span>
                        </div>
                      </div>
                      <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#c9f36c]/10 blur-2xl" />
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="bento-icon"><FiAward /></span>
              <div>
                <h3 className="text-sm font-semibold text-[#101412] dark:text-[#f4f7f2]">Achievements</h3>
                <p className="text-[10px] text-[#6b7280] dark:text-[#91a096]">Milestones worth framing</p>
              </div>
            </div>

            <div className="space-y-3">
              {achievements.map((ach, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.1 }}
                >
                  <TiltCard intensity={7} glow="168 217 74" className="rounded-[26px]">
                    <div className="bento bento-hover relative overflow-hidden p-5">
                      <div className="relative flex items-center gap-4">
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                          <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(201,243,108,0.8),transparent,rgba(168,217,74,0.6),transparent,rgba(201,243,108,0.8))] opacity-70 motion-safe:animate-spin [animation-duration:9s]" />
                          <span className="absolute inset-[3px] rounded-full bg-[#f7faf4] dark:bg-[#101612]" />
                          <span className="relative text-xl">{ach.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-snug text-[#101412] dark:text-[#f4f7f2]">{ach.text}</p>
                          <p className="mt-1 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#16a34a] dark:text-[#c9f36c]">
                            <FiStar /> Recognized achievement
                          </p>
                        </div>
                      </div>
                      <div className="relative mt-4 h-px w-full overflow-hidden bg-[#101412]/5 dark:bg-[#c9f36c]/10">
                        <motion.span
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#c9f36c] to-[#a8d94a]"
                          initial={{ width: "0%" }}
                          whileInView={{ width: `${74 + i * 12}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.35 + i * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.3 }}
                className="rounded-[26px] border border-dashed border-[#c9f36c]/25 bg-[#c9f36c]/[0.04] p-5"
              >
                <span className="flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#16a34a] dark:text-[#c9f36c]">
                  <FiCompass /> Still exploring
                </span>
                <p className="mt-2 text-xs leading-relaxed text-[#6b7280] dark:text-[#91a096]">
                  Always learning — currently deepening my craft in mobile architecture, motion, and product engineering.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
