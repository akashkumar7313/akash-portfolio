"use client";

import { useEffect, useState } from "react";
import { MARQUEE_DEFAULTS } from "@/lib/defaults";

export default function TechMarquee() {
  const [tools, setTools] = useState<string[]>(MARQUEE_DEFAULTS.tools);

  useEffect(() => {
    fetch("/api/marquee")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.tools) && d.tools.length) setTools(d.tools);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="relative overflow-hidden border-y border-[#101412]/[0.06] bg-white/[0.35] py-3 backdrop-blur dark:border-[#c9f36c]/[0.08] dark:bg-white/[0.015]">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent dark:from-[#101412]" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent dark:from-[#101412]" />
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 items-center gap-7 pr-7" aria-hidden={group === 1}>
            {tools.map((tool) => (
              <span key={tool} className="flex items-center gap-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b7280] dark:text-[#91a096]">
                <span className="h-1 w-1 rounded-full bg-[#c9f36c]" />
                {tool}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
