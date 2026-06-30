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
  return (
    <header className="sticky top-0 z-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMobileOpen}
            className="lg:hidden text-slate-400 hover:text-white p-1 -ml-1"
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
                <span style={{ color: sectionMeta[activeTab]?.color }}>
                  {sectionMeta[activeTab]?.icon}
                </span>
                {sectionMeta[activeTab]?.label || activeTab}
              </h1>
            </div>
            <p className="text-slate-600 text-[10px] sm:text-xs truncate">
              {sectionMeta[activeTab]?.desc || "Manage content"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab !== "overview" && (
            <button
              onClick={onSave}
              disabled={saving === activeTab}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-white shadow-lg transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0 shadow-indigo-500/15"
            >
              {saving === activeTab ? (
                <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving</>
              ) : (
                <><FiSave className="w-3.5 h-3.5" /> Save</>
              )}
            </button>
          )}
          <a
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/[0.06]"
          >
            <FiExternalLink className="w-3.5 h-3.5" />
            <span>Preview</span>
          </a>
        </div>
      </div>
    </header>
  );
}
