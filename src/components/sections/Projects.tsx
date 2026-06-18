"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFolder, FiExternalLink, FiGithub } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectModal from "@/components/projects/ProjectModal";

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  androidLink: string;
  iosLink: string;
  githubLink: string;
  bannerImage: string;
  screenshots: string[];
  features: string[];
  role: string;
  category: string;
}

const categoryIcons: Record<string, string> = {
  mobile: "📱",
  web: "🌐",
  backend: "⚙️",
};

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: y * -12 });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={className} style={{ perspective: "1000px" }}>
      <div style={{ transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`, transition: "transform 0.15s ease-out" }}>{children}</div>
    </div>
  );
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
      .catch(() => { });
  }, []);

  const filters = useMemo(() => {
    const cats = [...new Set(projects.map((p) => p.category))];
    return [
      { value: "all", label: "All", icon: "🔍" },
      ...cats.map((c) => ({
        value: c,
        label: c.charAt(0).toUpperCase() + c.slice(1),
        icon: categoryIcons[c] || "📦",
      })),
    ];
  }, [projects]);

  const filtered = activeFilter === "all" ? projects : projects.filter((p) => p.category === activeFilter);

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="section-padding bg-dark-900/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05)_0%,transparent_50%)] pointer-events-none" />
      <div className="max-width relative z-10">
        <SectionHeading title="Featured Projects" subtitle="Real-world applications I have built and deployed" icon={<FiFolder />} />



        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <TiltCard>
                  <motion.div className="group cursor-pointer" onClick={() => setSelectedProject(project)} whileHover={{ y: -4 }}>
                    <div className="card h-full flex flex-col glass-hover group relative overflow-hidden">
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "inset 0 0 30px rgba(59,130,246,0.1)" }} />

                      <div className="w-full aspect-video rounded-xl mb-5 bg-gradient-to-br from-accent-blue/20 via-accent-purple/20 to-accent-cyan/20 flex items-center justify-center overflow-hidden relative">
                        <FiFolder className="text-4xl text-accent-blue/40 group-hover:scale-110 group-hover:text-accent-blue transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                          <span className="text-dark-100 dark:text-white text-xs font-medium px-3 py-1 rounded-full bg-[var(--glass-10)] backdrop-blur-sm">
                            Click to view details
                          </span>
                        </div>
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-dark-900/80 backdrop-blur-sm border border-[var(--glass-10)] flex items-center justify-center text-[10px] text-dark-300 font-mono">
                          #{project.id}
                        </div>
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
                          <span className="text-dark-500 text-xs flex items-center gap-1 group-hover:text-accent-blue transition-colors"><FiExternalLink /> Android</span>
                        )}
                        {project.iosLink && (
                          <span className="text-dark-500 text-xs flex items-center gap-1 group-hover:text-accent-purple transition-colors"><FiExternalLink /> iOS</span>
                        )}
                        {project.githubLink && (
                          <span className="text-dark-500 text-xs flex items-center gap-1 group-hover:text-dark-100 dark:text-white transition-colors"><FiGithub /> Code</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </div>
    </section>
  );
}
