"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FiGrid, FiUser, FiTool, FiBriefcase, FiBook, FiFolder, FiMessageSquare,
  FiBarChart2, FiMail, FiSettings, FiLink, FiStar, FiAward, FiCode,
} from "react-icons/fi";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import OverviewDashboard from "@/components/admin/OverviewDashboard";
import EditorShell from "@/components/admin/EditorShell";
import { ToastItem, ConfirmDlg } from "@/components/admin/ModalComponents";

type SectionKey = string;
interface SiteData { [key: string]: unknown; }

const sectionMeta: Record<string, { label: string; icon: React.ReactNode; color: string; desc: string }> = {
  overview:    { label: "Overview",    icon: <FiGrid />,         color: "#6366f1", desc: "Dashboard analytics" },
  hero:        { label: "Hero",        icon: <FiStar />,         color: "#6366f1", desc: "Hero section content" },
  about:       { label: "About",       icon: <FiUser />,         color: "#10b981", desc: "About section content" },
  skills:      { label: "Skills",      icon: <FiTool />,         color: "#f59e0b", desc: "Skills & categories" },
  experience:  { label: "Experience",  icon: <FiBriefcase />,    color: "#8b5cf6", desc: "Work experience" },
  education:   { label: "Education",   icon: <FiBook />,         color: "#06b6d4", desc: "Education & achievements" },
  projects:    { label: "Projects",    icon: <FiFolder />,       color: "#ec4899", desc: "Portfolio projects" },
  testimonials:{ label:"Testimonials", icon: <FiMessageSquare />,color: "#d97706", desc: "Client testimonials" },
  stats:       { label: "Stats",       icon: <FiBarChart2 />,    color: "#84cc16", desc: "Statistics" },
  contact:     { label: "Contact",     icon: <FiMail />,         color: "#0ea5e9", desc: "Contact information" },
  settings:    { label: "Settings",    icon: <FiSettings />,     color: "#64748b", desc: "Site configuration" },
  socialLinks: { label: "Social Links",icon: <FiLink />,         color: "#f43f5e", desc: "Social media links" },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState<SiteData | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error"; id: number } | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    fetch("/api/admin/data")
      .then((r) => {
        if (r.status === 401) { router.push("/admin/login"); return null; }
        return r.json();
      })
      .then((d) => { if (d) setData(d); })
      .catch(() => router.push("/admin/login"));
  }, [router]);

  const showToast = useCallback((msg: string, type: "success" | "error") => {
    const id = Date.now();
    setToast({ msg, type, id });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 3500);
  }, []);

  const updateField = useCallback((section: SectionKey, path: string[], value: unknown) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev));
      let obj = next[section];
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
  }, []);

  const saveSection = useCallback(async (section: SectionKey) => {
    if (!data || section === "overview") return;
    setSaving(section);
    try {
      const res = await fetch("/api/admin/data", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: data[section] }),
      });
      if (res.ok) showToast(`${sectionMeta[section]?.label || section} saved successfully`, "success");
      else showToast("Failed to save — server error", "error");
    } catch {
      showToast("Network error — check your connection", "error");
    } finally {
      setSaving(null);
    }
  }, [data, showToast]);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) { const d = await res.json(); setData(d); }
    } catch { /* ignore */ }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const countFor = (section: string): number => {
    if (!data) return 0;
    const s = data[section] as Record<string, unknown> | undefined;
    if (!s) return 0;
    if (section === "hero") return 1;
    if (section === "about") return (s.paragraphs as unknown[])?.length || 0;
    if (section === "skills") return (s.categories as unknown[])?.length || 0;
    if (section === "experience") return (s.experiences as unknown[])?.length || 0;
    if (section === "education") { const e = (s.education as unknown[])?.length || 0; const a = (s.achievements as unknown[])?.length || 0; return e + a; }
    if (section === "projects") return (s.projects as unknown[])?.length || 0;
    if (section === "testimonials") return (s.testimonials as unknown[])?.length || 0;
    if (section === "stats") return (s.stats as unknown[])?.length || 0;
    if (section === "contact") return 4;
    if (section === "settings") return 1;
    if (section === "socialLinks") return (s as unknown as unknown[])?.length || 0;
    return 0;
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0f] flex">
      <AdminSidebar
        sectionMeta={sectionMeta}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        countFor={countFor}
        onLogout={() => setConfirmLogout(true)}
        mobileOpen={mobileMenu}
        onMobileClose={() => setMobileMenu(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminHeader
          sectionMeta={sectionMeta}
          activeTab={activeTab}
          saving={saving}
          onSave={() => saveSection(activeTab)}
          onMobileOpen={() => setMobileMenu(true)}
        />

        <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === "overview" ? (
              <OverviewDashboard data={data} sectionMeta={sectionMeta} onNavigate={setActiveTab} />
            ) : (
              <>
                <div className="mb-6 p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${sectionMeta[activeTab]?.color}20, ${sectionMeta[activeTab]?.color}08)` }}>
                        <span style={{ color: sectionMeta[activeTab]?.color }}>{sectionMeta[activeTab]?.icon}</span>
                      </div>
                      <div>
                        <h2 className="text-white text-base font-semibold">{sectionMeta[activeTab]?.label || activeTab}</h2>
                        <p className="text-slate-600 text-xs mt-0.5">{sectionMeta[activeTab]?.desc}</p>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-600 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />{countFor(activeTab)} items
                    </div>
                  </div>
                </div>
                <EditorShell
                  data={data}
                  setData={setData}
                  section={activeTab}
                  updateField={updateField}
                  showToast={showToast}
                  refetch={refetch}
                />
              </>
            )}
          </div>
        </div>

        <footer className="flex-shrink-0 px-6 py-3 border-t border-white/[0.03] bg-[#0a0a0f]/60 flex items-center justify-between text-[10px] text-slate-600">
          <span>Portfolio Admin v2.0</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </footer>
      </main>

      <ToastItem toast={toast} onDismiss={() => setToast(null)} />
      <ConfirmDlg
        open={confirmLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        danger={false}
        onConfirm={() => { setConfirmLogout(false); handleLogout(); }}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  );
}
