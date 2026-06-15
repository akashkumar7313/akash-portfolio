"use client";

import { motion } from "framer-motion";
import { FiBookOpen, FiAward } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";

const education = [
  {
    degree: "Bachelor of Technology (CSE)",
    school: "Computer Science & Engineering",
    period: "Graduated",
  },
  {
    degree: "Diploma in Computer Science & Engineering",
    school: "Polytechnic",
    period: "Completed",
  },
];

const achievements = [
  "Best Developer of the Year",
  "Employee of the Month (Multiple Times)",
];

export default function Education() {
  return (
    <section id="education" className="section-padding bg-dark-900/50">
      <div className="max-width">
        <SectionHeading
          title="Education & Achievements"
          subtitle="Academic background and recognitions"
          icon={<FiBookOpen />}
        />

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-white font-bold text-lg flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center">
                <FiBookOpen className="text-accent-purple" />
              </span>
              Education
            </h3>
            {education.map((edu, i) => (
              <div key={i} className="card glass-hover">
                <h4 className="text-white font-semibold">{edu.degree}</h4>
                <p className="text-dark-400 text-sm mt-1">{edu.school}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple text-xs font-mono">
                  {edu.period}
                </span>
              </div>
            ))}
          </motion.div>

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
                className="card glass-hover flex items-center gap-4"
              >
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="text-white font-medium">{ach}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
