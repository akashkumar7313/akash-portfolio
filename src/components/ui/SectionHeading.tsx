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
        className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-blue text-sm font-medium mb-4 ${
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
