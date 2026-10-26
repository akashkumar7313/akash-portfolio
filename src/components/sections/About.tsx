"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiAward,
  FiCode,
  FiMapPin,
  FiServer,
  FiSmartphone,
  FiUser,
  FiZap,
} from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";

interface AboutData {
  paragraphs: string[];
  highlights: { icon: string; title: string; desc: string; iconColor: string }[];
  achievements: { icon: string; text: string }[];
  currentlyLabel?: string;
  currently?: string;
  focus?: string;
  frameworks?: string;
  backend?: string;
  database?: string;
  cloud?: string;
  experience?: string;
  devBadge?: string;
}

const iconMap: Record<string, React.ElementType> = {
  FiSmartphone,
  FiServer,
  FiCode,
  FiUser,
  FiAward,
};

export default function About() {
  const [data, setData] = useState<AboutData | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
    fetch("/api/hero")
      .then((r) => r.json())
      .then((d) => setPhotoUrl(d?.photoUrl || ""))
      .catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
      <div className="relative z-10 mx-auto max-w-6xl px-1 sm:px-0">
        <SectionHeading
          title="About Me"
          kicker="About"
          subtitle="A software engineer who cares about the details — from architecture to the last animation frame."
          icon={<FiUser />}
        />

        <div className="bento-grid">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 md:mr-[30px]"
          >
            <TiltCard intensity={4} glow="201 243 108" className="h-full rounded-[26px]">
              <div className="bento bento-pad relative h-full min-h-[calc(100%+30px)] overflow-hidden">
                <span className="bento-label">The short version</span>
                <div className="relative mt-4 space-y-4">
                  {data.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className={`leading-relaxed ${
                        i === 0
                          ? "text-base font-medium text-[#101412] dark:text-[#f4f7f2] sm:text-lg"
                          : "text-sm text-[#6b7280] dark:text-[#91a096]"
                      }`}
                    >
                      {p}
                    </p>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="bento-chip"><FiMapPin /> Lucknow, India</span>
                  <span className="bento-chip"><FiZap /> Product-minded</span>
                  <span className="bento-chip"><FiCode /> Clean architecture</span>
                </div>
                <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-14 h-52 w-52 rounded-full bg-[#c9f36c]/10 blur-[70px]" />
              </div>
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="md:col-span-5 md:w-[calc(100%+30px)]"
          >
            <TiltCard intensity={6} glow="168 217 74" className="h-full rounded-[26px]">
              <div className="bento relative h-full overflow-hidden p-6 sm:p-7">
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(201,243,108,0.14),transparent_55%)]" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <span className="bento-label">{data.currentlyLabel || "Currently"}</span>
                    <p className="mt-2 max-w-[14rem] text-lg font-semibold leading-snug text-[#101412] dark:text-[#f4f7f2]">
                      {data.currently || "Building mobile apps and web products end to end."}
                    </p>
                  </div>
                  <div className="relative h-16 w-16 shrink-0">
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] text-2xl font-black text-[#101412] shadow-xl shadow-[#c9f36c]/20">
                      {photoUrl ? (
                        <img src={photoUrl} alt="Developer" className="h-full w-full object-cover" />
                      ) : (
                        "A"
                      )}
                    </div>
                    <span className="absolute -bottom-2 -right-2 rounded-full border border-[#101412] bg-[#101412] px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[#c9f36c]">
                      {data.devBadge || "dev"}
                    </span>
                  </div>
                </div>

                <div className="relative mt-7 space-y-3">
                  {[
                    { k: "Focus", v: data.focus || "Mobile + Web" },
                    { k: "Frameworks & Libraries", v: data.frameworks || "Flutter · React Native · React.js · Next.js" },
                    { k: "Backend & APIs", v: data.backend || "Laravel · Node.js · REST APIs · WebSockets" },
                    { k: "Database", v: data.database || "Firestore · MySQL · SQLite · PostgreSQL · MongoDB" },
                    { k: "Cloud & Services", v: data.cloud || "Firebase Authentication · FCM · Cloud Functions · Analytics · Crashlytics" },
                    { k: "Experience", v: data.experience || "4+ Years Building & Shipping" },
                  ].map((row) => (
                    <div key={row.k} className="flex items-center justify-between gap-3 border-b border-[#101412]/5 pb-2.5 text-xs last:border-0 dark:border-[#c9f36c]/8">
                      <span className="font-mono uppercase tracking-wider text-[#6b7280] dark:text-[#91a096]">{row.k}</span>
                      <span className="text-right font-medium text-[#101412] dark:text-[#f4f7f2]">{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {data.highlights.map((item, i) => {
            const Icon = iconMap[item.icon] || FiCode;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.05 + i * 0.06 }}
                className="md:col-span-4"
              >
                <TiltCard intensity={6} glow="201 243 108" className="h-full rounded-[26px]">
                  <div className="bento bento-hover h-full p-5 sm:p-6">
                    <div className="bento-icon">
                      <Icon className="text-lg" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-[#101412] dark:text-[#f4f7f2]">{item.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#6b7280] dark:text-[#91a096]">{item.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="md:col-span-12"
          >
            <div className="bento p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FiAward className="text-[#16a34a] dark:text-[#c9f36c]" />
                  <h3 className="text-sm font-semibold text-[#101412] dark:text-[#f4f7f2]">Key achievements</h3>
                </div>
                <span className="bento-label hidden sm:block">Recognition</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {data.achievements.map((item, i) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                    className="flex items-center gap-3 rounded-2xl border border-[#101412]/8 bg-[#101412]/[0.02] p-4 transition-colors hover:border-[#c9f36c]/40 hover:bg-[#c9f36c]/5 dark:border-[#c9f36c]/10 dark:bg-white/[0.02]"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-xs leading-relaxed text-[#4b5563] dark:text-[#c5cdc8]">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
