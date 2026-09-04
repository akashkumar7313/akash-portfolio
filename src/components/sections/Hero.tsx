"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowDown, FiDownload, FiEye, FiMail } from "react-icons/fi";
import { SiFlutter } from "react-icons/si";
import Stats from "./Stats";
import Link from "next/link";

const roles = [
  "Software Engineer",
  "Flutter Developer",
  "React Native Developer",
  "Cross-Platform Expert",
  "Mobile App Architect",
];

const techStack = [
  { name: "Flutter", icon: "💙", color: "from-blue-500 to-cyan-500" },
  { name: "Dart", icon: "🎯", color: "from-teal-500 to-cyan-500" },
  { name: "React Native", icon: "⚛️", color: "from-sky-500 to-blue-500" },
  { name: "Firebase", icon: "🔥", color: "from-yellow-500 to-orange-500" },
  { name: "Stripe", icon: "💳", color: "from-purple-500 to-indigo-500" },
  { name: "Razorpay", icon: "💰", color: "from-emerald-500 to-green-500" },
  { name: "BLoC", icon: "🧩", color: "from-pink-500 to-rose-500" },
  { name: "Riverpod", icon: "📦", color: "from-indigo-500 to-violet-500" },
  { name: "Redux", icon: "🔄", color: "from-violet-500 to-purple-500" },
  { name: "GraphQL", icon: "◈", color: "from-rose-500 to-pink-500" },
  { name: "FCM", icon: "🔔", color: "from-orange-500 to-amber-500" },
  { name: "Git", icon: "🔀", color: "from-red-500 to-orange-500" },
  { name: "WebRTC", icon: "📹", color: "from-cyan-500 to-sky-500" },
  { name: "HealthKit", icon: "❤️", color: "from-red-500 to-rose-500" },
];

