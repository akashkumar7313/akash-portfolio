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
      {/* Pill badge */}
      <div
        className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm mb-5 ${
          align === "center" ? "mx-auto" : ""
        }`}
      >
        {icon && (
          <span className="text-blue-400">{icon}</span>
        )}
        <span className="text-white/60 text-xs font-medium tracking-wider uppercase">
          {title.split(" ")[0]}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
        {title}
      </h2>

      {/* Accent line */}
      {align === "center" && (
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-blue-500/50" />
          <div className="w-2 h-2 rounded-full bg-blue-500/50" />
          <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-purple-500/50" />
        </div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p className={`text-white/40 text-sm sm:text-base max-w-2xl leading-relaxed ${
          align === "center" ? "mx-auto" : ""
        }`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
