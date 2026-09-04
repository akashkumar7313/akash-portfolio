"use client";

import { FiMenu, FiSave, FiExternalLink } from "react-icons/fi";

export default function AdminHeader({
  sectionMeta, activeTab, saving, onSave, onMobileOpen,
}: {
  sectionMeta: Record<string, { label: string; icon: React.ReactNode; color: string; desc: string }>;
  activeTab: string;
  saving: string | null;
  onSave: () => void;
  onMobileOpen: () => void;
}) {
  const meta = sectionMeta[activeTab];

  return (
    <header className="sticky top-0 z-20 bg-[#06060b]/80 backdrop-blur-xl border-b border-white/[0.04]">
      {/* Animated gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMobileOpen}
            className="lg:hidden text-slate-400 hover:text-white p-1 -ml-1 transition-colors"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="text-slate-600 text-[10px] font-medium uppercase tracking-wider hidden sm:inline">
                Dashboard
              </span>
              <span className="text-slate-700 text-[10px] hidden sm:inline">/</span>
              <h1 className="text-white font-semibold text-sm sm:text-base truncate flex items-center gap-2">
                <span className="transition-colors duration-300" style={{ color: meta?.color }}>
                  {meta?.icon}
                </span>
                {meta?.label || activeTab}
              </h1>
            </div>
            <p className="text-slate-600 text-[10px] sm:text-xs truncate">
              {meta?.desc || "Manage content"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab !== "overview" && (
            <button
              onClick={onSave}
              disabled={saving === activeTab}
              className="relative px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0 group overflow-hidden"
            >
              {/* Animated gradient bg */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-[length:200%_100%] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_2s_linear_infinite]" />

              {/* Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <span className="relative z-10 flex items-center gap-1.5">
                {saving === activeTab ? (
                  <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving</>
                ) : (
                  <><FiSave className="w-3.5 h-3.5" /> Save</>
                )}
              </span>
            </button>
          )}
          <a
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-all duration-300 border border-transparent hover:border-white/[0.06] group"
          >
            <FiExternalLink className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
            <span>Preview</span>
          </a>
        </div>
      </div>
    </header>
  );
}
