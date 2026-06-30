"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

type SectionKey = string;

interface SiteData {
  [key: string]: unknown;
}

const sectionMeta: Record<string, { label: string; icon: string; accent: string }> = {
  hero: { label: "Hero", icon: "⚡", accent: "from-blue-600 to-purple-600" },
  about: { label: "About", icon: "👤", accent: "from-emerald-600 to-teal-600" },
  skills: { label: "Skills", icon: "🔧", accent: "from-orange-600 to-red-600" },
  experience: { label: "Experience", icon: "💼", accent: "from-violet-600 to-indigo-600" },
  education: { label: "Education", icon: "📚", accent: "from-cyan-600 to-blue-600" },
  projects: { label: "Projects", icon: "📁", accent: "from-pink-600 to-rose-600" },
  testimonials: { label: "Testimonials", icon: "💬", accent: "from-amber-600 to-yellow-600" },
  stats: { label: "Stats", icon: "📊", accent: "from-green-600 to-lime-600" },
  contact: { label: "Contact", icon: "📧", accent: "from-sky-600 to-cyan-600" },
  settings: { label: "Settings", icon: "⚙️", accent: "from-slate-600 to-gray-600" },
  socialLinks: { label: "Links", icon: "🔗", accent: "from-rose-600 to-pink-600" },
};

