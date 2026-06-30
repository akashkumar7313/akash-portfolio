"use client";

import { FiExternalLink, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useState } from "react";

type SectionMeta = Record<string, { label: string; icon: React.ReactNode; color: string; desc: string }>;

export default function AdminSidebar({
  sectionMeta, activeTab, onTabChange, countFor, onLogout, mobileOpen, onMobileClose,
}: {
  sectionMeta: SectionMeta;
  activeTab: string;
  onTabChange: (t: string) => void;
  countFor: (s: string) => number;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={onMobileClose} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 h-screen bg-[#0c0c12] border-r border-white/[0.04] flex flex-col transition-all duration-300 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/[0.04] flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/20">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight truncate">Portfolio</p>
            <p className="text-slate-600 text-[10px] leading-tight truncate">Admin Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {Object.entries(sectionMeta).map(([id, meta]) => {
            const isActive = activeTab === id;
            const cnt = id !== "overview" ? countFor(id) : null;
            return (
              <button
                key={id}
                onClick={() => { onTabChange(id); onMobileClose(); }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "bg-white/[0.06] text-white"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/40" />
                )}
                <span className={`text-sm flex-shrink-0 transition-opacity ${isActive ? "" : "opacity-60 group-hover:opacity-100"}`}>
                  {meta.icon}
                </span>
                <span className="truncate flex-1 text-left">{meta.label}</span>
                {cnt !== null && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "bg-white/[0.03] text-slate-600"
                  }`}>
                    {cnt}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-2.5 border-t border-white/[0.04] space-y-0.5 flex-shrink-0">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-all"
          >
            <FiExternalLink className="w-4 h-4" />
            <span>View Site</span>
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm text-red-400/50 hover:text-red-300 hover:bg-red-500/5 transition-all"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
