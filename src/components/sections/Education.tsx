"use client";

import { motion } from "framer-motion";
import { FiBookOpen, FiAward, FiStar } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";

const education = [
  {
    degree: "Bachelor of Technology (CSE)",
    school: "Computer Science & Engineering",
    period: "Graduated",
    icon: "🎓",
    gradient: "from-accent-purple/20 to-accent-blue/20",
    accent: "accent-purple",
  },
  {
    degree: "Diploma in Computer Science & Engineering",
    school: "Polytechnic",
    period: "Completed",
    icon: "📘",
    gradient: "from-accent-cyan/20 to-accent-purple/20",
    accent: "accent-cyan",
  },
];

const achievements = [
  { icon: "🏆", text: "Best Developer of the Year", gradient: "from-yellow-500/20 to-yellow-500/5", accent: "text-yellow-400" },
  { icon: "⭐", text: "Employee of the Month (Multiple Times)", gradient: "from-accent-blue/20 to-accent-blue/5", accent: "text-accent-blue" },
];

export default function Education() {
  return (
    <section id="education" className="section-padding bg-dark-900/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />
      <div className="max-width relative z-10">

        <SectionHeading
          title="Education & Achievements"
          subtitle="Academic background and recognitions"
          icon={<FiBookOpen />}
        />

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-white font-bold text-lg flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center">
                <FiBookOpen className="text-accent-blue" />
              </span>
              Education
            </h3>
            {education.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card glass-hover relative overflow-hidden group"
                whileHover={{ scale: 1.02, x: 4 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${edu.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10 flex items-start gap-4">
                  <motion.span
                    className="text-2xl"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.5 }}
                  >
                    {edu.icon}
                  </motion.span>
                  <div>
                    <h4 className="text-white font-semibold font-heading">{edu.degree}</h4>
                    <p className="text-dark-400 text-sm mt-1">{edu.school}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full bg-${edu.accent}/10 text-${edu.accent} text-xs font-mono`}>
                      {edu.period}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-white font-bold text-lg flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <FiAward className="text-yellow-500" />
              </span>
              Achievements
            </h3>
            {achievements.map((ach, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="card glass-hover relative overflow-hidden group"
                whileHover={{ scale: 1.02, x: -4 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${ach.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10 flex items-center gap-4">
                  <motion.span
                    className="text-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                  >
                    {ach.icon}
                  </motion.span>
                  <div>
                    <p className="text-white font-medium">{ach.text}</p>
                    <p className="text-dark-500 text-xs mt-0.5 flex items-center gap-1">
                      <FiStar className={ach.accent} size={10} />
                      Recognized achievement
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
