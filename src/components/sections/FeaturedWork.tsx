"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiMapPin } from "react-icons/fi";
import { FaAndroid, FaApple } from "react-icons/fa";
import TiltCard from "@/components/ui/TiltCard";

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  androidLink: string;
  iosLink: string;
  appIcon?: string;
}

const domains: Record<string, string> = {
  pearlies: "Healthcare · Singapore",
  boskalis: "Enterprise · Netherlands",
  kimi: "Food & Beverage · UAE",
  dreamshop: "E-commerce · India",
  salespulse: "Sales Ops · India",
};

function domainFor(title: string) {
  return domains[title.toLowerCase()] ?? "Mobile · India";
}

export default function FeaturedWork() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(((data.projects || []) as Project[]).slice(0, 3)))
      .catch(() => {});
  }, []);

  if (projects.length === 0) return null;

  const [lead, ...rest] = projects;

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="bento-label">Selected work</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#101412] dark:text-[#f4f7f2] sm:text-3xl">
              Apps people actually use.
            </h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 rounded-full border border-[#101412]/10 bg-white/50 px-4 py-2 text-xs font-semibold text-[#4b5563] transition-colors hover:border-[#c9f36c]/50 hover:text-[#16a34a] dark:border-[#c9f36c]/[0.12] dark:bg-white/[0.03] dark:text-[#91a096] dark:hover:text-[#c9f36c]"
          >
            All projects
            <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="bento-grid">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="md:col-span-7"
          >
            <TiltCard intensity={6} glow="201 243 108" className="h-full rounded-[28px]">
              <div className="bento bento-hover relative flex h-full flex-col overflow-hidden p-5 sm:p-7">
                <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#c9f36c]/[0.12] blur-[80px]" />
                <div className="relative flex items-start justify-between gap-4">
                  <span className="bento-chip"><FiMapPin /> {domainFor(lead.title)}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b7280] dark:text-[#91a096]">Featured</span>
                </div>

                <div className="relative mt-6 flex flex-1 flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="relative mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-[28px] border border-[#101412]/10 bg-white/60 p-2 shadow-2xl shadow-[#101412]/10 dark:border-[#c9f36c]/15 dark:bg-white/[0.04] sm:mx-0 sm:h-36 sm:w-36">
                    {lead.appIcon ? (
                      <img src={lead.appIcon} alt={lead.title} className="h-full w-full rounded-[22px] object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] text-2xl font-black text-[#101412]">
                        {lead.title.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 text-center sm:text-left">
                    <h3 className="text-2xl font-black tracking-tight text-[#101412] dark:text-[#f4f7f2] sm:text-3xl">{lead.title}</h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#6b7280] dark:text-[#91a096]">{lead.description}</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                      {lead.techStack.slice(0, 4).map((tech) => (
                        <span key={tech} className="bento-chip">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative mt-6 flex flex-wrap items-center gap-2">
                  {lead.androidLink && (
                    <a href={lead.androidLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#c9f36c] px-4 py-2.5 text-xs font-semibold text-[#101412] transition-colors hover:bg-[#d9ff8a]">
                      <FaAndroid /> Play Store
                    </a>
                  )}
                  {lead.iosLink && (
                    <a href={lead.iosLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#101412]/10 bg-white/50 px-4 py-2.5 text-xs font-semibold text-[#374151] transition-colors hover:border-[#c9f36c]/50 dark:border-[#c9f36c]/15 dark:bg-white/[0.03] dark:text-[#f4f7f2]">
                      <FaApple /> App Store
                    </a>
                  )}
                  <Link href="/projects" className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-[#16a34a] hover:underline dark:text-[#c9f36c]">
                    Case details <FiArrowUpRight />
                  </Link>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          <div className="grid gap-4 md:col-span-5">
            {rest.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 + idx * 0.08 }}
              >
                <TiltCard intensity={7} glow="201 243 108" className="h-full rounded-[26px]">
                  <div className="bento bento-hover flex h-full items-center gap-4 p-4 sm:p-5">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#101412]/10 bg-white/60 p-1 dark:border-[#c9f36c]/15 dark:bg-white/[0.04]">
                      {project.appIcon ? (
                        <img src={project.appIcon} alt={project.title} className="h-full w-full rounded-xl object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] text-lg font-black text-[#101412]">
                          {project.title.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-sm font-semibold text-[#101412] dark:text-[#f4f7f2]">{project.title}</h3>
                        <span className="font-mono text-[9px] text-[#6b7280] dark:text-[#91a096]">{String(idx + 2).padStart(2, "0")}</span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-[#6b7280] dark:text-[#91a096]">{domainFor(project.title)}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 2).map((tech) => (
                          <span key={tech} className="rounded-full border border-[#101412]/8 px-2 py-0.5 text-[9px] text-[#4b5563] dark:border-[#c9f36c]/10 dark:text-[#91a096]">{tech}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {project.androidLink && (
                        <a href={project.androidLink} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on Play Store`} className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c9f36c]/30 bg-[#c9f36c]/15 text-[#16a34a] transition-colors hover:bg-[#c9f36c] hover:text-[#101412] dark:text-[#c9f36c]">
                          <FaAndroid className="text-[11px]" />
                        </a>
                      )}
                      {project.iosLink && (
                        <a href={project.iosLink} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on App Store`} className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c9f36c]/30 bg-[#c9f36c]/15 text-[#16a34a] transition-colors hover:bg-[#c9f36c] hover:text-[#101412] dark:text-[#c9f36c]">
                          <FaApple className="text-[11px]" />
                        </a>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="bento flex items-center justify-between gap-3 p-4 sm:p-5"
            >
              <div>
                <p className="text-sm font-semibold text-[#101412] dark:text-[#f4f7f2]">20+ production apps</p>
                <p className="mt-0.5 text-[10px] text-[#6b7280] dark:text-[#91a096]">4 countries · 5 industries</p>
              </div>
              <span className="rounded-full bg-[#c9f36c]/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[#16a34a] dark:text-[#c9f36c]">Live</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
