"use client";

import { useState, useEffect } from "react";
import { FiFolder, FiTool, FiBriefcase, FiMessageSquare, FiBook, FiBarChart2, FiLink, FiGrid, FiArrowUpRight, FiZap } from "react-icons/fi";

interface SectionMeta {
  label: string; icon: React.ReactNode; color: string; desc: string;
}

function AnimatedCard({ card, index, onNavigate }: { card: any; index: number; onNavigate: (s: string) => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <button
      onClick={() => onNavigate(card.section)}
      className={`group p-5 rounded-2xl border border-[#c9f36c]/5 hover:border-[#c9f36c]/15 transition-all duration-500 text-left relative overflow-hidden bg-[#151b17]/50 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Hover gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${card.color}08, ${card.color}03)` }} />

      {/* Glow on hover */}
      <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ background: `linear-gradient(135deg, ${card.color}15, transparent)` }} />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            style={{ background: `linear-gradient(135deg, ${card.color}15, ${card.color}08)`, color: card.color }}>
            {card.icon}
          </div>
          <FiArrowUpRight className="w-4 h-4 text-[#91a096] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
        </div>

        <p className="text-3xl font-black text-[#f4f7f2] mb-1 tabular-nums">{card.count}</p>
        <p className="text-[#91a096] text-xs font-medium">{card.label}</p>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${card.color}40, transparent)` }} />
      </div>
    </button>
  );
}

export default function OverviewDashboard({ data, sectionMeta, onNavigate }: {
  data: Record<string, unknown>;
  sectionMeta: Record<string, SectionMeta>;
  onNavigate: (t: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getCount = (section: string): number => {
    const s = data[section] as Record<string, unknown> | undefined;
    if (!s) return 0;
    if (section === "hero") return 1;
    if (section === "about") return (s.paragraphs as unknown[])?.length || 0;
    if (section === "skills") return (s.categories as unknown[])?.length || 0;
    if (section === "experience") return (s.experiences as unknown[])?.length || 0;
    if (section === "education") {
      const e = (s.education as unknown[])?.length || 0;
      const a = (s.achievements as unknown[])?.length || 0;
      return e + a;
    }
    if (section === "projects") return (s.projects as unknown[])?.length || 0;
    if (section === "testimonials") return (s.testimonials as unknown[])?.length || 0;
    if (section === "stats") return (s.stats as unknown[])?.length || 0;
    if (section === "contact") return 4;
    if (section === "settings") return 1;
    if (section === "socialLinks") return (s as unknown as unknown[])?.length || 0;
    return 0;
  };

  const cards = [
    { label: "Projects", count: getCount("projects"), icon: <FiFolder />, color: "#c9f36c", section: "projects" },
    { label: "Skills", count: getCount("skills"), icon: <FiTool />, color: "#a8d94a", section: "skills" },
    { label: "Experience", count: getCount("experience"), icon: <FiBriefcase />, color: "#c9f36c", section: "experience" },
    { label: "Testimonials", count: getCount("testimonials"), icon: <FiMessageSquare />, color: "#a8d94a", section: "testimonials" },
    { label: "Education", count: getCount("education"), icon: <FiBook />, color: "#c9f36c", section: "education" },
    { label: "Stats", count: getCount("stats"), icon: <FiBarChart2 />, color: "#a8d94a", section: "stats" },
    { label: "Links", count: getCount("socialLinks"), icon: <FiLink />, color: "#c9f36c", section: "socialLinks" },
    { label: "Sections", count: Object.keys(sectionMeta).length - 1, icon: <FiGrid />, color: "#a8d94a", section: "hero" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className={`relative p-6 rounded-2xl border border-[#c9f36c]/10 overflow-hidden transition-all duration-700 bg-[#151b17]/50 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {/* Animated gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#c9f36c]/5 via-[#a8d94a]/5 to-[#c9f36c]/5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9f36c]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#a8d94a]/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-[#f4f7f2] text-xl font-bold flex items-center gap-2">
              <FiZap className="text-[#c9f36c]" />
              Welcome to Admin Dashboard
            </h2>
            <p className="text-[#91a096] text-sm mt-1.5">Manage your portfolio content from one place</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#91a096] bg-[#c9f36c]/5 px-4 py-2 rounded-xl border border-[#c9f36c]/10">
            <span className="w-2 h-2 rounded-full bg-[#c9f36c] animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <AnimatedCard key={card.label} card={card} index={idx} onNavigate={onNavigate} />
        ))}
      </div>

      {/* Quick actions */}
      <div className={`relative p-5 rounded-2xl bg-[#151b17]/50 border border-[#c9f36c]/10 transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <h3 className="text-[#f4f7f2] text-sm font-semibold mb-4 flex items-center gap-2">
          <FiZap className="text-[#c9f36c] w-4 h-4" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {["hero", "projects", "skills", "socialLinks"].map((s, idx) => (
            <button key={s} onClick={() => onNavigate(s)}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#c9f36c]/5 border border-[#c9f36c]/10 hover:bg-[#c9f36c]/10 hover:border-[#c9f36c]/20 transition-all duration-300 text-left group relative overflow-hidden">
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${sectionMeta[s]?.color}08, transparent)` }} />

              <span className="relative text-lg transition-transform duration-300 group-hover:scale-110" style={{ color: sectionMeta[s]?.color }}>
                {sectionMeta[s]?.icon}
              </span>
              <div className="relative">
                <p className="text-[#f4f7f2] text-sm font-medium">{sectionMeta[s]?.label}</p>
                <p className="text-[#91a096] text-[10px]">{sectionMeta[s]?.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Site info */}
      {(() => {
        const settings = data.settings as Record<string, unknown> | undefined;
        return settings ? (
          <div className={`relative p-5 rounded-2xl bg-[#151b17]/50 border border-[#c9f36c]/10 transition-all duration-700 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h3 className="text-[#f4f7f2] text-sm font-semibold mb-4">Site Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="px-4 py-3.5 rounded-xl bg-[#c9f36c]/5 border border-[#c9f36c]/10 hover:border-[#c9f36c]/20 transition-colors duration-300">
                <p className="text-[#91a096] text-[10px] font-medium uppercase tracking-wider mb-1">Title</p>
                <p className="text-[#f4f7f2] text-sm font-medium truncate">{String(settings.title ?? "—")}</p>
              </div>
              <div className="px-4 py-3.5 rounded-xl bg-[#c9f36c]/5 border border-[#c9f36c]/10 hover:border-[#c9f36c]/20 transition-colors duration-300">
                <p className="text-[#91a096] text-[10px] font-medium uppercase tracking-wider mb-1">Description</p>
                <p className="text-[#f4f7f2] text-sm truncate">{String(settings.description ?? "—")}</p>
              </div>
              <div className="px-4 py-3.5 rounded-xl bg-[#c9f36c]/5 border border-[#c9f36c]/10 hover:border-[#c9f36c]/20 transition-colors duration-300">
                <p className="text-[#91a096] text-[10px] font-medium uppercase tracking-wider mb-1">Keywords</p>
                <p className="text-[#f4f7f2] text-sm truncate">{(settings.keywords as string[] || []).join(", ") || "—"}</p>
              </div>
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
}