/* ===== MODAL ===== */
function Modal({ open, onClose, title, icon, children }: { open: boolean; onClose: () => void; title: string; icon?: string; children: React.ReactNode }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 animate-in">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-700/30 bg-slate-900/90 backdrop-blur-xl rounded-t-2xl">
          <h2 className="text-white font-bold text-base flex items-center gap-2.5">
            {icon && <span className="inline-flex w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 items-center justify-center text-sm">{icon}</span>}
            {title}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all text-sm">✕</button>
        </div>
        <div className="p-6 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ===== CONFIRM DIALOG ===== */
function ConfirmDialog({ open, title, message, onConfirm, onCancel }: { open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 p-6 text-center animate-in">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/15 flex items-center justify-center text-2xl">⚠️</div>
        <h3 className="text-white font-bold text-base mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-all">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-semibold hover:from-red-500 hover:to-rose-500 transition-all shadow-lg shadow-red-500/20">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("hero");
  const [data, setData] = useState<SiteData | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error"; id: number } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    fetch("/api/admin/data")
      .then((r) => r.json())
      .then(setData)
      .catch(() => router.push("/admin/login"));
  }, [router]);

  const showToast = useCallback((msg: string, type: "success" | "error") => {
    const id = Date.now();
    setToast({ msg, type, id });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 3000);
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
    if (!data) return;
    setSaving(section);
    try {
      const res = await fetch("/api/admin/data", {
        method: "PATCH", // Changed to PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: data[section] }),
      });
      if (res.ok) showToast(`${sectionMeta[section]?.label || section} saved successfully ✓`, "success");
      else showToast("Failed to save — server error", "error");
    } catch {
      showToast("Network error — check your connection", "error");
    } finally {
      setSaving(null);
    }
  }, [data, showToast]);

  const addArrayItem = (section: SectionKey, path: string[], template: Record<string, unknown>) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev));
      let obj = next[section];
      for (let i = 0; i < path.length; i++) obj = obj[path[i]];
      obj.push(template);
      return next;
    });
  };

  const updateArrayItem = (section: SectionKey, path: string[], index: number, value: Record<string, unknown>) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev));
      let obj = next[section];
      for (let i = 0; i < path.length; i++) obj = obj[path[i]];
      obj[index] = value;
      return next;
    });
  };

  const removeArrayItem = (section: SectionKey, path: string[], index: number) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev));
      let obj = next[section];
      for (let i = 0; i < path.length; i++) obj = obj[path[i]];
      obj.splice(index, 1);
      return next;
    });
    showToast("Item removed", "success");
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    sessionStorage.removeItem("admin_session");
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
    if (section === "education") { const edu = (s.education as unknown[])?.length || 0; const ach = (s.achievements as unknown[])?.length || 0; return edu + ach; }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-5 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-950 flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300 hidden lg:flex items-center justify-center w-5 h-16 rounded-r-lg bg-slate-800 border border-slate-700/50 border-l-0 text-slate-500 hover:text-white hover:bg-slate-700 shadow-lg ${sidebarOpen ? "left-60" : "left-0"}`}
      >
        <span className="text-[8px] tracking-[2px]">{sidebarOpen ? "◀" : "▶"}</span>
      </button>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${sidebarOpen ? "w-60" : "w-0 lg:w-16"} fixed inset-y-0 left-0 z-40 h-screen overflow-hidden transition-all duration-300 bg-slate-900 border-r border-slate-800/60 flex flex-col flex-shrink-0`}>
        <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-800/60 flex-shrink-0 bg-gradient-to-r from-slate-900 to-slate-800/50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg shadow-blue-500/30">A</div>
          <div className={`min-w-0 ${sidebarOpen ? "opacity-100" : "opacity-0 lg:opacity-0"} transition-opacity`}>
            <p className="text-white font-bold text-sm truncate leading-tight">Portfolio</p>
            <p className="text-slate-500 text-[10px] truncate leading-tight">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {Object.entries(sectionMeta).map(([id, meta]) => {
            const isActive = activeTab === id;
            return (
              <button key={id} onClick={() => { setActiveTab(id); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${isActive ? "bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-transparent text-white shadow-sm" : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"}`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/30" />}
                <span className={`text-base flex-shrink-0 ${isActive ? "" : "opacity-60 group-hover:opacity-100"} transition-opacity`}>{meta.icon}</span>
                {sidebarOpen && (<><span className="truncate">{meta.label}</span>
                  <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-md font-mono ${isActive ? "bg-blue-500/20 text-blue-300 shadow-sm shadow-blue-500/10" : "bg-slate-800/80 text-slate-600"}`}>{countFor(id)}</span></>)}
              </button>
            );
          })}
        </nav>
        <div className="p-2 border-t border-slate-800/60 space-y-0.5 flex-shrink-0">
          <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 transition-all group"><span className="opacity-60 group-hover:opacity-100 transition-opacity">👁️</span><span className={sidebarOpen ? "" : "hidden"}>View Site</span></a>
          <button onClick={() => setConfirmLogout(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/60 hover:text-red-300 hover:bg-red-500/10 transition-all group"><span className="opacity-60 group-hover:opacity-100 transition-opacity">🚪</span><span className={sidebarOpen ? "" : "hidden"}>Logout</span></button>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "lg:pl-60" : "lg:pl-16"}`}>
        <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-slate-600 text-[10px] font-medium uppercase tracking-wider">Dashboard</span>
                  <span className="hidden sm:inline text-slate-700 text-[10px]">/</span>
                  <h1 className="text-white font-bold text-sm sm:text-lg truncate flex items-center gap-2"><span>{sectionMeta[activeTab]?.icon}</span>{sectionMeta[activeTab]?.label || activeTab}</h1>
                </div>
                <p className="text-slate-500 text-[10px] sm:text-xs truncate">Manage your {sectionMeta[activeTab]?.label.toLowerCase() || activeTab} content</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="/" target="_blank" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700/50"><span>👁️</span><span>Preview</span></a>
              <button onClick={() => saveSection(activeTab)} disabled={saving === activeTab}
                className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white shadow-lg transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0 shadow-blue-500/20"
              >
                {saving === activeTab ? (<><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>) : (<><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg> Save</>)}
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-900/40 border border-slate-800/50 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sectionMeta[activeTab]?.accent || "from-blue-600 to-purple-600"} flex items-center justify-center text-xl shadow-lg`}>
                    {sectionMeta[activeTab]?.icon}
                  </div>
                  <div>
                    <h2 className="text-white text-lg font-bold">{sectionMeta[activeTab]?.label || activeTab}</h2>
                    <p className="text-slate-500 text-xs mt-0.5">Edit and manage your {sectionMeta[activeTab]?.label.toLowerCase()} section content</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/30"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{countFor(activeTab)} items</div>
              </div>
            </div>
            <EditorShell data={data} section={activeTab} updateField={updateField} saving={saving} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} showToast={showToast} />
          </div>
        </div>

        <footer className="flex-shrink-0 px-6 py-3 border-t border-slate-800/40 bg-slate-900/60 flex items-center justify-between text-[10px] text-slate-600">
          <span>Akash Portfolio v1.0</span>
          <span>&copy; {new Date().getFullYear()} &mdash; Admin Panel</span>
        </footer>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-slide-in flex items-center gap-3 border backdrop-blur-xl ${toast.type === "success" ? "bg-emerald-900/80 text-emerald-200 border-emerald-700/40 shadow-emerald-500/10" : "bg-red-900/80 text-red-200 border-red-700/40 shadow-red-500/10"}`}>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${toast.type === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>{toast.type === "success" ? "✓" : "✕"}</div>
          <div><p className="text-sm font-medium">{toast.msg}</p><p className="text-[10px] opacity-60">{toast.type === "success" ? "Changes saved" : "Action failed"}</p></div>
          <button onClick={() => setToast(null)} className="text-current opacity-40 hover:opacity-100 transition-opacity ml-2 p-1">✕</button>
        </div>
      )}

      {/* Logout Confirm */}
      <ConfirmDialog
        open={confirmLogout}
        title="Logout"
        message="Are you sure you want to logout? Any unsaved changes will be lost."
        onConfirm={() => { setConfirmLogout(false); handleLogout(); }}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  );
}

/* ========== EDITOR SHELL ========== */

function EditorShell({
  data, section, updateField, saving, addArrayItem, updateArrayItem, removeArrayItem, showToast,
}: {
  data: SiteData; section: string; updateField: (s: string, p: string[], v: unknown) => void; saving: string | null;
  addArrayItem: (s: string, p: string[], t: Record<string, unknown>) => void;
  updateArrayItem: (s: string, p: string[], i: number, v: Record<string, unknown>) => void;
  removeArrayItem: (s: string, p: string[], i: number) => void; showToast: (msg: string, type: "success" | "error") => void;
}) {
  const content = data[section] as Record<string, unknown>;
  const [modal, setModal] = useState<{ type: "add" | "edit"; path: string[]; index?: number; data?: Record<string, unknown>; template?: Record<string, unknown> } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ path: string[]; index: number; title?: string } | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const requiredFieldsMap: Record<string, string[]> = {
    techStack: ["text"],
    badges: ["icon", "text", "color"],
    reviews: ["name", "text"],
    highlights: ["title", "desc"],
    "about-achievements": ["icon", "text"],
    "categories": ["title"],
    experiences: ["role", "company", "period"],
    education: ["degree", "school"],
    "education-achievements": ["icon", "text"],
    projects: ["title", "description"],
    testimonials: ["name", "quote"],
    stats: ["label", "value"],
    socialLinks: ["platform"],
  };

  const getRequiredFields = (path: string[], section: string): string[] => {
    const key = path.length > 0 ? path[path.length - 1] : `${section}-root`;
    if (key === "categories" && path.includes("skills")) return requiredFieldsMap["categories"];
    if (section === "socialLinks") {
      const plat = (formData.platform as string || "").toLowerCase();
      if (plat.includes("whats")) return ["platform", "phone"];
      return ["platform", "url"];
    }
    return requiredFieldsMap[key] || [];
  };

  const validateForm = (path: string[], section: string): boolean => {
    const req = getRequiredFields(path, section);
    const errs: Record<string, string> = {};
    req.forEach(f => {
      const v = formData[f];
      if (v === undefined || v === null || v === "") errs[f] = "Required";
    });
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openAddModal = (path: string[], template: Record<string, unknown>) => {
    setFormData(JSON.parse(JSON.stringify(template)));
    setModal({ type: "add", path, template });
  };

  const openEditModal = (path: string[], index: number, itemData: Record<string, unknown>) => {
    setFormData(JSON.parse(JSON.stringify(itemData)));
    setModal({ type: "edit", path, index, data: itemData });
  };

  const saveModal = () => {
    if (!modal) return;
    if (!validateForm(modal.path, section)) return;
    setValidationErrors({});
    let dataToSave = { ...formData };
    if (modal.path.length === 0 && (formData.platform as string || "").toLowerCase().includes("whats")) {
      const phone = (formData.phone as string || "").replace(/[^0-9]/g, "");
      const msg = formData.message as string || "";
      dataToSave.url = `https://wa.me/${phone}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
      delete dataToSave.phone;
      delete dataToSave.message;
    }
    if (modal.type === "add") {
      addArrayItem(section, modal.path, dataToSave);
      showToast("Item added", "success");
    } else if (modal.type === "edit" && modal.index !== undefined) {
      updateArrayItem(section, modal.path, modal.index, dataToSave);
      showToast("Item updated", "success");
    }
    setModal(null);
  };

  const confirmDelete = (path: string[], index: number, title?: string) => setDeleteConfirm({ path, index, title });
  const executeDelete = () => { if (deleteConfirm) { removeArrayItem(section, deleteConfirm.path, deleteConfirm.index); setDeleteConfirm(null); } };

  const Field = ({ label, name: fk, type = "text", hint, required }: { label: string; name: string; type?: string; hint?: string; required?: boolean }) => {
    const hasError = !!validationErrors[fk];
    const inputClass = `w-full px-3.5 py-2.5 rounded-lg bg-slate-800/50 border text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all text-sm ${hasError ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : "border-slate-700/50 focus:border-blue-500/60 focus:ring-blue-500/10"}`;
    return (
      <div>
        <label className="block text-slate-400 text-xs font-medium mb-1.5 tracking-wide">{label}{required ? <span className="text-red-400 ml-1">*</span> : <span className="text-slate-600 ml-1.5 text-[10px] font-normal">(optional)</span>}</label>
        {type === "textarea" ? (
          <textarea value={formData[fk] as string || ""} onChange={(e) => { setFormData(p => ({ ...p, [fk]: e.target.value })); if (hasError) setValidationErrors(p => { const n = { ...p }; delete n[fk]; return n; }); }}
            className={inputClass} rows={3} />
        ) : type === "color" ? (
          <div className="flex gap-2">
            <input type="color" value={formData[fk] as string || "#6366f1"} onChange={(e) => { setFormData(p => ({ ...p, [fk]: e.target.value })); if (hasError) setValidationErrors(p => { const n = { ...p }; delete n[fk]; return n; }); }} className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer flex-shrink-0 p-0.5" />
            <input type="text" value={formData[fk] as string || ""} onChange={(e) => { setFormData(p => ({ ...p, [fk]: e.target.value })); if (hasError) setValidationErrors(p => { const n = { ...p }; delete n[fk]; return n; }); }} className={`flex-1 px-3.5 py-2 rounded-lg bg-slate-800/50 border text-white font-mono text-sm focus:outline-none focus:ring-2 transition-all ${hasError ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : "border-slate-700/50 focus:border-blue-500/60 focus:ring-blue-500/10"}`} />
          </div>
        ) : type === "file" ? (
          <input type="file" accept=".pdf" onChange={(e) => {
            const file = e.target.files?.[0]; if (!file) return;
            const reader = new FileReader();
            reader.onload = () => { setFormData(p => ({ ...p, [fk]: reader.result as string })); if (hasError) setValidationErrors(p => { const n = { ...p }; delete n[fk]; return n; }); };
            reader.readAsDataURL(file);
          }} className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 cursor-pointer" />
        ) : (
          <input type={type} value={formData[fk] as string || ""} onChange={(e) => { setFormData(p => ({ ...p, [fk]: type === "number" ? (parseFloat(e.target.value) || 0) : e.target.value })); if (hasError) setValidationErrors(p => { const n = { ...p }; delete n[fk]; return n; }); }}
            className={inputClass} />
        )}
        {hint && <p className="text-slate-600 text-[10px] mt-1.5">{hint}</p>}
        {hasError && <p className="text-red-400 text-[10px] mt-1">This field is required</p>}
      </div>
    );
  };

  const FieldArray = ({ label, name: fk }: { label: string; name: string }) => {
    const items = formData[fk] as string[] || [];
    const [open, setOpen] = useState(true);
    return (
      <div className="bg-slate-900/30 rounded-xl border border-slate-700/30 overflow-hidden">
        <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-slate-800/30 transition-colors">
          <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider">{label} <span className="text-slate-500 font-normal">({items.length})</span></span>
          <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open && (
          <div className="px-4 pb-4 space-y-2 border-t border-slate-700/20 pt-3">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input value={item} onChange={(e) => { const n = [...items]; n[i] = e.target.value; setFormData(p => ({ ...p, [fk]: n })); }}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10" />
                <button onClick={() => setFormData(p => ({ ...p, [fk]: items.filter((_, j) => j !== i) }))} className="px-2.5 rounded-lg text-red-400/60 hover:bg-red-500/15 hover:text-red-300 transition-all text-sm">✕</button>
              </div>
            ))}
            <button onClick={() => setFormData(p => ({ ...p, [fk]: [...items, ""] }))} className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center gap-1.5 mt-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Add item
            </button>
          </div>
        )}
      </div>
    );
  };

  const ItemCard = ({ title, icon, onEdit, onDelete }: { title: string; icon?: string; onEdit: () => void; onDelete: () => void }) => (
    <div className="group bg-slate-900/40 rounded-xl border border-slate-700/30 overflow-hidden transition-all duration-200 hover:border-slate-600/50 hover:bg-slate-900/60 hover:shadow-lg hover:shadow-blue-500/5">
      <div className="flex items-center justify-between px-4 py-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {icon && <span className="text-lg flex-shrink-0">{icon}</span>}
          <h4 className="text-white text-sm font-medium truncate">{title}</h4>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={onEdit} className="px-2.5 py-1 rounded-md text-[10px] font-medium text-blue-400/70 hover:bg-blue-500/15 hover:text-blue-300 transition-all flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit
          </button>
          <button onClick={onDelete} className="px-2.5 py-1 rounded-md text-[10px] font-medium text-red-400/60 hover:bg-red-500/15 hover:text-red-300 transition-all flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  );

  if (!content) return <div className="text-slate-500 text-center py-12">No data for this section.</div>;

  /* ===== HERO ===== */
  if (section === "hero") {
    const h = content;
    const sectionKey = "hero";
    return (<div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <InputB label="Name" value={h.name as string} onChange={v => updateField(sectionKey, ["name"], v)} />
        <InputB label="Surname" value={h.surname as string} onChange={v => updateField(sectionKey, ["surname"], v)} />
        <InputB label="Available Text" value={h.availableText as string} onChange={v => updateField(sectionKey, ["availableText"], v)} />
        <InputB label="Play Store URL" value={h.playStoreUrl as string} onChange={v => updateField(sectionKey, ["playStoreUrl"], v)} hint="Leave empty if not available" />
        <InputB label="App Store URL" value={h.appStoreUrl as string} onChange={v => updateField(sectionKey, ["appStoreUrl"], v)} hint="Leave empty if not available" />
        <div className="space-y-2">
          <label className="block text-slate-400 text-xs font-medium tracking-wide">Resume PDF</label>
          <input type="file" accept=".pdf" onChange={(e) => {
            const file = e.target.files?.[0]; if (!file) return;
            const reader = new FileReader();
            reader.onload = () => updateField(sectionKey, ["resumeUrl"], reader.result as string);
            reader.readAsDataURL(file);
          }} className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 cursor-pointer" />
          {(() => { const r = h.resumeUrl; if (typeof r === 'string' && r.startsWith('data:')) return <p className="text-[10px] text-emerald-400">✅ PDF loaded ({Math.round((r.length * 3) / 4 / 1024)} KB base64)</p>; if (typeof r === 'string') return <p className="text-[10px] text-slate-500">🔗 URL: {r}</p>; return null; })()}
          {(() => {
            const r = h.resumeUrl; if (typeof r === 'string' && r.startsWith('data:')) return (
              <a href={r} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium hover:bg-emerald-500/20 hover:text-emerald-300 transition-all">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                View Resume
              </a>
            ); return null;
          })()}
        </div>
        <InputB label="Phone App Name" value={h.phoneAppName as string} onChange={v => updateField(sectionKey, ["phoneAppName"], v)} />
        <InputB label="Phone Developer" value={h.phoneDeveloper as string} onChange={v => updateField(sectionKey, ["phoneDeveloper"], v)} />
        <InputB label="Phone Size" value={h.phoneSize as string} onChange={v => updateField(sectionKey, ["phoneSize"], v)} />
        <InputB label="Phone Rating" type="number" value={String(h.phoneRating ?? "")} onChange={v => updateField(sectionKey, ["phoneRating"], parseFloat(v) || 0)} />
        <InputB label="Phone Review Count" type="number" value={String(h.phoneReviewCount ?? "")} onChange={v => updateField(sectionKey, ["phoneReviewCount"], parseInt(v) || 0)} />
      </div>
      <FieldArrayInline label="Roles" items={h.roles as string[]} onChange={v => updateField(sectionKey, ["roles"], v)} />
      <TextareaB label="Tagline" value={h.tagline as string} onChange={v => updateField(sectionKey, ["tagline"], v)} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CodeEditorB label="Flutter Code" value={h.flutterCode as string} onChange={v => updateField(sectionKey, ["flutterCode"], v)} />
        <CodeEditorB label="React Native Code" value={h.rnCode as string} onChange={v => updateField(sectionKey, ["rnCode"], v)} />
      </div>

      {/* Tech Badges */}
      <div className="bg-slate-900/20 rounded-2xl border border-slate-700/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-base">💻</div>
            <div><h3 className="text-white font-semibold text-sm">Floating Tech Badges</h3><p className="text-slate-500 text-[10px]">Skills shown on hero section</p></div>
          </div>
          <button onClick={() => openAddModal(["techStack"], { text: "New Tech" })} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 hover:text-blue-300 transition-all flex items-center gap-1.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(h.techStack as Record<string, unknown>[] || []).map((item: Record<string, unknown>, i: number) => (
            <ItemCard key={i} title={item.text as string || "Tech"} onEdit={() => openEditModal(["techStack"], i, item)} onDelete={() => confirmDelete(["techStack"], i, item.text as string)} />
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-slate-900/20 rounded-2xl border border-slate-700/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center text-base">🏅</div>
            <div><h3 className="text-white font-semibold text-sm">Badges</h3><p className="text-slate-500 text-[10px]">Achievement badges on hero</p></div>
          </div>
          <button onClick={() => openAddModal(["badges"], { icon: "🏆", text: "New Badge", color: "blue" })} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 hover:text-blue-300 transition-all flex items-center gap-1.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(h.badges as Record<string, unknown>[] || []).map((item: Record<string, unknown>, i: number) => (
            <ItemCard key={i} title={`${item.icon as string} ${item.text as string || "Badge"}`} icon={item.icon as string} onEdit={() => openEditModal(["badges"], i, item)} onDelete={() => confirmDelete(["badges"], i, item.text as string)} />
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-slate-900/20 rounded-2xl border border-slate-700/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center text-base">⭐</div>
            <div><h3 className="text-white font-semibold text-sm">Reviews</h3><p className="text-slate-500 text-[10px]">User reviews displayed on phone mockup</p></div>
          </div>
          <button onClick={() => openAddModal(["reviews"], { name: "New User", date: "Today", text: "Great work!", rating: 5, likes: 0 })} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 hover:text-blue-300 transition-all flex items-center gap-1.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(h.reviews as Record<string, unknown>[] || []).map((item: Record<string, unknown>, i: number) => (
            <ItemCard key={i} title={`${item.name as string} — ${item.rating as number}★`} onEdit={() => openEditModal(["reviews"], i, item)} onDelete={() => confirmDelete(["reviews"], i, item.name as string)} />
          ))}
        </div>
      </div>

      {/* Modal for hero arrays */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "add" ? "Add Item" : "Edit Item"}>
        {modal?.path.includes("techStack") && (<><Field label="Tech Name" name="text" required /><Field label="Icon Emoji" name="emoji" hint="Leave empty for auto-detect" /></>)}
        {modal?.path.includes("badges") && (<><Field label="Icon" name="icon" required /><Field label="Text" name="text" required /><Field label="Color" name="color" required hint="yellow / blue / green etc" /></>)}
        {modal?.path.includes("reviews") && (<><Field label="Name" name="name" required /><Field label="Date" name="date" /><Field label="Rating" type="number" name="rating" /><Field label="Likes" type="number" name="likes" /><Field label="Review Text" type="textarea" name="text" required /></>)}
        <div className="flex gap-3 pt-2"><button onClick={saveModal} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg">{modal?.type === "add" ? "Add" : "Save Changes"}</button><button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-300 text-sm hover:bg-slate-700 transition-all">Cancel</button></div>
      </Modal>
    </div>);
  }

  /* ===== ABOUT ===== */
  if (section === "about") {
    const a = content;
    const sectionKey = "about";
    return (<div className="space-y-8">
      <FieldArrayInline label="Paragraphs" items={a.paragraphs as string[]} onChange={v => updateField(sectionKey, ["paragraphs"], v)} />

      <div className="bg-slate-900/20 rounded-2xl border border-slate-700/20 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-base">✨</div>
          <div><h3 className="text-white font-semibold text-sm">Highlights</h3><p className="text-slate-500 text-[10px]">Key highlights and achievements</p></div>
        </div>
        <div className="flex justify-end"><button onClick={() => openAddModal(["highlights"], { icon: "FiCode", title: "New Highlight", desc: "Description", iconColor: "text-accent-blue" })} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 hover:text-blue-300 transition-all flex items-center gap-1.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add</button></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(a.highlights as Record<string, unknown>[] || []).map((item: Record<string, unknown>, i: number) => (
            <ItemCard key={i} title={item.title as string} onEdit={() => openEditModal(["highlights"], i, item)} onDelete={() => confirmDelete(["highlights"], i, item.title as string)} />
          ))}
        </div>
      </div>

      <div className="bg-slate-900/20 rounded-2xl border border-slate-700/20 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center text-base">🏆</div>
          <div><h3 className="text-white font-semibold text-sm">Achievements</h3><p className="text-slate-500 text-[10px]">Notable accomplishments</p></div>
        </div>
        <div className="flex justify-end"><button onClick={() => openAddModal(["achievements"], { icon: "🏆", text: "New achievement" })} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 hover:text-blue-300 transition-all flex items-center gap-1.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add</button></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(a.achievements as Record<string, unknown>[] || []).map((item: Record<string, unknown>, i: number) => (
            <ItemCard key={i} title={`${item.icon as string} ${item.text as string}`} icon={item.icon as string} onEdit={() => openEditModal(["achievements"], i, item)} onDelete={() => confirmDelete(["achievements"], i, item.text as string)} />
          ))}
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "add" ? "Add Item" : "Edit Item"}>
        {modal?.path.includes("highlights") && (<><Field label="Icon Name (FiCode, FiServer)" name="icon" /><Field label="Title" name="title" required /><Field label="Icon Color Class" name="iconColor" /><Field label="Description" type="textarea" name="desc" required /></>)}
        {modal?.path.includes("achievements") && (<><Field label="Icon" name="icon" required /><Field label="Text" name="text" required /></>)}
        <div className="flex gap-3 pt-2"><button onClick={saveModal} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg">{modal?.type === "add" ? "Add" : "Save Changes"}</button><button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-300 text-sm hover:bg-slate-700 transition-all">Cancel</button></div>
      </Modal>
    </div>);
  }

  /* ===== SKILLS ===== */
  if (section === "skills") {
    const s = content;
    const sectionKey = "skills";
    const cats = s.categories as Record<string, unknown>[];
    return (<div className="space-y-4">
      <AddButtonB onClick={() => openAddModal(["categories"], { title: "New Category", icon: "⚙️", skills: ["Skill 1"] })} label="Add Category" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cats.map((cat, ci) => (
          <ItemCard key={ci} title={`${cat.icon as string} ${cat.title as string}`} icon={cat.icon as string} onEdit={() => openEditModal(["categories"], ci, cat)} onDelete={() => confirmDelete(["categories"], ci, cat.title as string)} />
        ))}
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "add" ? "Add Category" : "Edit Category"}>
        <Field label="Title" name="title" required /><Field label="Icon" name="icon" /><FieldArray label="Skills" name="skills" />
        <div className="flex gap-3 pt-2"><button onClick={saveModal} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg">{modal?.type === "add" ? "Add" : "Save Changes"}</button><button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-300 text-sm hover:bg-slate-700 transition-all">Cancel</button></div>
      </Modal>
    </div>);
  }

  /* ===== EXPERIENCE ===== */
  if (section === "experience") {
    const ex = content;
    const sectionKey = "experience";
    const items = ex.experiences as Record<string, unknown>[];
    return (<div className="space-y-4">
      <AddButtonB onClick={() => openAddModal(["experiences"], { role: "New Role", company: "Company", period: "Jan 2024 – Present", type: "Full-time", location: "Location", color: "#6366f1", skills: ["Skill 1"], description: ["Description line 1"] })} label="Add Experience" />
      {items.map((exp, ei) => (<ItemCard key={ei} title={`${exp.role as string} @ ${exp.company as string}`} onEdit={() => openEditModal(["experiences"], ei, exp)} onDelete={() => confirmDelete(["experiences"], ei, exp.role as string)} />))}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "add" ? "Add Experience" : "Edit Experience"}>
        <div className="grid grid-cols-2 gap-3"><Field label="Role" name="role" required /><Field label="Company" name="company" required /><Field label="Period" name="period" required /><Field label="Type" name="type" /><Field label="Location" name="location" /><Field label="Color" type="color" name="color" /></div>
        <FieldArray label="Skills" name="skills" /><FieldArray label="Description" name="description" />
        <div className="flex gap-3 pt-2"><button onClick={saveModal} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg">{modal?.type === "add" ? "Add" : "Save Changes"}</button><button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-300 text-sm hover:bg-slate-700 transition-all">Cancel</button></div>
      </Modal>
    </div>);
  }

  /* ===== EDUCATION ===== */
  if (section === "education") {
    const ed = content;
    const sectionKey = "education";
    const eduItems = ed.education as Record<string, unknown>[];
    const achItems = ed.achievements as Record<string, unknown>[];
    return (<div className="space-y-8">
      <div className="bg-slate-900/20 rounded-2xl border border-slate-700/20 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-base">📚</div>
          <div><h3 className="text-white font-semibold text-sm">Education</h3><p className="text-slate-500 text-[10px]">Academic qualifications</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AddButtonB onClick={() => openAddModal(["education"], { degree: "New Degree", school: "School", period: "Graduated", icon: "🎓" })} label="Add Education" />
          {eduItems.map((item, ei) => (<ItemCard key={ei} title={`${item.icon as string} ${item.degree as string}`} icon={item.icon as string} onEdit={() => openEditModal(["education"], ei, item)} onDelete={() => confirmDelete(["education"], ei, item.degree as string)} />))}
        </div>
      </div>
      <div className="bg-slate-900/20 rounded-2xl border border-slate-700/20 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center text-base">🏆</div>
          <div><h3 className="text-white font-semibold text-sm">Achievements</h3><p className="text-slate-500 text-[10px]">Notable accomplishments</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AddButtonB onClick={() => openAddModal(["achievements"], { icon: "🏆", text: "New Achievement", gradient: "from-yellow-500/20 to-yellow-500/5", accent: "text-yellow-400" })} label="Add Achievement" />
          {achItems.map((item, ai) => (<ItemCard key={ai} title={`${item.icon as string} ${item.text as string}`} icon={item.icon as string} onEdit={() => openEditModal(["achievements"], ai, item)} onDelete={() => confirmDelete(["achievements"], ai, item.text as string)} />))}
        </div>
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "add" ? "Add Item" : "Edit Item"}>
        {modal?.path.includes("education") && (<><Field label="Degree" name="degree" required /><Field label="School" name="school" required /><Field label="Period" name="period" /><Field label="Icon" name="icon" /></>)}
        {modal?.path.includes("achievements") && (<><Field label="Icon" name="icon" required /><Field label="Text" name="text" required /><Field label="Gradient Class" name="gradient" /><Field label="Accent Class" name="accent" /></>)}
        <div className="flex gap-3 pt-2"><button onClick={saveModal} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg">{modal?.type === "add" ? "Add" : "Save Changes"}</button><button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-300 text-sm hover:bg-slate-700 transition-all">Cancel</button></div>
      </Modal>
    </div>);
  }

  /* ===== PROJECTS ===== */
  if (section === "projects") {
    const p = content;
    const sectionKey = "projects";
    const projItems = p.projects as Record<string, unknown>[];
    return (<div className="space-y-4">
      <AddButtonB onClick={() => openAddModal(["projects"], { id: (projItems.length + 1), title: "New Project", description: "Description", techStack: ["Tech 1"], androidLink: "", iosLink: "", githubLink: "", bannerImage: "", screenshots: [], features: ["Feature 1"], role: "Role description", category: "mobile", appIcon: "" })} label="Add Project" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {projItems.map((proj, pi) => (<ItemCard key={pi} title={`#${proj.id as number} ${proj.title as string}`} onEdit={() => openEditModal(["projects"], pi, proj)} onDelete={() => confirmDelete(["projects"], pi, proj.title as string)} />))}
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "add" ? "Add Project" : "Edit Project"}>
        <div className="grid grid-cols-2 gap-3"><Field label="Title" name="title" required /><Field label="Category" name="category" hint="mobile, web, backend, ai, iot..." /><Field label="Android Link" name="androidLink" /><Field label="iOS Link" name="iosLink" /><Field label="GitHub Link" name="githubLink" /><Field label="ID" type="number" name="id" /></div>
        <div><label className="block text-slate-400 text-xs font-medium mb-1.5 tracking-wide">App Icon URL <span className="text-slate-600 ml-1.5 text-[10px] font-normal">(auto-fetched from store links)</span></label>
          <div className="flex gap-2">
            <input value={formData.appIcon as string || ""} onChange={(e) => setFormData(p => ({ ...p, appIcon: e.target.value }))} className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10" placeholder="Auto-filled from Play Store / App Store" />
            {(formData.androidLink as string || formData.iosLink as string) && (
              <button onClick={async () => {
                const link = (formData.androidLink as string) || (formData.iosLink as string);
                if (!link) return;
                try {
                  const res = await fetch("/api/fetch-app-icon", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: link }) });
                  const data = await res.json();
                  if (data.iconUrl) setFormData(p => ({ ...p, appIcon: data.iconUrl }));
                  else alert("Could not fetch icon from store link");
                } catch { alert("Network error"); }
              }} className="px-3 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-all flex items-center gap-1 flex-shrink-0">Fetch Icon</button>
            )}
          </div>
        </div>
        <Field label="Description" type="textarea" name="description" required /><Field label="Role" type="textarea" name="role" />
        <FieldArray label="Tech Stack" name="techStack" /><FieldArray label="Features" name="features" />
        <div className="flex gap-3 pt-2"><button onClick={saveModal} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg">{modal?.type === "add" ? "Add" : "Save Changes"}</button><button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-300 text-sm hover:bg-slate-700 transition-all">Cancel</button></div>
      </Modal>
    </div>);
  }

  /* ===== TESTIMONIALS ===== */
  if (section === "testimonials") {
    const t = content;
    const sectionKey = "testimonials";
    const items = t.testimonials as Record<string, unknown>[];
    return (<div className="space-y-4">
      <AddButtonB onClick={() => openAddModal(["testimonials"], { name: "New Person", role: "Role", avatar: "NP", quote: "Great work!", rating: 5 })} label="Add Testimonial" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((test, ti) => (<ItemCard key={ti} title={`${test.name as string} — ${test.role as string}`} onEdit={() => openEditModal(["testimonials"], ti, test)} onDelete={() => confirmDelete(["testimonials"], ti, test.name as string)} />))}
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "add" ? "Add Testimonial" : "Edit Testimonial"}>
        <div className="grid grid-cols-2 gap-3"><Field label="Name" name="name" required /><Field label="Role" name="role" /><Field label="Avatar Initials" name="avatar" /><Field label="Rating" type="number" name="rating" /></div>
        <Field label="Quote" type="textarea" name="quote" required />
        <div className="flex gap-3 pt-2"><button onClick={saveModal} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg">{modal?.type === "add" ? "Add" : "Save Changes"}</button><button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-300 text-sm hover:bg-slate-700 transition-all">Cancel</button></div>
      </Modal>
    </div>);
  }

  /* ===== STATS ===== */
  if (section === "stats") {
    const st = content;
    const sectionKey = "stats";
    const items = st.stats as Record<string, unknown>[];
    return (<div className="space-y-4">
      <AddButtonB onClick={() => openAddModal(["stats"], { value: 10, suffix: "+", label: "New Stat", desc: "Description" })} label="Add Stat" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((stat, si) => (<ItemCard key={si} title={`${stat.label as string} — ${stat.value as number}${stat.suffix as string}`} onEdit={() => openEditModal(["stats"], si, stat)} onDelete={() => confirmDelete(["stats"], si, stat.label as string)} />))}
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "add" ? "Add Stat" : "Edit Stat"}>
        <div className="grid grid-cols-2 gap-3"><Field label="Value" type="number" name="value" required /><Field label="Suffix" name="suffix" /><Field label="Label" name="label" required /><Field label="Description" name="desc" /></div>
        <div className="flex gap-3 pt-2"><button onClick={saveModal} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg">{modal?.type === "add" ? "Add" : "Save Changes"}</button><button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-300 text-sm hover:bg-slate-700 transition-all">Cancel</button></div>
      </Modal>
    </div>);
  }

  /* ===== CONTACT ===== */
  if (section === "contact") {
    const c = content;
    const sectionKey = "contact";
    return (<div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputB label="Email" value={c.email as string} onChange={v => updateField(sectionKey, ["email"], v)} />
        <InputB label="Phone" value={c.phone as string} onChange={v => updateField(sectionKey, ["phone"], v)} />
        <InputB label="Location" value={c.location as string} onChange={v => updateField(sectionKey, ["location"], v)} />
        <InputB label="LinkedIn URL" value={c.linkedin as string} onChange={v => updateField(sectionKey, ["linkedin"], v)} />
      </div>
    </div>);
  }

  /* ===== SOCIAL LINKS ===== */
  if (section === "socialLinks") {
    const items = content as unknown as Record<string, unknown>[];
    const sectionKey = "socialLinks";
    const guessIcon = (platform: string) => {
      const p = platform.toLowerCase();
      if (p.includes("git")) return "FiGithub"; if (p.includes("linked")) return "FiLinkedin"; if (p.includes("whats")) return "FaWhatsapp";
      if (p.includes("mail") || p.includes("email")) return "FiMail"; if (p.includes("twit") || p.includes("x")) return "FiTwitter";
      if (p.includes("yout")) return "FiYoutube"; if (p.includes("insta")) return "FiInstagram"; if (p.includes("face")) return "FiFacebook";
      return "FiGlobe";
    };
    const icons = ["FiGithub", "FiLinkedin", "FaWhatsapp", "FiMail", "FiTwitter", "FiYoutube", "FiLink", "FiGlobe", "FiInstagram", "FiFacebook"];

    return (<div className="space-y-4">
      <AddButtonB onClick={() => openAddModal([], { platform: "GitHub", url: "https://", icon: "FiGithub" })} label="Add Link" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((link, i) => (<ItemCard key={i} title={link.platform as string} onEdit={() => openEditModal([], i, link)} onDelete={() => confirmDelete([], i, link.platform as string)} />))}
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.type === "add" ? "Add Link" : "Edit Link"}>
        <Field label="Platform" name="platform" required />
        {(formData.platform as string || "").toLowerCase().includes("whats") ? (
          <div className="space-y-3">
            <Field label="Phone Number" name="phone" required hint="e.g. 9198XXXXXXXX" />
            <Field label="Message (optional)" name="message" />
          </div>
        ) : (<Field label="URL" name="url" required />)}
        <div><label className="block text-slate-400 text-xs font-medium mb-1.5 tracking-wide">Icon</label>
          <select value={formData.icon as string || "FiGlobe"} onChange={(e) => setFormData(p => ({ ...p, icon: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition-all text-sm">
            {icons.map(opt => (<option key={opt} value={opt}>{opt.replace(/^(Fi|Fa)/, "")}</option>))}
          </select>
        </div>
        <div className="flex gap-3 pt-2"><button onClick={saveModal} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg">{modal?.type === "add" ? "Add" : "Save Changes"}</button><button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg bg-slate-800 border border-slate-700/50 text-slate-300 text-sm hover:bg-slate-700 transition-all">Cancel</button></div>
      </Modal>
    </div>);
  }

  /* ===== SETTINGS ===== */
  if (section === "settings") {
    const set = content;
    return (<div className="space-y-8">
      <div className="bg-slate-900/30 rounded-2xl border border-slate-700/30 p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-lg">⚙️</div>
          <div><h3 className="text-white font-semibold text-sm">Site Settings</h3><p className="text-slate-500 text-[10px]">Basic site configuration</p></div>
        </div>
        <InputB label="Site Title" value={set.title as string} onChange={v => updateField("settings", ["title"], v)} />
        <TextareaB label="Site Description" value={set.description as string} onChange={v => updateField("settings", ["description"], v)} />
        <FieldArrayInline label="Keywords" items={set.keywords as string[]} onChange={v => updateField("settings", ["keywords"], v)} />
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-slate-600/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center text-base">✨</div>
            <div><p className="text-slate-200 text-sm font-semibold">Particle Background</p><p className="text-slate-500 text-[11px] mt-0.5">Show animated particles on the hero section</p></div>
          </div>
          <button onClick={() => updateField("settings", ["particles"], !set.particles)} className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${set.particles ? "bg-blue-500 shadow-lg shadow-blue-500/30" : "bg-slate-700"}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${set.particles ? "left-7" : "left-1"}`} />
          </button>
        </div>
      </div>
      <div className="bg-slate-900/30 rounded-2xl border border-slate-700/30 p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center text-lg">🔑</div>
          <div><h3 className="text-white font-semibold text-sm">Change Password</h3><p className="text-slate-500 text-[10px]">Update your admin login password</p></div>
        </div>
        <PasswordChangeForm />
      </div>
    </div>);
  }

  return <p className="text-slate-500 text-center py-12">Select a section from the sidebar.</p>;
}

/* ===== HELPERS ===== */

function InputB({ label, value, onChange, type = "text", hint }: { label: string; value: string; onChange: (v: string) => void; type?: string; hint?: string }) {
  return (<div><label className="block text-slate-400 text-xs font-medium mb-1.5 tracking-wide">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition-all text-sm" />
    {hint && <p className="text-slate-600 text-[10px] mt-1.5">{hint}</p>}
  </div>);
}

function TextareaB({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (<div><label className="block text-slate-400 text-xs font-medium mb-1.5 tracking-wide">{label}</label>
    <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition-all text-sm resize-none" />
  </div>);
}

function FieldArrayInline({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<string[]>(items || []);
  useEffect(() => { setLocal(items || []); }, [(items || []).join("|")]);
  const sync = (arr: string[]) => { setLocal(arr); onChange(arr); };
  return (<div className="bg-slate-900/30 rounded-xl border border-slate-700/30 overflow-hidden">
    <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-slate-800/30 transition-colors">
      <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider">{label} <span className="text-slate-500 font-normal">({local.length})</span></span>
      <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </button>
    {open && (<div className="px-4 pb-4 border-t border-slate-700/20 pt-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {local.map((item, i) => (<div key={i} className="flex gap-2">
          <input value={item} onChange={(e) => { const n = [...local]; n[i] = e.target.value; sync(n); }}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10" />
          <button onClick={() => sync(local.filter((_, j) => j !== i))} className="px-2.5 rounded-lg text-red-400/60 hover:bg-red-500/15 hover:text-red-300 transition-all text-sm">✕</button>
        </div>))}
      </div>
      <button onClick={() => sync([...local, ""])} className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center gap-1.5 mt-1">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Add item
      </button>
    </div>)}
  </div>);
}

function CodeEditorB({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (<div className="bg-slate-900/30 rounded-xl border border-slate-700/30 overflow-hidden transition-all duration-200 hover:border-slate-600/50">
    <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-slate-800/30 transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
        </div>
        <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </button>
    {open && (<div className="px-4 pb-4 border-t border-slate-700/20 pt-3">
      <div className="relative rounded-lg overflow-hidden border border-slate-700/30">
        <div className="absolute left-0 top-0 bottom-0 w-9 bg-slate-900/60 border-r border-slate-700/30 flex flex-col items-center py-3 text-[10px] text-slate-600 font-mono leading-5 pointer-events-none select-none">
          {value.split("\n").map((_, i) => <span key={i}>{i + 1}</span>)}</div>
        <textarea value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-900/80 text-emerald-400 font-mono text-xs leading-5 focus:outline-none resize-none min-h-[200px]" />
      </div>
    </div>)}
  </div>);
}

function AddButtonB({ onClick, label }: { onClick: () => void; label: string }) {
  return (<button onClick={onClick}
    className="w-full py-4 rounded-xl border-2 border-dashed border-slate-700/40 text-slate-400 text-sm font-medium hover:border-blue-500/40 hover:text-blue-400 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2.5 group"
  >
    <div className="w-6 h-6 rounded-full bg-slate-800/60 group-hover:bg-blue-500/15 flex items-center justify-center group-hover:rotate-90 transition-all duration-300">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
    </div>
    <span>{label}</span>
  </button>);
}

function PasswordChangeForm() {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null);
    try {
      const res = await fetch("/api/admin/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw }) });
      const data = await res.json();
      if (data.success) { setMsg({ text: "Password updated successfully!", type: "success" }); setOldPw(""); setNewPw(""); }
      else setMsg({ text: data.error || "Failed to update", type: "error" });
    } catch { setMsg({ text: "Network error", type: "error" }); }
  };
  return (<form onSubmit={handleSubmit} className="space-y-4">
    <div><label className="block text-slate-400 text-xs font-medium mb-1.5 tracking-wide">Current Password</label>
      <div className="relative">
        <input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} placeholder="Enter current password"
          className="w-full px-3.5 py-2.5 pl-9 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition-all text-sm" />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
      </div>
    </div>
    <div><label className="block text-slate-400 text-xs font-medium mb-1.5 tracking-wide">New Password</label>
      <div className="relative">
        <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min 6 characters"
          className="w-full px-3.5 py-2.5 pl-9 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition-all text-sm" />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
      </div>
    </div>
    {msg && (<div className={`px-4 py-2.5 rounded-lg text-sm flex items-center gap-2.5 ${msg.type === "success" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20" : "bg-red-500/15 text-red-300 border border-red-500/20"}`}>
      <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] flex-shrink-0 ${msg.type === "success" ? "bg-emerald-500/20" : "bg-red-500/20"}`}>{msg.type === "success" ? "✓" : "✕"}</div>
      <span>{msg.text}</span></div>)}
    <button type="submit" disabled={!oldPw || !newPw || newPw.length < 6}
      className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
      Update Password</button>
  </form>);
}
