"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCpu } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";

interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

const badgeColors = [
  "from-[#c9f36c]/20 to-[#c9f36c]/5 border-[#c9f36c]/20 hover:border-[#c9f36c]/50 hover:text-[#c9f36c]",
  "from-[#a8d94a]/20 to-[#a8d94a]/5 border-[#a8d94a]/20 hover:border-[#a8d94a]/50 hover:text-[#a8d94a]",
  "from-[#c9f36c]/15 to-[#c9f36c]/5 border-[#c9f36c]/15 hover:border-[#c9f36c]/40 hover:text-[#c9f36c]",
  "from-green-500/20 to-green-500/5 border-green-500/20 hover:border-green-500/50 hover:text-green-400",
  "from-pink-500/20 to-pink-500/5 border-pink-500/20 hover:border-pink-500/50 hover:text-pink-400",
  "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/50 hover:text-yellow-400",
  "from-orange-500/20 to-orange-500/5 border-orange-500/20 hover:border-orange-500/50 hover:text-orange-400",
];

export default function Skills() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  return (
    <section id="skills" className="section-padding bg-dark-900/50">
      <div className="max-width">
        <SectionHeading title="Skills & Expertise" subtitle="Technologies and tools I work with daily" icon={<FiCpu />} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="card glass-hover group"
            >
              <h3 className="text-dark-100 dark:text-white font-semibold mb-5 text-lg flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-[#c9f36c]/10 flex items-center justify-center text-base group-hover:bg-[#c9f36c]/20 transition-all duration-300">
                  {cat.icon}
                </span>
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, sIdx) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 + sIdx * 0.03 }}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border bg-gradient-to-br transition-all duration-300 cursor-default text-dark-200 ${badgeColors[sIdx % badgeColors.length]}`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
