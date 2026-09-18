"use client";

import { FiCheck, FiLoader } from "react-icons/fi";
import type { ProcessingState } from "@/features/ai-doc-scanner/types";

const STEPS = [
  { key: "reading", label: "Reading file" },
  { key: "rendering", label: "Rendering pages" },
  { key: "ocr", label: "Detecting text" },
  { key: "building", label: "Building document" },
] as const;

export default function ProcessingProgress({ state }: { state: ProcessingState }) {
  const currentIdx = STEPS.findIndex((s) => s.key === state.status);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8">
      <div className="w-full max-w-sm text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[#c9f36c]/10 flex items-center justify-center">
          <FiLoader className="w-7 h-7 text-[#c9f36c] animate-spin" />
        </div>
        <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-1">Processing</h3>
        <p className="text-sm text-white/40 mb-8">{state.message}</p>

        <div className="space-y-2.5 text-left mb-8">
          {STEPS.map((step, i) => {
            const done = i < currentIdx;
            const active = step.key === state.status;
            return (
              <div key={step.key} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  done ? "bg-[#c9f36c] text-[#101412]"
                  : active ? "bg-[#c9f36c]/15 text-[#c9f36c]"
                  : "bg-white/5 text-white/15"
                }`}>
                  {done ? <FiCheck className="w-3.5 h-3.5" />
                  : active ? <FiLoader className="w-3 h-3 animate-spin" />
                  : <span className="text-[10px]">{i + 1}</span>}
                </div>
                <span className={`text-sm ${
                  done ? "text-[var(--text-primary)]"
                  : active ? "text-[var(--text-primary)] font-medium"
                  : "text-white/20"
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-[#c9f36c] rounded-full transition-all duration-300"
            style={{ width: `${state.progress}%` }}
          />
        </div>
        <p className="text-[11px] text-white/20 mt-2">{state.progress}%</p>
      </div>
    </div>
  );
}
