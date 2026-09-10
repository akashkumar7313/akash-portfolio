"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiArrowDown, FiDownload, FiEye, FiMail, FiStar, FiThumbsUp, FiClock } from "react-icons/fi";
import { FaGooglePlay, FaApple } from "react-icons/fa";
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
  "Flutter", "Dart", "React Native", "Firebase",
  "Stripe", "Razorpay", "BLoC", "Riverpod",
  "Redux", "GraphQL", "FCM", "Git",
  "WebRTC", "HealthKit",
];

const reviews = [
  {
    name: "Rahul Sharma",
    date: "2 months ago",
    text: "Akash delivered an exceptional e-commerce app. His Flutter expertise is outstanding!",
    rating: 5,
    likes: 24,
  },
  {
    name: "Priya Patel",
    date: "1 month ago",
    text: "Built our healthcare booking app with WebRTC — works flawlessly.",
    rating: 5,
    likes: 18,
  },
  {
    name: "Vikram Singh",
    date: "3 weeks ago",
    text: "Architected our food delivery platform. Real-time tracking is incredibly smooth.",
    rating: 5,
    likes: 31,
  },
];

const flutterCode = `class FlutterApp {
  final String name = "Cross-Platform App";
  final String framework = "Flutter + Firebase";

  void build() {
    var app = MobileApp(
      platform: "Android & iOS",
      stateMgmt: "BLoC + Riverpod",
      payments: "Stripe & Razorpay",
    );
    app.deploy();
    app.ship();
  }
}`;

const rnCode = `class ReactNativeApp {
  final name = "Cross-Platform App";
  final framework = "React Native + Firebase";

  void build() {
    var app = MobileApp(
      platform: "Android & iOS",
      stateMgmt: "Redux + Context",
      payments: "Stripe & Razorpay",
    );
    app.deploy();
    app.ship();
  }
}`;

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

