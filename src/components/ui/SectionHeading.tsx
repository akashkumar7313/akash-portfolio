"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  align?: "left" | "center";
  kicker?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  icon,
  align = "center",
  kicker,
}: Props) {
  const centered = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
      className={`mb-12 md:mb-16 ${centered ? "flex flex-col items-center text-center" : ""}`}
    >
      <div className={`mb-4 flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <span className="bento-kicker">
          {icon && <span className="text-sm">{icon}</span>}
          {kicker || title.split(" ")[0]}
        </span>
        <span className="hidden h-px w-12 bg-gradient-to-r from-[#c9f36c]/60 to-transparent sm:block" />
      </div>

      <h2 className="max-w-4xl text-3xl font-bold tracking-tight text-[#101412] sm:text-4xl lg:text-[2.9rem] lg:leading-[1.08] dark:text-[#f4f7f2]">
        {title}
      </h2>

      {subtitle && (
        <p className={`mt-4 max-w-2xl text-sm leading-relaxed text-[#6b7280] sm:text-base dark:text-[#91a096] ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}

      <div className={`mt-6 flex items-center gap-1.5 ${centered ? "justify-center" : ""}`}>
        <span className="h-1 w-10 rounded-full bg-gradient-to-r from-[#c9f36c] to-[#a8d94a]" />
        <span className="h-1 w-1.5 rounded-full bg-[#c9f36c]/60" />
        <span className="h-1 w-1 rounded-full bg-[#c9f36c]/30" />
      </div>
    </motion.div>
  );
}
