"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowDown, FiDownload, FiEye, FiMail, FiCode } from "react-icons/fi";
import { FaGooglePlay, FaApple } from "react-icons/fa";

const roles = [
  "Software Engineer",
  "Flutter Developer",
  "React Native Developer",
  "Cross-Platform Expert",
  "Mobile App Architect",
];

const statsData = [
  { value: "4+", label: "Years Exp" },
  { value: "20+", label: "Projects" },
  { value: "15+", label: "Apps Deployed" },
  { value: "12+", label: "Technologies" },
];

const techStack = [
  "Flutter", "Dart", "React Native", "Firebase",
  "Stripe", "Razorpay", "BLoC", "Riverpod",
  "Redux", "GraphQL", "FCM", "Git",
  "WebRTC", "HealthKit",
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

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typedRole = useTypingAnimation(roles);
  const [codeVisible, setCodeVisible] = useState(false);
  const [codeTab, setCodeTab] = useState<"flutter" | "rn">("flutter");

  useEffect(() => {
    const timer = setTimeout(() => setCodeVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 3 + 0.5,
        alpha: Math.random() * 0.4 + 0.05,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `rgba(59, 130, 246, ${p.alpha})`);
        gradient.addColorStop(1, `rgba(139, 92, 246, 0)`);
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

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 via-dark-950/80 to-dark-950 pointer-events-none" />

      {/* Multiple glows */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent-blue/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-accent-purple/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-width px-4 sm:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left - Text Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-dark-300 text-xs sm:text-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Available for opportunities</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-4"
            >
              <span className="gradient-text animate-gradient-x bg-[length:200%_200%]">
                Akash Kumar
              </span>
              <br />
              <span className="text-white">Prajapati</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-9 mb-3"
            >
              <span className="text-base sm:text-lg md:text-xl text-white font-heading font-medium tracking-wide">
                {typedRole}
                <span className="animate-pulse text-accent-blue ml-0.5">|</span>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="text-sm sm:text-base text-dark-300 font-sans max-w-xl mb-4 leading-relaxed"
            >
              <span className="text-accent-blue font-semibold">$</span> building production-grade apps for <span className="text-accent-purple font-semibold">Android</span> &amp; <span className="text-accent-cyan font-semibold">iOS</span> — shipped worldwide
            </motion.p>

            {/* Awards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 text-yellow-400">
                🏆 Best Developer of the Year
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full bg-gradient-to-r from-accent-blue/20 to-accent-blue/5 border border-accent-blue/20 text-accent-blue">
                ⭐ Employee of the Month (Multiple Times)
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <a href="#projects" className="btn-primary flex items-center gap-2 text-sm">
                <FiEye />
                View Projects
              </a>
              <a href="/resume.pdf" download className="btn-outline flex items-center gap-2 text-sm">
                <FiDownload />
                Resume
              </a>
              <a href="#contact" className="btn-outline flex items-center gap-2 text-sm">
                <FiMail />
                Contact
              </a>
            </motion.div>

            {/* Store badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="flex flex-wrap items-center gap-3 mb-10"
            >
              <span className="text-dark-500 text-xs uppercase tracking-wider mr-1">Available on</span>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-medium hover:bg-white/10 hover:border-accent-blue/50 transition-all duration-300"
              >
                <FaGooglePlay className="text-green-400 text-sm" />
                Google Play
              </a>
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-medium hover:bg-white/10 hover:border-accent-blue/50 transition-all duration-300"
              >
                <FaApple className="text-white text-sm" />
                App Store
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg"
            >
              {statsData.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
                  className="card text-center py-5 px-3 glass-hover group relative overflow-hidden"
                >
                  {/* Top accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${i === 0 ? "from-accent-blue to-accent-purple" :
                    i === 1 ? "from-accent-purple to-accent-cyan" :
                      i === 2 ? "from-accent-cyan to-green-400" :
                        "from-green-400 to-accent-blue"
                    }`} />
                  <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-dark-400 text-[10px] uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right - Phone Mockup + Code + Tech */}
          <div className="hidden lg:flex flex-col items-center gap-8">
            {/* Code Snippet */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: codeVisible ? 1 : 0, x: codeVisible ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="w-full max-w-sm"
            >
              <div className="glass rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-accent-blue/10">
                {/* Window controls + Tabs */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex ml-4 gap-1">
                    <button
                      onClick={() => setCodeTab("flutter")}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-medium transition-all ${codeTab === "flutter"
                        ? "bg-accent-blue/20 text-accent-blue"
                        : "text-dark-400 hover:text-dark-200"
                        }`}
                    >
                      Flutter
                    </button>
                    <button
                      onClick={() => setCodeTab("rn")}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-medium transition-all ${codeTab === "rn"
                        ? "bg-accent-cyan/20 text-accent-cyan"
                        : "text-dark-400 hover:text-dark-200"
                        }`}
                    >
                      React Native
                    </button>
                  </div>
                </div>
                {/* Code */}
                <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-auto min-h-[180px]">
                  {((codeTab === "flutter" ? flutterCode : rnCode).split("\n")).map((line, i) => {
                    const indent = line.search(/\S/);
                    const trimmed = line.trim();
                    let color = "text-dark-300";
                    if (["import", "class", "Widget", "return", "const", "export", "React", "useRef"].some(w => trimmed.startsWith(w)))
                      color = "text-accent-blue";
                    else if (["final", "String", "int", "bool", "View", "Text", "MaterialApp", "Scaffold", "AppBar", "Center", "Column", "Icon", "StatusBar", "StyleSheet"].some(w => trimmed.startsWith(w)))
                      color = "text-accent-purple";
                    else if (trimmed.includes('"') || trimmed.includes("true") || trimmed.includes("false") || trimmed.includes("=>"))
                      color = "text-green-400";
                    else if (["@override", "}:", "};", "});"].some(w => trimmed.startsWith(w)))
                      color = "text-dark-500";

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5 + i * 0.05, duration: 0.25 }}
                        className={color}
                        style={{ paddingLeft: indent * 8 }}
                      >
                        {line.trim() || "\u00A0"}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="w-[240px] h-[490px] relative flex-shrink-0"
            >
              {/* Phone frame */}
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-dark-600 to-dark-800 p-[3px] shadow-2xl shadow-accent-blue/20">
                <div className="w-full h-full rounded-[2.85rem] bg-dark-950 overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-dark-950 rounded-b-2xl z-10 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-dark-600" />
                    <div className="w-16 h-1.5 rounded-full bg-dark-700" />
                  </div>

                  {/* Screen content */}
                  <div className="w-full h-full pt-8 pb-4 px-3 flex flex-col">
                    {/* Status bar */}
                    <div className="flex justify-between items-center px-1 mb-3">
                      <span className="text-white text-[10px] font-semibold">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-2 rounded-sm bg-white/60" />
                        <div className="flex gap-px">
                          {[1, 2, 3].map(i => (
                            <div key={i} className={`w-[2px] rounded-sm ${i <= 2 ? "bg-white/80" : "bg-white/30"}`} style={{ height: `${4 + i * 2}px` }} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* App header */}
                    <div className="bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl p-4 mb-3">
                      <p className="text-white/70 text-[9px] font-medium uppercase tracking-wider">Welcome</p>
                      <p className="text-white text-sm font-bold mt-0.5">My App</p>
                    </div>

                    {/* Content cards */}
                    <div className="flex-1 space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${i === 1 ? "from-accent-blue/40 to-accent-blue/10" :
                            i === 2 ? "from-accent-purple/40 to-accent-purple/10" :
                              "from-accent-cyan/40 to-accent-cyan/10"
                            } flex items-center justify-center`}>
                            <div className={`w-3 h-3 rounded-full ${i === 1 ? "bg-accent-blue" :
                              i === 2 ? "bg-accent-purple" :
                                "bg-accent-cyan"
                              }`} />
                          </div>
                          <div className="flex-1">
                            <div className="h-2 w-20 bg-white/10 rounded-full mb-1.5" />
                            <div className="h-1.5 w-14 bg-white/5 rounded-full" />
                          </div>
                          <div className="text-white/30 text-[10px]">
                            {i === 1 ? "Now" : i === 2 ? "2m" : "1h"}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom nav */}
                    <div className="flex justify-around pt-3 border-t border-white/5 mt-2">
                      {["Home", "Search", "Profile"].map(label => (
                        <div key={label} className="flex flex-col items-center gap-0.5">
                          <div className={`w-4 h-4 rounded-full ${label === "Home" ? "bg-accent-blue" : "bg-white/20"}`} />
                          <span className={`text-[8px] ${label === "Home" ? "text-accent-blue" : "text-white/40"}`}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating tech badges around phone */}
              {techStack.slice(0, 6).map((tech, i) => {
                const positions = [
                  { top: "-8%", left: "-25%" },
                  { top: "15%", right: "-28%" },
                  { top: "45%", left: "-22%" },
                  { top: "60%", right: "-25%" },
                  { bottom: "5%", left: "-20%" },
                  { bottom: "20%", right: "-30%" },
                ];
                const delays = [0, 0.3, 0.6, 0.9, 1.2, 1.5];
                return (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: [0, -6, 0, 4, 0],
                      x: [0, 3, -2, 3, 0],
                    }}
                    transition={{
                      opacity: { delay: 2.5 + delays[i], duration: 0.5 },
                      scale: { delay: 2.5 + delays[i], duration: 0.5 },
                      y: {
                        repeat: Infinity,
                        duration: 3 + (i % 3) * 0.5,
                        ease: "easeInOut",
                        delay: (i % 4) * 0.3,
                      },
                      x: {
                        repeat: Infinity,
                        duration: 4 + (i % 2) * 0.7,
                        ease: "easeInOut",
                        delay: (i % 3) * 0.4,
                      },
                    }}
                    className="absolute z-20 px-3.5 py-1.5 text-[11px] font-semibold rounded-full bg-dark-800/90 backdrop-blur-md border border-white/10 text-dark-200 whitespace-nowrap shadow-lg"
                    style={positions[i] as React.CSSProperties}
                    whileHover={{
                      scale: 1.2,
                      borderColor: "rgba(59,130,246,0.6)",
                      backgroundColor: "rgba(59,130,246,0.15)",
                    }}
                  >
                    {tech}
                  </motion.span>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Mobile: Tech cloud */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="lg:hidden max-w-xl mx-auto mt-8"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {techStack.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: 1,
                  y: [0, -3, 0],
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    duration: 2.5 + (i % 3) * 0.5,
                    ease: "easeInOut",
                    delay: (i % 4) * 0.15,
                  },
                }}
                className="px-3 py-1.5 text-[11px] font-medium rounded-full bg-white/5 border border-white/10 text-dark-300"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

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
            <FiArrowDown className="text-dark-500 text-xl" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
