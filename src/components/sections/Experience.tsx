"use client";

import { motion } from "framer-motion";
import { FiBriefcase, FiCalendar } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";

const experiences = [
  {
    role: "Software Engineer",
    company: "Singsys Software Services Pvt Ltd",
    period: "Apr 2024 – Present",
    gradient: "from-accent-blue to-accent-purple",
    description: [
      "Built and deployed production mobile apps using Flutter & React Native",
      "Integrated REST APIs, Firebase, payment systems",
      "Published apps on Play Store & App Store",
      "Optimized performance and architecture",
    ],
  },
  {
    role: "React Native Developer",
    company: "Vibrant IT Solutions Pvt Ltd",
    period: "Aug 2023 – Apr 2024",
    gradient: "from-accent-purple to-accent-cyan",
    description: [
      "Developed cross-platform mobile applications",
      "Integrated third-party APIs and services",
      "Improved performance and code quality",
    ],
  },
  {
    role: "Jr. Web Developer",
    company: "Softpro India Computer Technologies",
    period: "Jul 2022 – Aug 2023",
    gradient: "from-accent-cyan to-green-500",
    description: [
      "Built web apps using HTML, CSS, JavaScript, React.js",
      "Worked with Git version control",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-accent-blue/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-accent-purple/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "2s" }} />
      <div className="max-width relative z-10">

        <SectionHeading
          title="Work Experience"
          subtitle="My professional journey in software development"
          icon={<FiBriefcase />}
        />

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-blue via-accent-purple via-accent-cyan to-transparent" />

          <div className="space-y-10">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.role}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative pl-14"
              >
                <motion.div
                  className="absolute left-[14px] top-1 w-[18px] h-[18px] rounded-full bg-dark-950 border-2 flex items-center justify-center"
                  style={{ borderColor: idx === 0 ? "#3b82f6" : idx === 1 ? "#8b5cf6" : "#06b6d4" }}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(59,130,246,0.4)",
                      "0 0 0 6px rgba(59,130,246,0)",
                      "0 0 0 0 rgba(59,130,246,0)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2.5, delay: idx * 0.8 }}
                >
                  <div
                    className="w-[6px] h-[6px] rounded-full"
                    style={{ backgroundColor: idx === 0 ? "#3b82f6" : idx === 1 ? "#8b5cf6" : "#06b6d4" }}
                  />
                </motion.div>

                <motion.div
                  className="card glass-hover relative overflow-hidden"
                  whileHover={{ scale: 1.01, x: 4 }}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${exp.gradient}`} />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-white text-lg font-bold font-heading">
                        {exp.role}
                      </h3>
                      <p className={`text-sm font-medium bg-gradient-to-r ${exp.gradient} bg-clip-text text-transparent`}>
                        {exp.company}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-dark-400 text-xs font-mono whitespace-nowrap">
                      <FiCalendar className="text-accent-blue" size={10} />
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.description.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: idx * 0.15 + i * 0.05 }}
                        className="text-dark-300 text-sm flex items-start gap-3"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${idx === 0 ? "bg-accent-blue" : idx === 1 ? "bg-accent-purple" : "bg-accent-cyan"
                          }`} />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
