"use client";

import { FiFolder, FiTool, FiBriefcase, FiMessageSquare, FiBook, FiBarChart2, FiLink, FiGrid, FiArrowUpRight } from "react-icons/fi";

interface SectionMeta {
  label: string; icon: React.ReactNode; color: string; desc: string;
}

export default function OverviewDashboard({ data, sectionMeta, onNavigate }: {
  data: Record<string, unknown>;
  sectionMeta: Record<string, SectionMeta>;
  onNavigate: (t: string) => void;
}) {
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
    { label: "Projects", count: getCount("projects"), icon: <FiFolder />, color: "#ec4899", section: "projects" },
    { label: "Skills", count: getCount("skills"), icon: <FiTool />, color: "#f59e0b", section: "skills" },
    { label: "Experience", count: getCount("experience"), icon: <FiBriefcase />, color: "#8b5cf6", section: "experience" },
    { label: "Testimonials", count: getCount("testimonials"), icon: <FiMessageSquare />, color: "#d97706", section: "testimonials" },
    { label: "Education", count: getCount("education"), icon: <FiBook />, color: "#06b6d4", section: "education" },
    { label: "Stats", count: getCount("stats"), icon: <FiBarChart2 />, color: "#84cc16", section: "stats" },
    { label: "Links", count: getCount("socialLinks"), icon: <FiLink />, color: "#f43f5e", section: "socialLinks" },
    { label: "Sections", count: Object.keys(sectionMeta).length - 1, icon: <FiGrid />, color: "#6366f1", section: "hero" },
  ];

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-white/[0.05]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-lg font-semibold">Welcome to Admin Dashboard</h2>
            <p className="text-slate-500 text-sm mt-1">Manage your portfolio content from one place</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />All systems operational
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <button key={card.label} onClick={() => onNavigate(card.section)}
            className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.08] hover:bg-white/[0.03] transition-all text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center text-lg" style={{ color: card.color }}>
                {card.icon}
              </div>
              <FiArrowUpRight className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{card.count}</p>
            <p className="text-slate-500 text-xs">{card.label}</p>
          </button>
        ))}
      </div>

      <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <h3 className="text-white text-sm font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {["hero", "projects", "skills", "socialLinks"].map((s) => (
            <button key={s} onClick={() => onNavigate(s)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all text-left"
            >
              <span style={{ color: sectionMeta[s]?.color }}>{sectionMeta[s]?.icon}</span>
              <div>
                <p className="text-slate-300 text-sm font-medium">{sectionMeta[s]?.label}</p>
                <p className="text-slate-600 text-[10px]">{sectionMeta[s]?.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {(() => {
        const settings = data.settings as Record<string, unknown> | undefined;
        return settings ? (
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <h3 className="text-white text-sm font-semibold mb-4">Site Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-slate-600 text-[10px] font-medium uppercase tracking-wider mb-1">Title</p>
                <p className="text-slate-300 text-sm font-medium truncate">{String(settings.title ?? "—")}</p>
              </div>
              <div className="px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-slate-600 text-[10px] font-medium uppercase tracking-wider mb-1">Description</p>
                <p className="text-slate-300 text-sm truncate">{String(settings.description ?? "—")}</p>
              </div>
              <div className="px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-slate-600 text-[10px] font-medium uppercase tracking-wider mb-1">Keywords</p>
                <p className="text-slate-300 text-sm truncate">{(settings.keywords as string[] || []).join(", ") || "—"}</p>
              </div>
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
}
