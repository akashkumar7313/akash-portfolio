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
        className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--glass-5)] border border-[var(--glass-10)] text-[#16a34a] dark:text-[#c9f36c] text-sm font-medium mb-4 ${
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

      {/* Hand-drawn style underline */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={`mt-4 mb-4 ${align === "center" ? "flex justify-center" : ""}`}
      >
        <svg
          width="180"
          height="12"
          viewBox="0 0 180 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Main hand-drawn squiggly line */}
          <motion.path
            d="M2 8 C20 2, 35 10, 55 5 C75 0, 90 9, 110 4 C130 -1, 145 8, 165 5 C172 4, 176 6, 178 5"
            stroke="url(#handDrawnGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          />
          {/* Second subtle line for depth */}
          <motion.path
            d="M10 10 C30 5, 50 11, 70 6 C90 1, 110 10, 130 5 C150 0, 165 8, 175 6"
            stroke="url(#handDrawnGrad2)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="handDrawnGrad" x1="0" y1="0" x2="180" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#c9f36c" stopOpacity="0.2" />
              <stop offset="30%" stopColor="#c9f36c" />
              <stop offset="70%" stopColor="#a8d94a" />
              <stop offset="100%" stopColor="#a8d94a" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="handDrawnGrad2" x1="0" y1="0" x2="180" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a8d94a" stopOpacity="0" />
              <stop offset="50%" stopColor="#c9f36c" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a8d94a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
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
