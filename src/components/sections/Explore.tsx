"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiUser } from "react-icons/fi";
import TiltCard from "@/components/ui/TiltCard";
import { EXPLORE_DEFAULTS } from "@/lib/defaults";
import { resolveIcon } from "@/lib/iconMap";

interface ExplorePage {
  title: string;
  desc: string;
  href: string;
  icon: string;
  n: string;
}

export default function Explore() {
  const [content, setContent] = useState(EXPLORE_DEFAULTS);

  useEffect(() => {
    fetch("/api/explore")
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d === "object" && !d.error) {
          setContent({ ...EXPLORE_DEFAULTS, ...d });
        }
      })
      .catch(() => {});
  }, []);

  const pages: ExplorePage[] = Array.isArray(content.pages) ? content.pages : EXPLORE_DEFAULTS.pages;

  return (
    <section className="relative overflow-hidden px-4 pb-16 sm:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 page-glow" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="bento-label">{content.label}</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#101412] dark:text-[#f4f7f2] sm:text-3xl">
              {content.title}
            </h2>
          </div>
          <Link href={content.linkHref || "/projects"} className="group inline-flex items-center gap-1.5 rounded-full border border-[#101412]/10 bg-white/50 px-4 py-2 text-xs font-semibold text-[#4b5563] transition-colors hover:border-[#c9f36c]/50 hover:text-[#16a34a] dark:border-[#c9f36c]/[0.12] dark:bg-white/[0.03] dark:text-[#91a096] dark:hover:text-[#c9f36c]">
            {content.linkText} <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="bento-grid">
          {pages.map((page, i) => {
            const Icon = resolveIcon(page.icon, FiUser);
            return (
              <motion.div
                key={`${page.title}-${i}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="md:col-span-4"
              >
                <TiltCard intensity={5} glow="201 243 108" className="h-full rounded-[26px]">
                  <Link href={page.href} className="bento bento-hover group flex h-full flex-col p-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      <span className="bento-icon"><Icon /></span>
                      <span className="font-mono text-[10px] text-[#6b7280] dark:text-[#91a096]">{page.n}</span>
                    </div>
                    <h3 className="mt-5 text-base font-semibold text-[#101412] transition-colors group-hover:text-[#16a34a] dark:text-[#f4f7f2] dark:group-hover:text-[#c9f36c]">
                      {page.title}
                    </h3>
                    <p className="mt-1.5 flex-1 text-xs leading-relaxed text-[#6b7280] dark:text-[#91a096]">{page.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#16a34a] opacity-0 transition-opacity group-hover:opacity-100 dark:text-[#c9f36c]">
                      Open <FiArrowUpRight />
                    </span>
                  </Link>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
