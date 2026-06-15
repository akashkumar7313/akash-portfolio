"use client";

import { motion } from "framer-motion";
import { FiCpu } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";

const skillCategories = [
  {
    title: "Mobile Development",
    icon: "📱",
    skills: ["Flutter", "Dart", "React Native", "Android", "iOS"],
  },
  {
    title: "State Management",
    icon: "⚙️",
    skills: ["BLoC", "Riverpod", "Redux", "Provider"],
  },
  {
    title: "Backend & Cloud",
    icon: "☁️",
    skills: ["Firebase", "Firestore", "FCM", "REST APIs", "GraphQL"],
  },
  {
    title: "Payments",
    icon: "💳",
    skills: ["Stripe", "Razorpay", "In-App Purchases"],
  },
  {
    title: "Tools & Platforms",
    icon: "🛠️",
    skills: [
      "Git", "GitHub", "Xcode", "Android Studio",
      "VS Code", "Jira", "Codemagic",
    ],
  },
];

const badgeColors = [
  "from-accent-blue/20 to-accent-blue/5 border-accent-blue/20 hover:border-accent-blue/50 hover:text-accent-blue",
  "from-accent-purple/20 to-accent-purple/5 border-accent-purple/20 hover:border-accent-purple/50 hover:text-accent-purple",
  "from-accent-cyan/20 to-accent-cyan/5 border-accent-cyan/20 hover:border-accent-cyan/50 hover:text-accent-cyan",
  "from-green-500/20 to-green-500/5 border-green-500/20 hover:border-green-500/50 hover:text-green-400",
  "from-pink-500/20 to-pink-500/5 border-pink-500/20 hover:border-pink-500/50 hover:text-pink-400",
  "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/50 hover:text-yellow-400",
  "from-orange-500/20 to-orange-500/5 border-orange-500/20 hover:border-orange-500/50 hover:text-orange-400",
];

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-dark-900/50">
      <div className="max-width">
        <SectionHeading
          title="Skills & Expertise"
          subtitle="Technologies and tools I work with daily"
          icon={<FiCpu />}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="card glass-hover group"
            >
              <h3 className="text-white font-semibold mb-5 text-lg flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-accent-blue/10 flex items-center justify-center text-base group-hover:bg-accent-blue/20 transition-all duration-300">
                  {cat.icon}
                </span>
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, sIdx) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: idx * 0.1 + sIdx * 0.03,
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border bg-gradient-to-br transition-all duration-300 cursor-default text-dark-200 ${badgeColors[sIdx % badgeColors.length]}`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
