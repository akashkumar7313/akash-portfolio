"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import type { Project } from "@/data/projects";

interface Props {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  const [imgIndex, setImgIndex] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        setImgIndex((i) => (i === 0 ? project.screenshots.length - 1 : i - 1));
      if (e.key === "ArrowRight")
        setImgIndex((i) => (i === project.screenshots.length - 1 ? 0 : i + 1));
    },
    [onClose, project.screenshots.length]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/10 bg-dark-950/90 backdrop-blur-xl">
            <h3 className="text-white font-bold text-lg">{project.title}</h3>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-dark-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <HiX />
            </button>
          </div>

          <div className="p-5 md:p-6 space-y-6">
            {project.screenshots.length > 0 && (
              <div className="relative rounded-xl overflow-hidden bg-dark-900 aspect-video flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-accent-blue/20 via-accent-purple/20 to-accent-cyan/20 flex items-center justify-center">
                  <p className="text-dark-400 text-sm font-mono">
                    {project.screenshots[imgIndex]}
                  </p>
                </div>
                {project.screenshots.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setImgIndex((i) =>
                          i === 0 ? project.screenshots.length - 1 : i - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all"
                    >
                      <HiChevronLeft />
                    </button>
                    <button
                      onClick={() =>
                        setImgIndex((i) =>
                          i === project.screenshots.length - 1 ? 0 : i + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all"
                    >
                      <HiChevronRight />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {project.screenshots.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === imgIndex
                              ? "bg-white w-4"
                              : "bg-white/40 hover:bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <p className="text-dark-200 leading-relaxed">
              {project.description}
            </p>

            <div>
              <h4 className="text-white font-semibold mb-3">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <span key={t} className="tech-badge">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Key Features</h4>
              <ul className="space-y-2">
                {project.features.map((f, i) => (
                  <li
                    key={i}
                    className="text-dark-300 text-sm flex items-start gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">My Role</h4>
              <p className="text-dark-300 text-sm leading-relaxed">
                {project.role}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.androidLink && (
                <a
                  href={project.androidLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
                >
                  <FiExternalLink /> Android App
                </a>
              )}
              {project.iosLink && (
                <a
                  href={project.iosLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
                >
                  <FiExternalLink /> iOS App
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
                >
                  <FiGithub /> GitHub
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
