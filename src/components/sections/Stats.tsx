"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import TiltCard from "@/components/ui/TiltCard";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  desc: string;
}

export default function Stats() {
  const [stats, setStats] = useState<StatItem[]>([
    { value: 4, suffix: "+", label: "Years Exp", desc: "Cross-platform development" },
    { value: 25, suffix: "+", label: "Projects", desc: "Flutter & React Native" },
    { value: 20, suffix: "+", label: "Apps Deployed", desc: "Production-ready apps" },
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
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: idx * 0.07 }}
        >
          <TiltCard intensity={5} spotlight className="rounded-2xl">
            <div className="bento bento-hover relative h-full p-4">
              <div className="relative flex items-baseline gap-0.5">
                <span className="bg-gradient-to-r from-[#c9f36c] to-[#a8d94a] bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
                  <CountUp end={stat.value} duration={1.8} delay={idx * 0.08} />
                </span>
                <span className="text-xl font-black text-[#16a34a] dark:text-[#c9f36c]">{stat.suffix}</span>
              </div>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#101412] dark:text-[#f4f7f2]">
                {stat.label}
              </p>
              <p className="mt-0.5 line-clamp-1 text-[10px] text-[#6b7280] dark:text-[#91a096]">{stat.desc}</p>
            </div>
          </TiltCard>
        </motion.div>
      ))}
    </div>
  );
}
