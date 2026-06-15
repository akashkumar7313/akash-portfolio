"use client";

import { motion } from "framer-motion";
import { FiUser, FiCode, FiServer, FiSmartphone, FiAward } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";

const highlights = [
  {
    icon: FiSmartphone,
    title: "Cross-platform Apps",
    desc: "Flutter & React Native expert — one codebase, two platforms.",
  },
  {
    icon: FiServer,
    title: "Firebase Backend",
    desc: "Real-time databases, authentication, cloud functions, and push notifications.",
  },
  {
    icon: FiCode,
    title: "Clean Architecture",
    desc: "Production-ready scalable code with BLoC, Riverpod & Redux.",
  },
];

const achievements = [
  { icon: "🏆", text: "Published 15+ apps on Play Store & App Store" },
  { icon: "⭐", text: "4.8+ average app rating from users" },
  { icon: "🎯", text: "Delivered all projects on time & within budget" },
];

export default function About() {
  return (
    <section id="about" className="section-padding">
      <div className="max-width">
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
            <div className="card space-y-5">
              <p className="text-dark-200 leading-relaxed text-base md:text-lg">
                I am a detail-oriented Software Engineer with{" "}
                <span className="text-accent-blue font-semibold">
                  4+ years
                </span>{" "}
                of experience building scalable mobile applications using
                Flutter and React Native.
              </p>
              <p className="text-dark-300 leading-relaxed">
                I specialize in cross-platform mobile apps, Firebase backend
                systems, REST API integration, payment gateways (Stripe,
                Razorpay), App Store & Play Store deployment, and performance
                optimization.
              </p>
              <p className="text-dark-300 leading-relaxed">
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
                  className="glass rounded-xl p-5 flex items-start gap-4 glass-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-accent-blue text-xl" />
                  </div>
                  <div>
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

        {/* Achievements instead of stats */}
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
                className="glass rounded-xl p-5 flex items-center gap-4 glass-hover"
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="text-dark-300 text-sm leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