function useTypingAnimation(texts: string[]) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout: NodeJS.Timeout;

    if (!deleting && charIndex < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayed(currentText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 80);
    } else if (!deleting && charIndex === currentText.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(currentText.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, 40);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts]);

  return displayed;
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const typedRole = useTypingAnimation(roles);
  const [resumeUrl, setResumeUrl] = useState("");
  const [apiStack, setApiStack] = useState<{ name: string; icon: string; color: string }[] | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  useEffect(() => {
    fetch("/api/hero")
      .then((r) => r.json())
      .then((d) => {
        const arr = d?.techStack as { text: string }[] | undefined;
        if (arr && arr.length > 0) {
          setApiStack(
            arr.map((t) => {
              const match = techStack.find((ts) => ts.name.toLowerCase() === t.text.toLowerCase());
              return match || { name: t.text, icon: "⚡", color: "from-slate-500 to-slate-400" };
            })
          );
        }
        if (d?.resumeUrl) setResumeUrl(d.resumeUrl);
      })
      .catch(() => {});
  }, []);

  const liveStack = apiStack && apiStack.length > 0 ? apiStack : techStack;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_20%_50%,rgba(59,130,246,0.08)_0%,transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_80%_20%,rgba(139,92,246,0.06)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_40%_80%,rgba(6,182,212,0.05)_0%,transparent_50%)]" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "4s" }} />
      <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-purple-500/8 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "5s", animationDelay: "1s" }} />

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 max-width px-4 sm:px-8 lg:px-16 xl:px-24 w-full py-20"
      >
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[80vh]">
          {/* Left Content - 7 cols */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm mb-8"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-white/70 text-xs font-medium tracking-wide">Available for opportunities</span>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tight mb-6">
                <span className="block text-white/90">Akash</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Kumar
                </span>
                <span className="block text-white/90">Prajapati</span>
              </h1>
            </motion.div>

            {/* Typed role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-10 mb-6 flex items-center justify-center lg:justify-start"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500" />
                <span className="text-lg sm:text-xl md:text-2xl text-white/80 font-heading font-medium">
                  {typedRole}
                  <span className="animate-pulse text-blue-400 ml-1">|</span>
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base text-white/50 max-w-xl mb-8 leading-relaxed mx-auto lg:mx-0"
            >
              Building production-grade apps for{" "}
              <span className="text-blue-400 font-semibold">Android</span> &{" "}
              <span className="text-purple-400 font-semibold">iOS</span> — shipped worldwide
            </motion.p>

            {/* Awards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 text-amber-400">
                🏆 Best Developer of the Year
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 text-blue-400">
                ⭐ Employee of the Month
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12"
            >
              <Link
                href="/projects"
                className="group relative px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FiEye className="w-4 h-4" />
                  View Projects
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <a
                href={resumeUrl && !resumeUrl.startsWith("data:") ? resumeUrl : "/api/resume"}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-7 py-3.5 rounded-xl border border-white/10 text-white/80 font-semibold text-sm hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <FiDownload className="w-4 h-4" />
                  Resume
                </span>
              </a>

              <Link
                href="/contact"
                className="group px-7 py-3.5 rounded-xl border border-white/10 text-white/80 font-semibold text-sm hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <FiMail className="w-4 h-4" />
                  Contact
                </span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Stats />
            </motion.div>
          </div>

          {/* Right - Code + Phone - 5 cols */}
          <div className="lg:col-span-5 relative">
            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotateY: -10 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative mx-auto"
              style={{ maxWidth: "320px" }}
            >
              {/* Glow behind phone */}
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-50" />

              {/* Phone frame */}
              <div className="relative rounded-[3rem] bg-gradient-to-b from-white/10 to-white/5 p-[3px] shadow-2xl shadow-black/50">
                <div className="rounded-[2.85rem] bg-slate-950 overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-slate-950 rounded-b-2xl z-10" />

                  {/* Screen content */}
                  <div className="pt-10 pb-6 px-5 min-h-[580px]">
                    {/* Status bar */}
                    <div className="flex justify-between items-center px-1 mb-6">
                      <span className="text-white text-[11px] font-semibold">9:41</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-2.5 rounded-sm bg-white/60" />
                        <div className="flex gap-px">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`w-[2px] rounded-sm ${i <= 2 ? "bg-white/80" : "bg-white/30"}`}
                              style={{ height: `${4 + i * 2}px` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* App header */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <SiFlutter className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-bold">Akash Portfolio</h3>
                        <p className="text-white/40 text-[10px]">Mobile App Developer</p>
                      </div>
                    </div>

                    {/* Install button */}
                    <div className="w-full py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-center text-white text-xs font-bold mb-5 shadow-lg shadow-blue-500/20">
                      Install
                    </div>

                    {/* Screenshots placeholder */}
                    <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-[72px] h-[130px] rounded-xl flex-shrink-0 border border-white/5 overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, hsl(${220 + i * 15}, 60%, ${12 + i * 2}%), hsl(${240 + i * 10}, 50%, ${8 + i * 2}%))`,
                          }}
                        >
                          <div className="p-2">
                            <div className="w-4 h-1 rounded bg-white/10 mb-1" />
                            <div className="w-3 h-3 rounded bg-white/5 mx-auto mt-4" />
                            <div className="space-y-1 mt-2">
                              <div className="h-1 w-full rounded bg-white/5" />
                              <div className="h-1 w-3/4 rounded bg-white/5" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="bg-white/5 rounded-xl p-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-xl font-bold text-white">4.9</div>
                          <div className="flex gap-0.5 justify-center">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-1.5">
                              <span className="text-white/40 text-[9px] w-2">{star}</span>
                              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-amber-400"
                                  style={{ width: `${star === 5 ? 100 : star === 4 ? 40 : star === 3 ? 10 : 0}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Review */}
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-[8px]">
                          RS
                        </div>
                        <div>
                          <div className="text-white text-[10px] font-semibold">Rahul Sharma</div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-white/50 text-[9px] leading-relaxed">
                        &ldquo;Exceptional Flutter expertise! Delivered an outstanding e-commerce app.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating tech badges */}
              {liveStack.slice(0, 8).map((tech, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const radius = 180;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: [0, -6, 0, 4, 0],
                    }}
                    transition={{
                      opacity: { delay: 1.5 + i * 0.15, duration: 0.5 },
                      scale: { delay: 1.5 + i * 0.15, duration: 0.5 },
                      y: { repeat: Infinity, duration: 3 + (i % 3) * 0.5, ease: "easeInOut", delay: i * 0.2 },
                    }}
                    className="absolute z-20 px-3 py-1.5 text-[10px] font-bold rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 text-white whitespace-nowrap shadow-lg flex items-center gap-1.5"
                    style={{
                      left: `calc(50% + ${x}px - 40px)`,
                      top: `calc(50% + ${y}px)`,
                    }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <span className="text-xs">{tech.icon}</span>
                    {tech.name}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="flex justify-center mt-8"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-white/30 text-[10px] uppercase tracking-widest">Scroll</span>
            <FiArrowDown className="text-white/30 text-sm" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
