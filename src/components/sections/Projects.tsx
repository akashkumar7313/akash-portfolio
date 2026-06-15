"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFolder, FiExternalLink, FiGithub } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectModal from "@/components/projects/ProjectModal";
import { projects as allProjects } from "@/data/projects";
import type { Project } from "@/data/projects";

const filters = [
  { label: "All", value: "all" },
  { label: "Mobile", value: "mobile" },
  { label: "Web", value: "web" },
  { label: "Backend", value: "backend" },
];

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

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        style={{
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered =
    activeFilter === "all"
      ? allProjects
      : allProjects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="section-padding bg-dark-900/50">
      <div className="max-width">
        <SectionHeading
          title="Featured Projects"
          subtitle="Real-world applications I have built and deployed"
          icon={<FiFolder />}
        />

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeFilter === f.value
                  ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg shadow-accent-blue/25"
                  : "bg-white/5 border border-white/10 text-dark-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

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
                  <div
                    className="group cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="card h-full flex flex-col glass-hover group">
                      <div className="w-full aspect-video rounded-xl mb-5 bg-gradient-to-br from-accent-blue/20 via-accent-purple/20 to-accent-cyan/20 flex items-center justify-center overflow-hidden relative">
                        <FiFolder className="text-4xl text-accent-blue/40 group-hover:scale-110 group-hover:text-accent-blue transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                          <span className="text-white text-xs font-medium px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                            Click to view details
                          </span>
                        </div>
                      </div>

                      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-accent-blue transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-dark-400 text-sm leading-relaxed mb-4 flex-1">
                        {project.description.length > 100
                          ? project.description.slice(0, 100) + "..."
                          : project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.slice(0, 3).map((t) => (
                          <span key={t} className="tech-badge text-[0.6rem]">
                            {t}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="tech-badge text-[0.6rem]">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                        {project.androidLink && (
                          <span className="text-dark-500 text-xs flex items-center gap-1">
                            <FiExternalLink /> Android
                          </span>
                        )}
                        {project.iosLink && (
                          <span className="text-dark-500 text-xs flex items-center gap-1">
                            <FiExternalLink /> iOS
                          </span>
                        )}
                        {project.githubLink && (
                          <span className="text-dark-500 text-xs flex items-center gap-1">
                            <FiGithub /> Code
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </section>
  );
}