function useCodeTyper(code: string, speed: number = 25) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const t = setInterval(() => {
      if (i < code.length) {
        setDisplayed(code.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(t);
      }
    }, speed);
    return () => clearInterval(t);
  }, [code, speed]);

  return { displayed, done };
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typedRole = useTypingAnimation(roles);
  const [codeVisible, setCodeVisible] = useState(false);
  const [codeTab, setCodeTab] = useState<"flutter" | "rn">("flutter");
  const [reviewIndex, setReviewIndex] = useState(0);
  const [apiStack, setApiStack] = useState<string[] | null>(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [particles, setParticles] = useState(true);

  useEffect(() => {
    fetch("/api/hero").then(r => r.json()).then(d => {
      const arr = d?.techStack as { text: string }[] | undefined;
      if (arr && arr.length > 0) setApiStack(arr.map(t => t.text));
      if (d?.resumeUrl) setResumeUrl(d.resumeUrl);
    }).catch(() => {});
    fetch("/api/settings").then(r => r.json()).then(s => {
      if (s?.particles === false) setParticles(false);
    }).catch(() => {});
  }, []);

  const liveStack = apiStack && apiStack.length > 0 ? apiStack : techStack;

  const badgePositions = useMemo(() => {
    const count = Math.min(liveStack.length, 15);
    const pos: Record<string, string>[] = [];
    const used: { side: string; y: number }[] = [];
    for (let i = 0; i < count; i++) {
      let side: string, y: number, p: Record<string, string>;
      let att = 0;
      do {
        const r = Math.random();
        if (r < 0.10) { side = "tl"; y = Math.floor(Math.random() * 18 - 5); p = { top: `${y}%`, left: `${-Math.floor(Math.random() * 6 + 3)}%` }; }
        else if (r < 0.20) { side = "tr"; y = Math.floor(Math.random() * 18 - 5); p = { top: `${y}%`, right: `${-Math.floor(Math.random() * 6 + 3)}%` }; }
        else if (r < 0.40) { side = "t"; y = Math.floor(Math.random() * 12 - 20); p = { top: `${y}%`, left: `${Math.floor(Math.random() * 55 + 10)}%` }; }
        else if (r < 0.50) { side = "bl"; y = 100 - Math.floor(Math.random() * 12 + 3); p = { top: `${y}%`, left: `${-Math.floor(Math.random() * 6 + 3)}%` }; }
        else if (r < 0.60) { side = "br"; y = 100 - Math.floor(Math.random() * 12 + 3); p = { top: `${y}%`, right: `${-Math.floor(Math.random() * 6 + 3)}%` }; }
        else if (r < 0.80) { side = "l"; y = Math.floor(Math.random() * 90 - 5); p = { top: `${y}%`, left: `${-Math.floor(Math.random() * 8 + 8)}%` }; }
        else { side = "r"; y = Math.floor(Math.random() * 90 - 5); p = { top: `${y}%`, right: `${-Math.floor(Math.random() * 8 + 8)}%` }; }
        att++;
      } while (used.some(u => u.side[0] === side[0] && Math.abs(u.y - y) < 5) && att < 50);
      used.push({ side, y });
      pos.push(p);
    }
    return pos;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveStack.join(",")]);

  const { displayed: typedFlutter } = useCodeTyper(codeVisible ? flutterCode : "", 25);
  const { displayed: typedRn } = useCodeTyper(codeVisible ? rnCode : "", 25);
  const typedCode = codeTab === "flutter" ? typedFlutter : typedRn;

  useEffect(() => {
    const timer = setTimeout(() => setCodeVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!particles) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const pts: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 80; i++) {
      pts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 5 + 2,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `rgba(201, 243, 108, ${p.alpha})`);
        gradient.addColorStop(1, `rgba(168, 217, 74, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const review = reviews[reviewIndex];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {particles && (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-[#c9f36c]/5 via-white dark:via-[#101412] to-white dark:to-[#101412] pointer-events-none" />

      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#c9f36c]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-[#a8d94a]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] bg-[#c9f36c]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-width px-4 sm:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-4 items-center">
          {/* Left - Text Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9f36c]/10 border border-[#c9f36c]/20 text-[#c9f36c] text-xs sm:text-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#c9f36c] animate-pulse" />
              <span>Available for opportunities</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-6"
            >
              <span className="gradient-text animate-gradient-x bg-[length:200%_200%]">
                Akash Kumar
              </span>
              <br />
              <span className="text-[#f4f7f2]">Prajapati</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-9 mb-6"
            >
              <span className="text-base sm:text-lg md:text-xl text-[#f4f7f2] font-heading font-medium tracking-wide">
                {typedRole}
                <span className="animate-pulse text-[#c9f36c] ml-0.5">|</span>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="text-sm sm:text-base text-[#91a096] font-sans max-w-xl mb-8 leading-relaxed"
            >
              <span className="text-[#c9f36c] font-semibold">$</span> building production-grade apps for <span className="text-[#a8d94a] font-semibold">Android</span> &amp; <span className="text-[#c9f36c] font-semibold">iOS</span> — shipped worldwide
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full bg-[#c9f36c]/20 border border-[#c9f36c]/30 text-[#c9f36c]">
                🏆 Best Developer of the Year
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full bg-[#c9f36c]/10 border border-[#c9f36c]/20 text-[#f4f7f2]">
                ⭐ Employee of the Month (Multiple Times)
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8"
            >
              <Link href="/projects" className="btn-primary flex items-center gap-2 text-sm">
                <FiEye />
                View Projects
              </Link>
              <a
                href={resumeUrl && !resumeUrl.startsWith("data:") ? resumeUrl : "/api/resume"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <FiDownload />
                Resume
              </a>
              <Link href="/contact" className="btn-primary flex items-center gap-2 text-sm">
                <FiMail />
                Contact
              </Link>
            </motion.div>

            {/* Stats */}
            <div className="mt-8">
              <Stats />
            </div>
          </div>

          {/* Right - Phone + Code side by side */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6">


            {/* Code — side by side with phone */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: codeVisible ? 1 : 0, x: codeVisible ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="w-full max-w-[350px] mt-16"
            >
              <div className="rounded-2xl overflow-hidden border border-[#c9f36c]/20 bg-[#151b17] shadow-2xl shadow-black/30">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1b221d] border-b border-[#c9f36c]/10">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex ml-4 gap-1">
                    <button onClick={() => setCodeTab("flutter")} className={`px-3 py-1 rounded-lg text-[10px] font-mono font-medium transition-all ${codeTab === "flutter" ? "bg-[#c9f36c]/20 text-[#c9f36c]" : "text-[#91a096] hover:text-[#f4f7f2]"}`}>Flutter</button>
                    <button onClick={() => setCodeTab("rn")} className={`px-3 py-1 rounded-lg text-[10px] font-mono font-medium transition-all ${codeTab === "rn" ? "bg-[#c9f36c]/20 text-[#c9f36c]" : "text-[#91a096] hover:text-[#f4f7f2]"}`}>React Native</button>
                  </div>
                </div>
                <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-auto min-h-[200px]">
                  {typedCode.split("\n").map((line, i) => {
                    const indent = line.search(/\S/);
                    const trimmed = line.trim();
                    let color = "text-[#91a096] dark:text-slate-400";
                    // Keywords
                    if (["import", "class", "void", "return", "const", "export", "final", "var"].some(w => trimmed.startsWith(w))) color = "text-[#c9f36c] dark:text-emerald-400";
                    // Types
                    else if (["String", "int", "bool", "Widget", "MobileApp", "FlutterApp", "ReactNativeApp"].some(w => trimmed.includes(w))) color = "text-[#06b6d4] dark:text-cyan-400";
                    // Strings
                    else if (trimmed.includes('"') || trimmed.includes("'")) color = "text-[#f59e0b] dark:text-amber-400";
                    // Numbers & booleans
                    else if (/\b\d+\b/.test(trimmed) || trimmed.includes("true") || trimmed.includes("false")) color = "text-[#a853ff] dark:text-violet-400";
                    // Methods
                    else if (trimmed.includes(".") && trimmed.includes("(")) color = "text-[#3b82f6] dark:text-blue-400";
                    // Properties
                    else if (trimmed.includes(":") && !trimmed.includes("//")) color = "text-[#ec4899] dark:text-pink-400";
                    // Comments & brackets
                    else if (trimmed.startsWith("//") || trimmed.startsWith("/*")) color = "text-[#6b7280] dark:text-slate-500 italic";
                    else if (["};", "})", "};", "});"].some(w => trimmed.startsWith(w))) color = "text-[#91a096] dark:text-slate-500";
                    return (<div key={i} className={color} style={{ paddingLeft: indent * 8 }}>{trimmed || "\u00A0"}</div>);
                  })}
                  {typedCode.length < (codeTab === "flutter" ? flutterCode : rnCode).length && (
                    <span className="animate-pulse text-[#c9f36c]">|</span>
                  )}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="flex-col items-center gap-2 mt-24 hidden lg:flex"
              >
                <span className="text-[#91a096] text-sm font-semibold uppercase tracking-wider">Available on</span>
                <div className="flex items-center gap-3">
                  <a href="" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-3 bg-[#1b221d] border border-[#c9f36c]/20 rounded-xl text-[#f4f7f2] text-xs font-medium hover:bg-[#c9f36c]/10 hover:border-[#c9f36c]/40 transition-all duration-300">
                    <FaGooglePlay className="text-[#c9f36c] text-sm" />
                    Google Play
                  </a>
                  <a href="" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-3 bg-[#1b221d] border border-[#c9f36c]/20 rounded-xl text-[#f4f7f2] text-xs font-medium hover:bg-[#c9f36c]/10 hover:border-[#c9f36c]/40 transition-all duration-300">
                    <FaApple className="text-[#f4f7f2] text-sm" />
                    App Store
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* Store badges + Phone column */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="dark relative"
                style={{ width: "300px", height: "620px" }}
              >
                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-[#2a3a30] to-[#101412] p-[3px] shadow-2xl shadow-[#c9f36c]/20">
                  <div className="w-full h-full rounded-[2.85rem] bg-[#0a0d0b] overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-[#0a0d0b] rounded-b-2xl z-10 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#2a3a30]" />
                      <div className="w-20 h-1.5 rounded-full bg-[#1b221d]" />
                    </div>
                    <div className="w-full h-full pt-8 pb-4 px-4 flex flex-col">
                      <div className="flex justify-between items-center px-1 mb-2 flex-shrink-0">
                        <span className="text-[#f4f7f2] text-[10px] font-semibold">9:41</span>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-2 rounded-sm bg-[#f4f7f2]/60" />
                          <div className="flex gap-px">
                            {[1, 2, 3].map(i => (
                              <div key={i} className={`w-[2px] rounded-sm ${i <= 2 ? "bg-[#f4f7f2]/80" : "bg-[#f4f7f2]/30"}`} style={{ height: `${4 + i * 2}px` }} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mb-3 flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] flex items-center justify-center shadow-lg shadow-[#c9f36c]/20">
                          <SiFlutter className="text-[#101412] text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[#f4f7f2] text-sm font-bold truncate">Akash Portfolio</h3>
                          <p className="text-[#91a096] text-[10px]">Mobile App Developer</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(i => (<FiStar key={i} className="text-[#c9f36c] fill-[#c9f36c]" size={9} />))}
                            </div>
                            <span className="text-[#91a096] text-[8px]">4.9</span>
                            <span className="text-[#91a096]/50 text-[8px]">•</span>
                            <span className="text-[#91a096] text-[8px]">5 reviews</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                        <div className="flex-1 py-2 rounded-full bg-[#c9f36c] text-center text-[#101412] text-[11px] font-bold shadow-lg shadow-[#c9f36c]/20">Install</div>
                        <div className="text-[#91a096] text-[8px] text-center leading-tight">
                          <div>4.2 MB</div>
                          <div>Everyone</div>
                        </div>
                      </div>
                      <div className="flex gap-2 mb-4 flex-shrink-0 overflow-x-auto pb-1">
                        {["#1b221d", "#151b17", "#1b221d", "#151b17"].map((color, i) => (
                          <div key={i} className="w-16 h-28 rounded-xl flex-shrink-0 border border-[#c9f36c]/10 overflow-hidden" style={{ background: `linear-gradient(135deg,${color},${color}88)` }}>
                            <div className="p-2">
                              <div className="w-4 h-1 rounded bg-[#c9f36c]/10 mb-1" />
                              <div className="w-3 h-3 rounded bg-[#c9f36c]/5 mx-auto mt-4" />
                              <div className="space-y-1 mt-2">
                                <div className="h-1 w-full rounded bg-[#c9f36c]/5" />
                                <div className="h-1 w-3/4 rounded bg-[#c9f36c]/5" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mb-2 flex-shrink-0">
                        <h4 className="text-[#f4f7f2] text-[10px] font-bold uppercase tracking-wider">Ratings & Reviews</h4>
                        <span className="text-[#c9f36c] text-[8px]">See all</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3 bg-[#c9f36c]/5 rounded-xl p-3 flex-shrink-0">
                        <div className="text-center flex-shrink-0">
                          <div className="text-xl font-bold text-[#f4f7f2]">4.9</div>
                          <div className="flex gap-0.5 justify-center">
                            {[1, 2, 3, 4, 5].map(i => (<FiStar key={i} className="text-[#c9f36c] fill-[#c9f36c]" size={8} />))}
                          </div>
                        </div>
                        <div className="flex-1 space-y-0.5">
                          {[5, 4, 3, 2, 1].map(star => (
                            <div key={star} className="flex items-center gap-1.5">
                              <span className="text-[#91a096] text-[8px] w-2">{star}</span>
                              <div className="flex-1 h-1 bg-[#c9f36c]/5 rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-[#c9f36c]" style={{ width: `${star === 5 ? 100 : star === 4 ? 40 : star === 3 ? 10 : 0}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 min-h-0">
                        <motion.div key={reviewIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="bg-[#c9f36c]/5 rounded-xl p-3 h-full">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] flex items-center justify-center text-[#101412] font-bold text-[8px]">
                              {review.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-[#f4f7f2] text-[9px] font-semibold truncate">{review.name}</span>
                                <span className="text-[#91a096] text-[7px] flex items-center gap-1 flex-shrink-0"><FiClock size={6} />{review.date}</span>
                              </div>
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: review.rating }).map((_, i) => (<FiStar key={i} className="text-[#c9f36c] fill-[#c9f36c]" size={7} />))}
                              </div>
                            </div>
                          </div>
                          <p className="text-[#91a096] text-[9px] leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#c9f36c]/10">
                            <FiThumbsUp size={7} className="text-[#91a096]" />
                            <span className="text-[#91a096] text-[7px]">{review.likes}</span>
                            <span className="text-[#91a096]/50 text-[7px]">•</span>
                            <span className="text-[#c9f36c] text-[7px]">Reply</span>
                          </div>
                        </motion.div>
                      </div>
                      <div className="flex justify-around pt-2 border-t border-[#c9f36c]/10 mt-2 flex-shrink-0">
                        {["Apps", "Search", "Updates"].map(label => (
                          <div key={label} className="flex flex-col items-center gap-0.5">
                            <div className={`w-3 h-3 rounded-sm ${label === "Apps" ? "bg-[#c9f36c]" : "bg-[#f4f7f2]/20"}`} />
                            <span className={`text-[7px] ${label === "Apps" ? "text-[#c9f36c]" : "text-[#f4f7f2]/40"}`}>{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              {liveStack.slice(0, 14).map((tech, i) => {
                const p = {...badgePositions[i]};
                if (!p.top && !p.bottom) return null;
                const techColors: Record<string, { icon: string; bg: string; border: string; text: string; lightBg: string; lightBorder: string; lightText: string }> = {
                  Flutter: { icon: "💙", bg: "bg-blue-500/20", border: "border-blue-500/40", text: "text-blue-400", lightBg: "bg-blue-500/10", lightBorder: "border-blue-500/30", lightText: "text-blue-600" },
                  Dart: { icon: "🎯", bg: "bg-teal-500/20", border: "border-teal-500/40", text: "text-teal-400", lightBg: "bg-teal-500/10", lightBorder: "border-teal-500/30", lightText: "text-teal-600" },
                  "React Native": { icon: "⚛️", bg: "bg-sky-500/20", border: "border-sky-500/40", text: "text-sky-400", lightBg: "bg-sky-500/10", lightBorder: "border-sky-500/30", lightText: "text-sky-600" },
                  Firebase: { icon: "🔥", bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400", lightBg: "bg-amber-500/10", lightBorder: "border-amber-500/30", lightText: "text-amber-600" },
                  Stripe: { icon: "💳", bg: "bg-purple-500/20", border: "border-purple-500/40", text: "text-purple-400", lightBg: "bg-purple-500/10", lightBorder: "border-purple-500/30", lightText: "text-purple-600" },
                  Razorpay: { icon: "💰", bg: "bg-indigo-500/20", border: "border-indigo-500/40", text: "text-indigo-400", lightBg: "bg-indigo-500/10", lightBorder: "border-indigo-500/30", lightText: "text-indigo-600" },
                  BLoC: { icon: "🧩", bg: "bg-pink-500/20", border: "border-pink-500/40", text: "text-pink-400", lightBg: "bg-pink-500/10", lightBorder: "border-pink-500/30", lightText: "text-pink-600" },
                  Riverpod: { icon: "📦", bg: "bg-orange-500/20", border: "border-orange-500/40", text: "text-orange-400", lightBg: "bg-orange-500/10", lightBorder: "border-orange-500/30", lightText: "text-orange-600" },
                  Redux: { icon: "🔄", bg: "bg-violet-500/20", border: "border-violet-500/40", text: "text-violet-400", lightBg: "bg-violet-500/10", lightBorder: "border-violet-500/30", lightText: "text-violet-600" },
                  GraphQL: { icon: "◈", bg: "bg-rose-500/20", border: "border-rose-500/40", text: "text-rose-400", lightBg: "bg-rose-500/10", lightBorder: "border-rose-500/30", lightText: "text-rose-600" },
                  FCM: { icon: "🔔", bg: "bg-red-500/20", border: "border-red-500/40", text: "text-red-400", lightBg: "bg-red-500/10", lightBorder: "border-red-500/30", lightText: "text-red-600" },
                  Git: { icon: "🔀", bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400", lightBg: "bg-emerald-500/10", lightBorder: "border-emerald-500/30", lightText: "text-emerald-600" },
                  WebRTC: { icon: "📹", bg: "bg-cyan-500/20", border: "border-cyan-500/40", text: "text-cyan-400", lightBg: "bg-cyan-500/10", lightBorder: "border-cyan-500/30", lightText: "text-cyan-600" },
                  HealthKit: { icon: "❤️", bg: "bg-red-400/20", border: "border-red-400/40", text: "text-red-400", lightBg: "bg-red-400/10", lightBorder: "border-red-400/30", lightText: "text-red-500" },
                };
                const key = Object.keys(techColors).find(k => tech.toLowerCase().includes(k.toLowerCase())) || "";
                const c = techColors[key] || { icon: "⚡", bg: "bg-[#c9f36c]/20", border: "border-[#c9f36c]/40", text: "text-[#c9f36c]", lightBg: "bg-[#c9f36c]/10", lightBorder: "border-[#c9f36c]/30", lightText: "text-[#16a34a]" };
                return (
                  <motion.span key={tech} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, y: [0, -5, 0, 3, 0], x: [0, 2, -2, 2, 0] }} transition={{
                    opacity: { delay: 2.5 + i * 0.3, duration: 0.5 }, scale: { delay: 2.5 + i * 0.3, duration: 0.5 },
                    y: { repeat: Infinity, duration: 3 + (i % 3) * 0.5, ease: "easeInOut", delay: (i % 4) * 0.3 },
                    x: { repeat: Infinity, duration: 4 + (i % 2) * 0.7, ease: "easeInOut", delay: (i % 3) * 0.4 },
                  }} className={`absolute z-20 px-3 py-1.5 text-[11px] font-bold rounded-full backdrop-blur-md border whitespace-nowrap shadow-lg flex items-center gap-1.5 w-fit dark:${c.bg} dark:${c.border} dark:${c.text} dark:shadow-black/20 ${c.lightBg} ${c.lightBorder} ${c.lightText} shadow-black/10`} style={p as React.CSSProperties} whileHover={{ scale: 1.2, y: -8 }}>
                    <span className="text-[13px]">{c.icon}</span>
                    {tech}
                  </motion.span>
                );
              })}
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="flex justify-center mt-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <FiArrowDown className="text-[#91a096] text-xl" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
