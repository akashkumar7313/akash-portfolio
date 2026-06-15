"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUser, FiCode, FiServer, FiSmartphone, FiAward } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";

const highlights = [
  {
    icon: FiSmartphone,
    title: "Cross-platform Apps",
    desc: "Flutter & React Native expert — one codebase, two platforms.",
    gradient: "from-accent-blue/20 to-accent-purple/20",
    iconColor: "text-accent-blue",
  },
  {
    icon: FiServer,
    title: "Firebase Backend",
    desc: "Real-time databases, authentication, cloud functions, and push notifications.",
    gradient: "from-accent-purple/20 to-accent-cyan/20",
    iconColor: "text-accent-purple",
  },
  {
    icon: FiCode,
    title: "Clean Architecture",
    desc: "Production-ready scalable code with BLoC, Riverpod & Redux.",
    gradient: "from-accent-cyan/20 to-green-500/20",
    iconColor: "text-accent-cyan",
  },
];

const achievements = [
  { icon: "🏆", text: "Published 15+ apps on Play Store & App Store" },
  { icon: "⭐", text: "4.8+ average app rating from users" },
  { icon: "🎯", text: "Delivered all projects on time & within budget" },
];

export default function About() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;
    const drops: { x: number; y: number; speed: number; alpha: number }[] = [];

    for (let i = 0; i < 30; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.3 + Math.random() * 0.5,
        alpha: 0.03 + Math.random() * 0.04,
      });
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
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

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="max-width relative z-10">
        <SectionHeading
          title="About Me"
          subtitle="A passionate software engineer crafting exceptional mobile experiences"
          icon={<FiUser />}
        />

        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-3"
          >
            <div className="card space-y-5 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-blue/10 rounded-full blur-3xl" />
              <p className="text-dark-200 leading-relaxed text-base md:text-lg relative z-10">
                I am a detail-oriented Software Engineer with{" "}
                <span className="text-accent-blue font-bold text-lg">
                  4+ years
                </span>{" "}
                of experience building scalable mobile applications using
                Flutter and React Native.
              </p>
              <p className="text-dark-300 leading-relaxed relative z-10">
                I specialize in cross-platform mobile apps, Firebase backend
                systems, REST API integration, payment gateways (Stripe,
                Razorpay), App Store & Play Store deployment, and performance
                optimization.
              </p>
              <p className="text-dark-300 leading-relaxed relative z-10">
                I believe in writing clean, scalable, and production-ready code
                that delivers real business value. Every project I take on is
                an opportunity to solve meaningful problems through technology.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="grid gap-4">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="glass rounded-xl p-5 flex items-start gap-4 glass-hover relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-300 ${item.iconColor}`}>
                    <item.icon className="text-xl" />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-white font-semibold mb-1">
                      {item.title}
                    </h4>
                    <p className="text-dark-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
            <FiAward className="text-accent-blue" />
            Key Achievements
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {achievements.map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                className="glass rounded-xl p-5 flex items-center gap-4 glass-hover relative overflow-hidden"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 30px rgba(59,130,246,0.15)",
                }}
              >
                <motion.span
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
                >
                  {item.icon}
                </motion.span>
                <p className="text-dark-300 text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
