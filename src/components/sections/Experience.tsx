"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBriefcase, FiCalendar, FiChevronDown, FiMapPin } from "react-icons/fi";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import SectionHeading from "@/components/ui/SectionHeading";

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  type: string;
  location: string;
  color: string;
  skills: string[];
  description: string[];
}

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/experience")
      .then((r) => r.json())
      .then((data) => setExperiences(data.experiences || []))
      .catch(() => {});
  }, []);

  const toggleExpanded = (idx: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      <div className="absolute top-20 right-10 w-32 h-32 bg-accent-blue/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-accent-purple/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "2s" }} />
      <div className="max-width relative z-10">
        <SectionHeading title="Work Experience" subtitle="My professional journey in software development" icon={<FiBriefcase />} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {experiences.map((exp, idx) => {
            const isOpen = expanded.has(idx);
            const c = exp.color;
            return (
              <motion.div
                key={`${exp.role}-${idx}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.12 }}
                className="group"
              >
                <motion.div
                  className="relative overflow-hidden rounded-3xl transition-all duration-300 cursor-pointer h-full select-none"
                  style={{
                    background: "var(--glass-bg)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)",
                    boxShadow: "var(--card-shadow)",
                  }}
                  whileHover={{ boxShadow: "var(--card-hover-shadow)", y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleExpanded(idx)}
                  layout
                >
                  <div className="p-4 relative z-10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-dark-100 dark:text-white font-bold font-heading text-base truncate">{exp.role}</h3>
                        <p className="text-dark-400 text-sm">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono" style={{ background: `${c}15`, color: c }}>
                          <FiCalendar size={10} /> {exp.period}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-dark-500 mb-3">
                      <FiMapPin size={10} /> <span className="truncate">{exp.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {exp.skills.slice(0, isOpen ? exp.skills.length : 3).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 text-[10px] font-medium rounded-full" style={{ background: `${c}10`, color: `${c}cc`, border: `1px solid ${c}20` }}>
                          {skill}
                        </span>
                      ))}
                      {!isOpen && exp.skills.length > 3 && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full text-dark-500" style={{ background: `${c}08` }}>+{exp.skills.length - 3}</span>
                      )}
                    </div>

                    <motion.div
                      className="flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-medium transition-all duration-300"
                      style={{ background: `${c}08`, color: c }}
                      animate={{ background: isOpen ? `${c}15` : `${c}08` }}
                    >
                      <span>{isOpen ? "Show Less" : "View Details"}</span>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <FiChevronDown size={14} />
                      </motion.div>
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 border-t border-[var(--glass-10)]">
                          <p className="text-dark-500 text-xs mt-3 mb-2 flex items-center gap-1">
                            <FaApple size={9} className="text-dark-400" />
                            <FaGooglePlay size={9} className="text-green-400" />
                            <span className="ml-1">{exp.type}</span>
                          </p>
                          <div className="space-y-1.5">
                            {exp.description.map((item, i) => (
                              <motion.p
                                key={i}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: i * 0.04 }}
                                className="text-dark-300 text-sm leading-relaxed pl-2.5"
                                style={{ borderLeft: `1.5px solid ${c}50` }}
                              >
                                {item}
                              </motion.p>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
