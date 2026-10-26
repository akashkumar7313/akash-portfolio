"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCpu, FiGitBranch, FiLayers } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";

interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

const nodes = [
  { x: 50, y: 8 },
  { x: 20, y: 20 },
  { x: 80, y: 20 },
  { x: 9, y: 50 },
  { x: 91, y: 50 },
  { x: 20, y: 80 },
  { x: 80, y: 80 },
  { x: 50, y: 92 },
];

function linkPath(x: number, y: number) {
  const mx = (50 + x) / 2;
  const my = (50 + y) / 2;
  return `M50,50 C${mx},50 ${mx},${y} ${x},${y}`;
}

export default function Skills() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  const total = categories.reduce((sum, cat) => sum + cat.skills.length, 0);
  const activeCat = active !== null ? categories[active] : null;

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
      <div className="relative z-10 mx-auto max-w-6xl px-1 sm:px-0">
        <SectionHeading
          title="Skills & Expertise"
          kicker="Skills"
          subtitle="The tools I reach for when turning an idea into a shipped product."
          icon={<FiCpu />}
        />

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bento-icon"><FiLayers /></span>
            <div>
              <p className="text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">The skill map</p>
              <p className="text-[10px] text-[#6b7280] dark:text-[#91a096]">{categories.length} branches · {total} skills</p>
            </div>
          </div>
          <span className="bento-chip">Always learning</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="bento relative mb-6 hidden overflow-hidden p-5 md:block"
          onMouseLeave={() => setActive(null)}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,243,108,0.10),transparent_58%)]" />

          <div className="relative mb-1 flex items-center justify-between">
            <span className="bento-label flex items-center gap-1.5"><FiGitBranch /> Skill flow</span>
            <span className="font-mono text-[10px] text-[#6b7280] dark:text-[#91a096]">
              {activeCat ? activeCat.title : "hover a branch to trace it"}
            </span>
          </div>

          <div className="relative h-[460px] w-full md:h-[520px] lg:h-[590px] xl:h-[620px]">
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              {nodes.slice(0, categories.length).map((node, i) => {
                const isActive = active === i;
                return (
                  <path
                    key={i}
                    d={linkPath(node.x, node.y)}
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    className={`skill-link transition-all duration-300 ${isActive ? "skill-link-active" : ""} ${active !== null && !isActive ? "opacity-20" : ""}`}
                  />
                );
              })}
            </svg>

            <div className="absolute left-1/2 top-1/2 z-10 w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-gradient-to-br from-[#d9ff8a] via-[#c9f36c] to-[#a8d94a] px-5 py-5 text-center text-[#101412] shadow-[0_24px_70px_-20px_rgba(201,243,108,0.75)] sm:w-[224px]">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-60">Core stack</span>
              <p className="mt-1 text-lg font-black leading-tight">Akash&apos;s toolkit</p>
              <p className="mt-1 text-[11px] font-medium opacity-70">{total} skills · {categories.length} branches</p>
              <div className="mx-auto my-3 h-px w-12 bg-[#101412]/20" />
              <p className="min-h-9 text-[11px] font-semibold leading-snug">
                {activeCat ? activeCat.title : "Hover a branch to trace the stack"}
              </p>
              <p className="mt-1 text-[10px] leading-snug opacity-65">
                {activeCat ? activeCat.skills.slice(0, 3).join(" · ") : "Flutter · React Native · Firebase"}
              </p>
            </div>

            {nodes.slice(0, categories.length).map((node, i) => {
              const cat = categories[i];
              const isActive = active === i;
              return (
                <button
                  key={cat.title}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={`group absolute z-10 w-[124px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-3 text-left backdrop-blur transition-all duration-300 sm:w-[140px] md:w-[150px] xl:w-[168px] ${
                    isActive
                      ? "border-[#c9f36c] bg-[#c9f36c]/[0.14] shadow-[0_0_46px_-10px_rgba(201,243,108,0.65)]"
                      : "border-[#101412]/10 bg-white/75 hover:border-[#c9f36c]/60 dark:border-[#c9f36c]/[0.14] dark:bg-[#0d1512]/85"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{cat.icon}</span>
                    <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-[#101412] dark:text-[#f4f7f2]">{cat.title}</span>
                  </div>
                  <p className="mt-1.5 truncate text-[9px] text-[#6b7280] dark:text-[#91a096]">
                    {cat.skills.slice(0, 2).join(" · ")}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[9px] text-[#16a34a] dark:text-[#c9f36c]">
                      {String(cat.skills.length).padStart(2, "0")} skills
                    </span>
                    <span className={`h-1.5 w-1.5 rounded-full transition-colors ${isActive ? "bg-[#c9f36c]" : "bg-[#101412]/15 dark:bg-white/15"}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="relative md:hidden">
          <div aria-hidden className="absolute bottom-3 left-[19px] top-3 w-px bg-gradient-to-b from-[#c9f36c] via-[#c9f36c]/35 to-transparent" />
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="relative mb-3 pl-11"
            >
              <span className="absolute left-[19px] top-5 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#c9f36c] shadow-[0_0_0_4px_rgba(201,243,108,0.15)]" />
              <div className="bento bento-hover p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#c9f36c]/20 bg-[#c9f36c]/10 text-sm">{cat.icon}</span>
                    <h3 className="text-xs font-semibold text-[#101412] dark:text-[#f4f7f2]">{cat.title}</h3>
                  </div>
                  <span className="font-mono text-[9px] text-[#6b7280] dark:text-[#91a096]">{String(idx + 1).padStart(2, "0")}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="bento-chip">{skill}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bento-grid hidden md:grid">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.04 }}
              className="md:col-span-6 xl:col-span-3"
            >
              <TiltCard intensity={6} glow="201 243 108" className="h-full rounded-[26px]">
                <div className="bento bento-hover relative h-full p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c9f36c]/20 bg-[#c9f36c]/10 text-base">
                        {cat.icon}
                      </span>
                      <h3 className="text-sm font-semibold leading-tight text-[#101412] dark:text-[#f4f7f2]">
                        {cat.title}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] text-[#6b7280] dark:text-[#91a096]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.92 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.25, delay: idx * 0.03 }}
                        className="bento-chip"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                  <div aria-hidden className="pointer-events-none absolute -bottom-12 -right-10 h-32 w-32 rounded-full bg-[#c9f36c]/[0.06] blur-2xl" />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
