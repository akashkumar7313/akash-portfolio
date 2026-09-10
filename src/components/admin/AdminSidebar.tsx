"use client";

import { FiExternalLink, FiLogOut } from "react-icons/fi";
import { useState } from "react";

type SectionMeta = Record<string, { label: string; icon: React.ReactNode; color: string; desc: string }>;

export default function AdminSidebar({
  sectionMeta, activeTab, onTabChange, countFor, onLogout, mobileOpen, onMobileClose, user,
}: {
  sectionMeta: SectionMeta;
  activeTab: string;
  onTabChange: (t: string) => void;
  countFor: (s: string) => number;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  user?: { name?: string; email?: string; picture?: string } | null;
}) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-30 lg:hidden" onClick={onMobileClose} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 h-screen bg-[#101412]/95 backdrop-blur-xl border-r border-[#c9f36c]/10 flex flex-col transition-all duration-500 ease-out ${
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* Animated top glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#c9f36c]/5 to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[#c9f36c]/10 flex-shrink-0 relative">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] flex items-center justify-center text-[#101412] font-black text-xl shadow-lg shadow-[#c9f36c]/20" style={{ fontFamily: 'Poppins, sans-serif' }}>
              A
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#f4f7f2] font-semibold text-sm leading-tight truncate">Portfolio</p>
            <p className="text-[#91a096] text-[10px] leading-tight truncate">Admin Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {Object.entries(sectionMeta).map(([id, meta]) => {
            const isActive = activeTab === id;
            const isHovered = hoveredItem === id;
            const cnt = id !== "overview" ? countFor(id) : null;

            return (
              <button
                key={id}
                onClick={() => { onTabChange(id); onMobileClose(); }}
                onMouseEnter={() => setHoveredItem(id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? "text-[#f4f7f2]"
                    : "text-[#91a096] hover:text-[#f4f7f2]"
                }`}
              >
                {/* Active background */}
                {isActive && (
                  <div className="absolute inset-0 bg-[#c9f36c]/10 rounded-xl" />
                )}

                {/* Hover glow */}
                {isHovered && !isActive && (
                  <div className="absolute inset-0 bg-[#c9f36c]/5 rounded-xl" />
                )}

                {/* Active left indicator with glow */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2">
                    <div className="w-0.5 h-5 rounded-full shadow-lg" style={{ backgroundColor: meta.color, boxShadow: `0 0 12px ${meta.color}60` }} />
                  </div>
                )}

                {/* Icon with color */}
                <span className={`text-sm flex-shrink-0 relative z-10 transition-all duration-300 ${isActive ? "" : "opacity-60 group-hover:opacity-100"}`}
                  style={{ color: isActive ? meta.color : undefined }}>
                  {meta.icon}
                </span>

                {/* Label */}
                <span className="truncate flex-1 text-left relative z-10">{meta.label}</span>

                {/* Count badge */}
                {cnt !== null && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono relative z-10 transition-all duration-300 ${
                    isActive
                      ? "text-[#101412]"
                      : "bg-[#c9f36c]/5 text-[#91a096]"
                  }`}
                    style={isActive ? { backgroundColor: `${meta.color}20`, color: meta.color } : {}}>
                    {cnt}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-2.5 border-t border-[#c9f36c]/10 space-y-0.5 flex-shrink-0 relative">
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#c9f36c]/3 to-transparent pointer-events-none" />

          {/* User info */}
          {user && (
            <div className="flex items-center gap-3 px-3.5 py-2.5 mb-1">
              {user.picture ? (
                <img src={user.picture} alt={user.name || "Admin"} className="w-8 h-8 rounded-full ring-2 ring-[#c9f36c]/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] flex items-center justify-center text-[#101412] text-xs font-bold">
                  {user.name?.charAt(0) || "A"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[#f4f7f2] text-xs font-medium truncate">{user.name || "Admin"}</p>
                <p className="text-[#91a096] text-[10px] truncate">{user.email || ""}</p>
              </div>
            </div>
          )}

          <a
            href="/"
            target="_blank"
            className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm text-[#91a096] hover:text-[#f4f7f2] hover:bg-[#c9f36c]/5 transition-all duration-300 group"
          >
            <FiExternalLink className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
            <span>View Site</span>
          </a>
          <button
            onClick={onLogout}
            className="relative w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm text-red-400/50 hover:text-red-300 hover:bg-red-500/5 transition-all duration-300 group"
          >
            <FiLogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
