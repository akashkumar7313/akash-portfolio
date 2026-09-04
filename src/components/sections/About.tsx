"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiCode, FiServer, FiSmartphone, FiAward, FiArrowRight } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";

interface AboutData {
  paragraphs: string[];
  highlights: { icon: string; title: string; desc: string; iconColor: string }[];
  achievements: { icon: string; text: string }[];
}

const iconMap: Record<string, React.ElementType> = {
  FiSmartphone, FiServer, FiCode, FiUser, FiAward,
};

export default function About() {
  const [data, setData] = useState<AboutData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;
    const drops: { x: number; y: number; speed: number; alpha: number }[] = [];
    for (let i = 0; i < 30; i++) {
      drops.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        speed: 0.3 + Math.random() * 0.5, alpha: 0.03 + Math.random() * 0.04,
      });
    }
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach((d) => {
        d.y += d.speed;
        if (d.y > canvas.height) { d.y = -5; d.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - 10);
        ctx.lineTo(d.x, d.y);
        ctx.strokeStyle = `rgba(59, 130, 246, ${d.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", resize); };
  }, []);

  if (!data) return null;

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Background orbs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-width relative z-10">
        <SectionHeading title="About Me" subtitle="A passionate software engineer crafting exceptional mobile experiences" icon={<FiUser />} />

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Main text - spans 8 cols */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-8"
          >
            <div className="card relative overflow-hidden group h-full">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/15 transition-colors duration-700" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <FiCode className="text-blue-400" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Who I Am</h3>
                </div>

                {data.paragraphs.map((p, i) => (
                  <p key={i} className={`${i === 0 ? "text-white/80 text-base md:text-lg" : "text-white/50"} leading-relaxed mb-4`}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Highlights - spans 4 cols, stacked */}
          <div className="md:col-span-4 flex flex-col gap-5">
            {data.highlights.map((item, i) => {
              const Icon = iconMap[item.icon] || FiCode;
              const colors = [
                { from: "from-blue-500/20", to: "to-cyan-500/20", icon: "text-blue-400", border: "border-blue-500/20" },
                { from: "from-purple-500/20", to: "to-pink-500/20", icon: "text-purple-400", border: "border-purple-500/20" },
                { from: "from-emerald-500/20", to: "to-green-500/20", icon: "text-emerald-400", border: "border-emerald-500/20" },
              ];
              const c = colors[i % 3];

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                  className="card group relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${c.from} ${c.to} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.from} ${c.to} border ${c.border} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`text-xl ${c.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                      <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <FiAward className="text-amber-400" />
            </div>
            <h3 className="text-white font-bold text-lg">Key Achievements</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.achievements.map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                className="card group relative overflow-hidden"
                whileHover={{ scale: 1.03 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex items-center gap-4">
                  <motion.span
                    className="text-2xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
                  >
                    {item.icon}
                  </motion.span>
                  <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
