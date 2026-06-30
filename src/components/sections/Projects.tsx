"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { FaAndroid, FaApple } from "react-icons/fa";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectModal from "@/components/projects/ProjectModal";

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

const domainGradients: Record<string, string> = {
  healthcare: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
  enterprise: "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
  "f&b": "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
  marketplace: "from-purple-500/20 via-pink-500/20 to-rose-500/20",
  ecommerce: "from-rose-500/20 via-red-500/20 to-orange-500/20",
  sales: "from-cyan-500/20 via-sky-500/20 to-blue-500/20",
  agri: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
};

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
      .then((data) => {
        setProjects((data.projects || []) as Project[]);
      })
      .catch(() => {});
  }, []);

  const filters = useMemo(() => {
    const cats = [...new Set(projects.map((p) => p.category))];
    return [
      { value: "all", label: "All", icon: "🔍" },
      ...cats.map((c) => ({
        value: c,
        label: c.charAt(0).toUpperCase() + c.slice(1),
        icon: "📱",
      })),
    ];
  }, [projects]);

  const filtered = activeFilter === "all" ? projects : projects.filter((p) => p.category === activeFilter);

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="section-padding bg-dark-900/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05)_0%,transparent_50%)] pointer-events-none" />
      <div className="max-width relative z-10">
        <SectionHeading title="Featured Projects" subtitle="Real-world applications I have built and deployed" icon={<FiExternalLink />} />

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => {
              const domain = getDomain(project.title);
              const gradient = domainGradients[domain] || "from-accent-blue/20 via-accent-purple/20 to-accent-cyan/20";
              const industry = industryLabels[domain] || domain;

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <motion.div className="group cursor-pointer" onClick={() => setSelectedProject(project)} whileHover={{ y: -4 }}>
                    <div className="card h-full flex flex-col glass-hover group relative overflow-hidden">
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "inset 0 0 30px rgba(59,130,246,0.1)" }} />

                        <div className={`w-full aspect-video rounded-xl mb-5 bg-dark-900 flex items-center justify-center overflow-hidden relative ${project.appIcon ? "" : `bg-gradient-to-br ${gradient}`}`}>
                        {project.appIcon && (
                          <>
                            <div className="absolute inset-0 w-full h-full overflow-hidden">
                              <img src={project.appIcon} alt="" className="w-full h-full object-cover blur-2xl scale-110 opacity-50" />
                            </div>
                            <img src={project.appIcon} alt="" className="relative z-10 w-4/5 h-4/5 object-contain drop-shadow-2xl" />
                          </>
                        )}
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-dark-900/80 backdrop-blur-sm border border-[var(--glass-10)] flex items-center text-[10px] text-dark-300 font-mono">
                          #{project.id}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-medium text-dark-500 uppercase tracking-wider">{industry}</span>
                      </div>

                      <h3 className="text-dark-100 dark:text-white font-bold text-lg mb-2 group-hover:text-accent-blue transition-colors font-heading">
                        {project.title}
                      </h3>

                      <p className="text-dark-400 text-sm leading-relaxed mb-4 flex-1">
                        {project.description.length > 100 ? project.description.slice(0, 100) + "..." : project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.slice(0, 3).map((t) => (
                          <span key={t} className="tech-badge text-[0.6rem]">{t}</span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="tech-badge text-[0.6rem]">+{project.techStack.length - 3}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[var(--glass-5)]">
                        {project.androidLink && (
                          <a href={project.androidLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-dark-500 text-xs flex items-center gap-1 group-hover:text-green-400 transition-colors">
                            <FaAndroid className="text-green-400/70" /> Play Store
                          </a>
                        )}
                        {project.iosLink && (
                          <a href={project.iosLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-dark-500 text-xs flex items-center gap-1 group-hover:text-white transition-colors">
                            <FaApple className="text-white/70" /> App Store
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </div>
    </section>
  );
}
