"use client";

import { motion } from "framer-motion";
import { FiBriefcase } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";

const experiences = [
  {
    role: "Software Engineer",
    company: "Singsys Software Services Pvt Ltd",
    period: "Apr 2024 – Present",
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
    description: [
      "Built web apps using HTML, CSS, JavaScript, React.js",
      "Worked with Git version control",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section-padding">
      <div className="max-width">
        <SectionHeading
          title="Work Experience"
          subtitle="My professional journey in software development"
          icon={<FiBriefcase />}
        />

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-blue via-accent-purple to-transparent" />

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
                <div className="absolute left-[14px] top-1 w-[18px] h-[18px] rounded-full bg-dark-950 border-2 border-accent-blue flex items-center justify-center">
                  <div className="w-[6px] h-[6px] rounded-full bg-accent-blue" />
                </div>

                <div className="card glass-hover">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-white text-lg font-bold">
                        {exp.role}
                      </h3>
                      <p className="text-accent-blue text-sm font-medium">
                        {exp.company}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-dark-400 text-xs font-mono whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.description.map((item, i) => (
                      <li
                        key={i}
                        className="text-dark-300 text-sm flex items-start gap-3"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-blue/60 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
