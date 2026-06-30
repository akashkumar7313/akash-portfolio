"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import { FaAndroid, FaApple } from "react-icons/fa";
import type { Project } from "@/data/projects";

interface Props {
  project: Project;
  onClose: () => void;
}

const domainColors: Record<string, { gradient: string; accent: string }> = {
  healthcare: { gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20", accent: "text-emerald-400" },
  enterprise: { gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20", accent: "text-blue-400" },
  "f&b": { gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20", accent: "text-orange-400" },
  marketplace: { gradient: "from-purple-500/20 via-pink-500/20 to-rose-500/20", accent: "text-purple-400" },
  ecommerce: { gradient: "from-rose-500/20 via-red-500/20 to-orange-500/20", accent: "text-rose-400" },
  sales: { gradient: "from-cyan-500/20 via-sky-500/20 to-blue-500/20", accent: "text-cyan-400" },
  agri: { gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20", accent: "text-green-400" },
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

export default function ProjectModal({ project, onClose }: Props) {
  const domain = getDomain(project.title);
  const colors = domainColors[domain] || domainColors.enterprise;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const platforms: { label: string; url: string; icon: React.ReactNode; color: string }[] = [];
  if (project.androidLink) {
    platforms.push({
      label: "Google Play",
      url: project.androidLink,
      icon: <FaAndroid />,
      color: "hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/30",
    });
  }
  if (project.iosLink) {
    platforms.push({
      label: "App Store",
      url: project.iosLink,
      icon: <FaApple />,
      color: "hover:bg-white/10 hover:text-white hover:border-white/30",
    });
  }

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 z-20 flex items-center justify-between p-5 border-b border-[var(--glass-10)] bg-dark-950 backdrop-blur-xl">
            <h3 className="text-dark-100 dark:text-white font-bold text-lg">{project.title}</h3>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[var(--glass-5)] flex items-center justify-center text-dark-300 hover:text-dark-100 dark:text-white hover:bg-[var(--glass-10)] transition-all"
            >
              <HiX />
            </button>
          </div>

          <div className="p-5 md:p-6 space-y-6">
            {project.appIcon && (
              <div className="relative rounded-xl overflow-hidden bg-dark-900 aspect-video flex items-center justify-center">
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img src={project.appIcon} alt="" className="w-full h-full object-cover blur-3xl scale-110 opacity-60" />
                </div>
                <img src={project.appIcon} alt={project.title} className="relative z-10 w-4/5 h-4/5 object-contain drop-shadow-2xl" />
              </div>
            )}

            <p className="text-dark-200 leading-relaxed">
              {project.description}
            </p>

            <div>
              <h4 className="text-dark-100 dark:text-white font-semibold mb-3">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <span key={t} className="tech-badge">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-dark-100 dark:text-white font-semibold mb-3">Key Features</h4>
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
              <h4 className="text-dark-100 dark:text-white font-semibold mb-2">My Role</h4>
              <p className="text-dark-300 text-sm leading-relaxed">
                {project.role}
              </p>
            </div>

            {platforms.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {platforms.map((p) => (
                  <a
                    key={p.label}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-5 py-3 bg-[var(--glass-5)] border border-[var(--glass-10)] rounded-xl text-sm font-medium text-dark-100 dark:text-white transition-all flex items-center gap-2 ${p.color}`}
                  >
                    {p.icon} {p.label}
                  </a>
                ))}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 bg-[var(--glass-5)] border border-[var(--glass-10)] rounded-xl text-sm font-medium text-dark-100 dark:text-white hover:bg-[var(--glass-10)] hover:border-[var(--glass-20)] transition-all flex items-center gap-2"
                  >
                    <FaAndroid /> GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
