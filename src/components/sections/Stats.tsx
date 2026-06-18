"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  desc: string;
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [stats, setStats] = useState<StatItem[]>([
    { value: 4, suffix: "+", label: "Years Exp", desc: "Cross-platform development" },
    { value: 20, suffix: "+", label: "Projects", desc: "Flutter & React Native" },
    { value: 15, suffix: "+", label: "Apps Deployed", desc: "Production-ready apps" },
    { value: 12, suffix: "+", label: "Technologies", desc: "Mastered & counting" },
  ]);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data?.stats?.length) setStats(data.stats);
      })
      .catch(() => {});
  }, []);

  if (stats.length === 0) return null;

  return (
    <section className="overflow-hidden py-8 md:py-12">
      <div className="max-width" ref={ref}>
        <div className="flex flex-col md:flex-row md:items-center justify-center gap-4 md:gap-0 md:divide-x md:divide-[var(--glass-10)]">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative flex-1 flex flex-col items-center text-center group"
            >
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, transparent 70%)`,
                }}
              />
              <div className="relative mb-1">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-none bg-gradient-to-r bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${["#6366f1", "#8b5cf6", "#06b6d4", "#10b981"][idx]}, ${["#06b6d4", "#6366f1", "#8b5cf6", "#6366f1"][idx]})`,
                  }}
                >
                  {isInView ? (
                    <CountUp end={stat.value} duration={2} delay={idx * 0.1} />
                  ) : (
                    0
                  )}
                </span>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-500 ml-0.5">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-dark-100 dark:text-white font-bold text-xs sm:text-sm mb-0.5 relative">
                {stat.label}
              </p>
              <p className="text-dark-500 text-[10px] sm:text-xs relative">
                {stat.desc}
              </p>
              <motion.div
                className="absolute bottom-0 left-1/4 right-1/4 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
