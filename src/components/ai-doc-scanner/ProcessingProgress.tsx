"use client";

import { FiCheck, FiLoader } from "react-icons/fi";
import type { ProcessingState } from "@/features/ai-doc-scanner/types";

const STEPS = [
  { key: "reading", label: "Reading file" },
  { key: "rendering", label: "Rendering pages" },
  { key: "ocr", label: "Detecting text" },
  { key: "layout", label: "Detecting layout" },
  { key: "building", label: "Building editable document" },
] as const;

export default function ProcessingProgress({ state }: { state: ProcessingState }) {
  const currentIdx = STEPS.findIndex((s) => s.key === state.status);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#c9f36c]/10 flex items-center justify-center">
          <FiLoader className="w-8 h-8 text-[#c9f36c] animate-spin" />
        </div>
        <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-2">
          Processing Document
        </h3>
        <p className="text-sm opacity-50 mb-8">{state.message}</p>

        <div className="space-y-3 text-left mb-8">
          {STEPS.map((step, i) => {
            const done = i < currentIdx;
            const active = step.key === state.status;
            return (
              <div key={step.key} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    done
                      ? "bg-[#c9f36c] text-[#101412]"
                      : active
                      ? "bg-[#c9f36c]/20 text-[#c9f36c]"
                      : "bg-white/5 text-white/20"
                  }`}
                >
                  {done ? (
                    <FiCheck className="w-3.5 h-3.5" />
                  ) : active ? (
                    <FiLoader className="w-3 h-3 animate-spin" />
                  ) : (
                    <span className="text-[10px]">{i + 1}</span>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    done
                      ? "text-[var(--text-primary)]"
                      : active
                      ? "text-[var(--text-primary)] font-medium"
                      : "opacity-30"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#c9f36c] to-[#a8d94a] rounded-full transition-all duration-300"
            style={{ width: `${state.progress}%` }}
          />
        </div>
        <p className="text-xs opacity-30 mt-2">{state.progress}%</p>
      </div>
    </div>
  );
}
