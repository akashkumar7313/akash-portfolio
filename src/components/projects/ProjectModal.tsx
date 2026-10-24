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
  healthcare: { gradient: "from-[#c9f36c]/20 via-[#a8d94a]/15 to-transparent", accent: "text-[#a8d94a]" },
  enterprise: { gradient: "from-[#c9f36c]/20 via-[#a8d94a]/15 to-transparent", accent: "text-[#c9f36c]" },
  "f&b": { gradient: "from-[#a8d94a]/20 via-[#c9f36c]/15 to-transparent", accent: "text-[#a8d94a]" },
  marketplace: { gradient: "from-[#c9f36c]/20 via-[#a8d94a]/15 to-transparent", accent: "text-[#c9f36c]" },
  ecommerce: { gradient: "from-[#a8d94a]/20 via-[#c9f36c]/15 to-transparent", accent: "text-[#a8d94a]" },
  sales: { gradient: "from-[#c9f36c]/20 via-[#a8d94a]/15 to-transparent", accent: "text-[#c9f36c]" },
  agri: { gradient: "from-[#a8d94a]/20 via-[#c9f36c]/15 to-transparent", accent: "text-[#a8d94a]" },
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
      color: "hover:border-[#c9f36c]/50 hover:bg-[#c9f36c]/10 hover:text-[#16a34a] dark:hover:text-[#c9f36c]",
    });
  }
  if (project.iosLink) {
    platforms.push({
      label: "App Store",
      url: project.iosLink,
      icon: <FaApple />,
      color: "hover:border-[#c9f36c]/50 hover:bg-[#c9f36c]/10",
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
          className="bento max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 z-20 flex items-center justify-between p-5 border-b border-[#101412]/8 bg-[#f7faf4]/90 backdrop-blur-xl dark:border-[#c9f36c]/10 dark:bg-[#0b0f0c]/90">
            <h3 className="text-dark-100 dark:text-white font-bold text-lg">{project.title}</h3>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#101412]/8 bg-[#101412]/[0.03] text-[#4b5563] transition-all hover:border-[#c9f36c]/40 hover:text-[#16a34a] dark:border-[#c9f36c]/10 dark:bg-white/[0.04] dark:text-[#f4f7f2] dark:hover:text-[#c9f36c]"
            >
              <HiX />
            </button>
          </div>

          <div className="p-5 md:p-6 space-y-6">
            {project.appIcon && (
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-[#c9f36c]/10 bg-[radial-gradient(circle_at_30%_20%,rgba(201,243,108,0.16),transparent_55%),linear-gradient(145deg,#101612,#0a0d0b)]">
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img src={project.appIcon} alt="" className="w-full h-full object-cover blur-3xl scale-110 opacity-60" />
                </div>
                <img src={project.appIcon} alt={project.title} className="relative z-10 w-4/5 h-4/5 object-contain drop-shadow-2xl" />
              </div>
            )}

            <p className="text-sm leading-relaxed text-[#4b5563] dark:text-[#c5cdc8]">
              {project.description}
            </p>

            <div>
              <h4 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b7280] dark:text-[#91a096]">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <span key={t} className="tech-badge">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b7280] dark:text-[#91a096]">Key Features</h4>
              <ul className="space-y-2">
                {project.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-[#4b5563] dark:text-[#c5cdc8]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9f36c] mt-2 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#c9f36c]/15 bg-[#c9f36c]/[0.04] p-4">
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
                    className="flex items-center gap-2 rounded-xl border border-[#c9f36c]/15 bg-white/50 px-5 py-3 text-sm font-medium text-[#101412] transition-all hover:border-[#c9f36c]/50 hover:bg-[#c9f36c]/10 dark:bg-white/[0.03] dark:text-[#f4f7f2]"
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
