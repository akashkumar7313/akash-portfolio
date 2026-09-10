"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  align?: "left" | "center";
}

export default function SectionHeading({
  title,
  subtitle,
  icon,
  align = "center",
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`mb-16 ${align === "center" ? "text-center" : ""}`}
    >
      <div
        className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--glass-5)] border border-[var(--glass-10)] text-[#c9f36c] dark:text-[#c9f36c] text-sm font-medium mb-4 ${
          align === "center" ? "mx-auto" : ""
        }`}
      >
        {icon && <span className="text-lg">{icon}</span>}
        <span>{title.split(" ")[0]}</span>
      </div>
      <h2
        className={`section-heading gradient-text ${
          align === "center" ? "" : ""
        }`}
      >
        {title}
      </h2>

      {/* Unique decorative line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`flex items-center justify-center gap-3 mt-4 mb-4 ${align === "center" ? "mx-auto" : ""}`}
      >
        <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-[#c9f36c]/50 rounded-full" />
        <div className="w-2 h-2 rounded-full bg-[#c9f36c] animate-pulse" />
        <div className="w-20 h-[2px] bg-gradient-to-r from-[#c9f36c]/30 via-[#c9f36c] to-[#c9f36c]/30 rounded-full" />
        <div className="w-2 h-2 rounded-full bg-[#a8d94a] animate-pulse" />
        <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-[#a8d94a]/50 rounded-full" />
      </motion.div>

      {subtitle && (
        <p
          className={`section-subtitle ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
