"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiSearch, FiZap } from "react-icons/fi";
import { PROCESS_DEFAULTS } from "@/lib/defaults";
import { resolveIcon } from "@/lib/iconMap";

export default function DeliveryPipeline() {
  const [active, setActive] = useState(0);
  const [foot, setFoot] = useState<{
    pipelineSteps?: { label: string; desc: string; icon: string }[];
    pipelineFootTitle?: string;
    pipelineFootDesc?: string;
  }>({});

  useEffect(() => {
    fetch("/api/process")
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d === "object" && !d.error) setFoot(d);
      })
      .catch(() => {});
  }, []);

  const steps = foot.pipelineSteps?.length ? foot.pipelineSteps : PROCESS_DEFAULTS.pipelineSteps;

  useEffect(() => {
    const timer = setInterval(() => setActive((prev) => (prev + 1) % steps.length), 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bento overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[#101412]/8 px-4 py-3 dark:border-[#c9f36c]/10">
        <FiZap className="text-xs text-[#16a34a] dark:text-[#c9f36c]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b7280] dark:text-[#91a096]">
          delivery_pipeline
        </span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          live
        </span>
      </div>

      <div className="space-y-1 p-3">
        {steps.map((step, i) => {
          const isActive = i === active;
          const isDone = i < active;
          const Icon = resolveIcon(step.icon, FiSearch);
          return (
            <div
              key={step.label}
              className={`flex items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-all duration-500 ${
                isActive
                  ? "border-[#c9f36c]/40 bg-[#c9f36c]/[0.10]"
                  : "border-transparent"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[11px] transition-colors ${
                  isActive
                    ? "border-[#c9f36c]/50 bg-[#c9f36c] text-[#101412]"
                    : isDone
                      ? "border-[#c9f36c]/25 bg-[#c9f36c]/10 text-[#16a34a] dark:text-[#c9f36c]"
                      : "border-[#101412]/10 bg-white/40 text-[#6b7280] dark:border-[#c9f36c]/10 dark:bg-white/[0.03] dark:text-[#6b7a70]"
                }`}
              >
                {isDone ? <FiCheck /> : <Icon />}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-[11px] font-semibold ${isActive ? "text-[#101412] dark:text-[#f4f7f2]" : "text-[#374151] dark:text-[#cbd5ce]"}`}>
                  {step.label}
                </p>
                <p className="truncate text-[9px] text-[#6b7280] dark:text-[#6b7a70]">{step.desc}</p>
              </div>
              <span
                className={`font-mono text-[8px] uppercase tracking-wider ${
                  isActive
                    ? "text-[#16a34a] dark:text-[#c9f36c]"
                    : isDone
                      ? "text-[#6b7280] dark:text-[#6b7a70]"
                      : "text-[#9ca3af] dark:text-[#4a5a50]"
                }`}
              >
                {isActive ? "running" : isDone ? "done" : "queued"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-[#101412]/8 px-4 py-3 dark:border-[#c9f36c]/10">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold text-[#101412] dark:text-[#f4f7f2]">
            {foot.pipelineFootTitle || PROCESS_DEFAULTS.pipelineFootTitle}
          </p>
          <p className="mt-0.5 text-[9px] text-[#6b7280] dark:text-[#91a096]">
            {foot.pipelineFootDesc || PROCESS_DEFAULTS.pipelineFootDesc}
          </p>
        </div>
        <span className="ml-3 font-mono text-[10px] text-[#16a34a] dark:text-[#c9f36c]">
          {Math.round(((active + 1) / steps.length) * 100)}%
        </span>
      </div>

      <div className="h-1 w-full bg-[#101412]/5 dark:bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-[#16a34a] to-[#c9f36c] transition-all duration-700"
          style={{ width: `${((active + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
