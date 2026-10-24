"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiExternalLink, FiLayers } from "react-icons/fi";
import { FaAndroid, FaApple } from "react-icons/fa";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectModal from "@/components/projects/ProjectModal";
import TiltCard from "@/components/ui/TiltCard";

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  androidLink: string;
  iosLink: string;
  githubLink?: string;
  bannerImage?: string;
  screenshots?: string[];
  features: string[];
  role: string;
  category: string;
  appIcon?: string;
}

const industryLabels: Record<string, string> = {
  healthcare: "Healthcare",
  enterprise: "Enterprise",
  "f&b": "Food & Beverage",
  marketplace: "Marketplace",
  ecommerce: "E-commerce",
  sales: "Sales Ops",
  agri: "Agri-Industrial",
};

function getDomain(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("pearlies")) return "healthcare";
  if (t.includes("boskalis")) return "enterprise";
  if (t.includes("kimi")) return "f&b";
  if (t.includes("atesplore merchant")) return "marketplace";
  if (t.includes("atesplore")) return "marketplace";
  if (t.includes("dreamshop")) return "ecommerce";
  if (t.includes("salespulse")) return "sales";
  if (t.includes("bajaj") || t.includes("dalmia") || t.includes("wave") || t.includes("uk cane") || t.includes("mis")) return "agri";
  return "enterprise";
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects((data.projects || []) as Project[]))
      .catch(() => {});
  }, []);

  const filters = useMemo(() => {
    const cats = [...new Set(projects.map((p) => p.category))];
    return [
      { value: "all", label: "All work" },
      ...cats.map((c) => ({
        value: c,
        label: c.charAt(0).toUpperCase() + c.slice(1),
      })),
    ];
  }, [projects]);

  const filtered = activeFilter === "all" ? projects : projects.filter((p) => p.category === activeFilter);

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
      <div className="relative z-10 mx-auto max-w-6xl px-1 sm:px-0">
        <SectionHeading
          title="Featured Projects"
          kicker="Projects"
          subtitle="Production apps used in healthcare, enterprise, commerce, and field operations."
          icon={<FiLayers />}
        />

        <div className="mb-6 flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                activeFilter === f.value
                  ? "bg-[#c9f36c] text-[#101412] shadow-lg shadow-[#c9f36c]/20"
                  : "border border-[#101412]/8 bg-white/40 text-[#4b5563] hover:border-[#c9f36c]/40 hover:text-[#16a34a] dark:border-[#c9f36c]/10 dark:bg-white/[0.03] dark:text-[#91a096] dark:hover:text-[#c9f36c]"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-[#6b7280] dark:text-[#91a096]">
            {filtered.length} projects
          </span>
        </div>

        <motion.div layout className="bento-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => {
              const domain = getDomain(project.title);
              const industry = industryLabels[domain] || domain;

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className={idx < 2 ? "md:col-span-6" : "md:col-span-4"}
                >
                  <TiltCard intensity={5} glow="201 243 108" className="h-full rounded-[26px]">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedProject(project)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setSelectedProject(project);
                      }}
                      className="bento bento-hover group flex h-full cursor-pointer flex-col"
                    >
                      <div className="relative m-3 mb-0 aspect-[16/10] overflow-hidden rounded-[20px] border border-[#c9f36c]/10 bg-[radial-gradient(circle_at_30%_20%,rgba(201,243,108,0.18),transparent_55%),linear-gradient(145deg,#101612,#0a0d0b)]">
                        <div aria-hidden className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(201,243,108,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,243,108,0.1) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
                        {project.appIcon ? (
                          <>
                            <img src={project.appIcon} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                            <img src={project.appIcon} alt={project.title} className="relative z-10 mx-auto mt-8 h-[72%] w-[72%] object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                          </>
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-5xl font-black text-[#c9f36c]/30">{project.title[0]}</span>
                        )}
                        <div className="absolute left-3 top-3 rounded-full border border-[#c9f36c]/20 bg-[#0a0d0b]/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[#c9f36c] backdrop-blur">
                          {industry}
                        </div>
                        <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/40 px-2 py-1 font-mono text-[9px] text-white/70 backdrop-blur">
                          #{project.id}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-base font-semibold text-[#101412] transition-colors group-hover:text-[#16a34a] dark:text-[#f4f7f2] dark:group-hover:text-[#c9f36c]">
                            {project.title}
                          </h3>
                          <FiExternalLink className="mt-0.5 shrink-0 text-sm text-[#6b7280] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#16a34a] dark:text-[#91a096] dark:group-hover:text-[#c9f36c]" />
                        </div>
                        <p className="mt-2 flex-1 text-xs leading-relaxed text-[#6b7280] dark:text-[#91a096]">
                          {project.description.length > 130 ? project.description.slice(0, 130) + "..." : project.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {project.techStack.slice(0, 3).map((t) => (
                            <span key={t} className="bento-chip">{t}</span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="bento-chip">+{project.techStack.length - 3}</span>
                          )}
                        </div>

                        <div className="mt-4 flex items-center gap-3 border-t border-[#101412]/6 pt-3 dark:border-[#c9f36c]/8">
                          {project.androidLink && (
                            <a href={project.androidLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[10px] text-[#6b7280] transition-colors hover:text-emerald-500 dark:text-[#91a096]">
                              <FaAndroid /> Play Store
                            </a>
                          )}
                          {project.iosLink && (
                            <a href={project.iosLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[10px] text-[#6b7280] transition-colors hover:text-[#101412] dark:text-[#91a096] dark:hover:text-white">
                              <FaApple /> App Store
                            </a>
                          )}
                          <span className="ml-auto text-[10px] font-medium text-[#16a34a] opacity-0 transition-opacity group-hover:opacity-100 dark:text-[#c9f36c]">
                            View case study
                          </span>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
