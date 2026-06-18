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

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("hero");
  const [data, setData] = useState<SiteData | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error"; id: number } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        method: "PUT",
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
    showToast(`New item added to ${path[path.length - 1] || section}`, "success");
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
    if (section === "education") {
      const edu = (s.education as unknown[])?.length || 0;
      const ach = (s.achievements as unknown[])?.length || 0;
      return edu + ach;
    }
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
          <div className="w-12 h-12 mx-auto mb-4 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar toggle — always visible floating button */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-24 z-50 transition-all duration-300 hidden lg:flex items-center justify-center w-6 h-12 rounded-r-xl bg-slate-800 border border-slate-700 border-l-0 text-slate-400 hover:text-white hover:bg-slate-700 shadow-lg ${sidebarOpen ? "left-60" : "left-0"}`}
      >
        <span className="text-[10px]">{sidebarOpen ? "◀" : "▶"}</span>
      </button>

      {/* Sidebar — overlay on mobile, fixed on desktop */}
        <aside className={`
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${sidebarOpen ? "w-60" : "w-0 lg:w-16"}
        fixed inset-y-0 left-0 z-40 h-screen overflow-hidden
        transition-all duration-300 bg-slate-900/95
        border-r border-slate-800/50 flex flex-col flex-shrink-0
      `}>
        <div className="p-4 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg shadow-blue-500/20">
              A
            </div>
            <div className="min-w-0 lg:hidden">
              <p className="text-white font-bold text-sm truncate">Admin Panel</p>
              <p className="text-slate-500 text-[10px] truncate">Content Management</p>
            </div>
            {sidebarOpen && (
              <div className="min-w-0 hidden lg:block">
                <p className="text-white font-bold text-sm truncate">Admin Panel</p>
                <p className="text-slate-500 text-[10px] truncate">Content Management</p>
              </div>
            )}
            {/* Close button */}
            <button onClick={() => setSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-hidden">
          {Object.entries(sectionMeta).map(([id, meta]) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(window.innerWidth < 1024 ? false : true); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                activeTab === id
                  ? "bg-slate-800/80 text-white shadow-sm border border-slate-700/50"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <span className="text-base flex-shrink-0">{meta.icon}</span>
              {sidebarOpen && (
                <>
                  <span className="truncate">{meta.label}</span>
                  <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    activeTab === id ? "bg-slate-700 text-slate-300" : "bg-slate-800 text-slate-500"
                  }`}>
                    {countFor(id)}
                  </span>
                </>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800/50 space-y-1.5">
          <a href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all"
            onClick={() => setSidebarOpen(false)}
          >
            <span>👁️</span>
            <span className="hidden lg:inline">View Site</span>
          </a>
          <button onClick={() => { handleLogout(); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <span>🚪</span>
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "lg:pl-60" : "lg:pl-16"}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/50">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Hamburger — mobile only */}
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div className="min-w-0">
                <h1 className="text-white font-bold text-sm sm:text-lg flex items-center gap-2 truncate">
                  <span className="hidden sm:inline">{sectionMeta[activeTab]?.icon}</span>
                  {sectionMeta[activeTab]?.label || activeTab}
                </h1>
                <p className="text-slate-500 text-[10px] sm:text-xs truncate">Manage your {sectionMeta[activeTab]?.label.toLowerCase() || activeTab} content</p>
              </div>
            </div>
            <button
              onClick={() => saveSection(activeTab)}
              disabled={saving === activeTab}
              className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-lg transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0"
            >
              {saving === activeTab ? (
                <><span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> <span className="hidden xs:inline">Saving...</span></>
              ) : (
                <><span>💾</span> <span className="hidden xs:inline">Save</span> <span className="hidden sm:inline">Changes</span></>
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6">
          <div className="max-w-5xl mx-auto">
            <EditorShell
              data={data}
              section={activeTab}
              updateField={updateField}
              saving={saving}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              showToast={showToast}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="flex-shrink-0 px-6 py-3 border-t border-slate-800/50 bg-slate-900/40 text-center text-[10px] text-slate-500">
          Akash Portfolio v1.0 &copy; {new Date().getFullYear()} &mdash; Admin Panel
        </footer>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-slide-in flex items-center gap-2.5 border ${
          toast.type === "success"
            ? "bg-emerald-900/90 text-emerald-200 border-emerald-700/50 shadow-emerald-500/10"
            : "bg-red-900/90 text-red-200 border-red-700/50 shadow-red-500/10"
        }`}>
          <span className="text-lg">{toast.type === "success" ? "✅" : "❌"}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ========== EDITOR SHELL ========== */

function EditorShell({
  data, section, updateField, saving, addArrayItem, removeArrayItem, showToast,
}: {
  data: SiteData;
  section: string;
  updateField: (s: string, p: string[], v: unknown) => void;
  saving: string | null;
  addArrayItem: (s: string, p: string[], t: Record<string, unknown>) => void;
  removeArrayItem: (s: string, p: string[], i: number) => void;
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  const content = data[section] as Record<string, unknown>;
  if (!content) return <div className="text-slate-500 text-center py-12">No data for this section.</div>;

  const Input = ({ label, value, onChange, type = "text", hint }: { label: string; value: string; onChange: (v: string) => void; type?: string; hint?: string }) => (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
      />
      {hint && <p className="text-slate-600 text-[10px] mt-1">{hint}</p>}
    </div>
  );

  const Textarea = ({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) => (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1.5">{label}</label>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all text-sm resize-none"
      />
    </div>
  );

  const TextArray = ({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) => {
    const [open, setOpen] = useState(false);
    const localRef = useRef<{ id: number; value: string }[]>([]);
    const [version, setVersion] = useState(0);

    useEffect(() => {
      const incoming = (items || []).map(v => ({ id: Math.random(), value: v }));
      localRef.current = incoming;
      setVersion(v => v + 1);
    }, [(items || []).join("|")]);

    const safeItems = localRef.current;

    const sync = (arr: { id: number; value: string }[]) => {
      localRef.current = arr;
      onChange(arr.map(l => l.value));
    };

    return (
      <div className="bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
        <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left">
          <span className="text-slate-300 text-xs font-medium uppercase tracking-wider">{label} <span className="text-slate-500">({safeItems.length})</span></span>
          <span className={`text-slate-500 text-xs transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
        </button>
        {open && (
          <div className="mt-3 space-y-2">
            {safeItems.map(item => (
              <div key={item.id} className="flex gap-2">
                <input value={item.value} onChange={(e) => {
                  sync(safeItems.map(p => p.id === item.id ? { ...p, value: e.target.value } : p));
                }}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500" />
                <button onClick={() => sync(safeItems.filter(l => l.id !== item.id))}
                  className="px-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm">✕</button>
              </div>
            ))}
            <button onClick={() => sync([...safeItems, { id: Math.random(), value: "" }])}
              className="text-blue-400 text-sm hover:text-blue-300 transition-colors">+ Add item</button>
          </div>
        )}
      </div>
    );
  };

  const CodeEditor = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
        <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left">
          <span className="text-slate-300 text-xs font-medium uppercase tracking-wider">{label}</span>
          <span className={`text-slate-500 text-xs transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
        </button>
        {open && (
          <div className="mt-3 relative">
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-slate-900/50 rounded-l-lg border-r border-slate-700/30 flex flex-col items-center py-3 text-[10px] text-slate-600 font-mono leading-5 pointer-events-none select-none">
              {value.split("\n").map((_, i) => <span key={i}>{i + 1}</span>)}
            </div>
            <textarea value={value} onChange={(e) => onChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900/80 border border-slate-700/50 text-emerald-400 font-mono text-xs leading-5 focus:outline-none focus:border-blue-500/50 resize-none min-h-[200px]" />
          </div>
        )}
      </div>
    );
  };

  const CardItem = ({ children, title, onRemove }: { children: React.ReactNode; title: string; onRemove: () => void }) => {
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState(false);
    return (
      <div className="bg-slate-800/20 rounded-lg border border-slate-700/30 overflow-hidden">
        <div className="flex items-center justify-between px-3.5 py-2.5 gap-2 hover:bg-slate-800/40 transition-colors">
          <button onClick={() => setOpen(!open)} className="flex items-center gap-2 min-w-0 flex-1 text-left">
            <span className={`text-slate-500 text-[10px] transition-transform ${open ? "rotate-90" : ""}`}>▶</span>
            <h4 className="text-white text-sm font-medium truncate">{title}</h4>
          </button>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={() => setOpen(!open)}
              className="px-2 py-1 rounded-md text-[10px] font-medium text-blue-400 hover:bg-blue-500/10 transition-all">
              {open ? "▲" : "✎"} Edit
            </button>
            {confirm ? (
              <div className="flex items-center gap-1">
                <button onClick={() => { onRemove(); setConfirm(false); }}
                  className="px-2 py-1 rounded-md text-[10px] font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">Yes</button>
                <button onClick={() => setConfirm(false)}
                  className="px-2 py-1 rounded-md text-[10px] font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all">No</button>
              </div>
            ) : (
              <button onClick={() => setConfirm(true)}
                className="px-2 py-1 rounded-md text-[10px] font-medium text-red-400 hover:bg-red-500/10 transition-all">✕</button>
            )}
          </div>
        </div>
        {open && (
          <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-700/20">
            {children}
          </div>
        )}
      </div>
    );
  };

  const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1.5">{label}</label>
      <div className="flex gap-2">
        <input type="color" value={value || "#6366f1"} onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer flex-shrink-0" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
      </div>
    </div>
  );

  const AddButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
    <button onClick={onClick}
      className="w-full py-3 rounded-xl border-2 border-dashed border-slate-700/50 text-slate-400 text-sm font-medium hover:border-blue-500/30 hover:text-blue-400 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2"
    >
      <span className="text-lg">+</span> {label}
    </button>
  );

  /* ===== HERO ===== */
  if (section === "hero") {
    const h = content;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input label="Name" value={h.name as string} onChange={(v) => updateField("hero", ["name"], v)} />
          <Input label="Surname" value={h.surname as string} onChange={(v) => updateField("hero", ["surname"], v)} />
          <Input label="Available Text" value={h.availableText as string} onChange={(v) => updateField("hero", ["availableText"], v)} />
          <Input label="Play Store URL" value={h.playStoreUrl as string} onChange={(v) => updateField("hero", ["playStoreUrl"], v)} hint="Leave empty if not available" />
          <Input label="App Store URL" value={h.appStoreUrl as string} onChange={(v) => updateField("hero", ["appStoreUrl"], v)} hint="Leave empty if not available" />
          <div className="space-y-2">
            <label className="block text-slate-400 text-xs font-medium">Resume PDF</label>
            <input type="file" accept=".pdf" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => updateField("hero", ["resumeUrl"], reader.result as string);
              reader.readAsDataURL(file);
            }} className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 cursor-pointer" />
            {(() => {
              const r = h.resumeUrl;
              if (typeof r === 'string' && r.startsWith('data:')) return <p className="text-[10px] text-emerald-400">✅ PDF loaded ({Math.round((r.length * 3) / 4 / 1024)} KB base64)</p>;
              if (typeof r === 'string') return <p className="text-[10px] text-slate-500">🔗 URL: {r}</p>;
              return null;
            })()}
          </div>
          <Input label="Phone App Name" value={h.phoneAppName as string} onChange={(v) => updateField("hero", ["phoneAppName"], v)} />
          <Input label="Phone Developer" value={h.phoneDeveloper as string} onChange={(v) => updateField("hero", ["phoneDeveloper"], v)} />
          <Input label="Phone Size" value={h.phoneSize as string} onChange={(v) => updateField("hero", ["phoneSize"], v)} />
          <Input label="Phone Rating" type="number" value={String(h.phoneRating ?? "")} onChange={(v) => updateField("hero", ["phoneRating"], parseFloat(v) || 0)} />
          <Input label="Phone Review Count" type="number" value={String(h.phoneReviewCount ?? "")} onChange={(v) => updateField("hero", ["phoneReviewCount"], parseInt(v) || 0)} />
        </div>

        <TextArray label="Roles" items={h.roles as string[]} onChange={(v) => updateField("hero", ["roles"], v)} />
        <Textarea label="Tagline" value={h.tagline as string} onChange={(v) => updateField("hero", ["tagline"], v)} />

        <CodeEditor label="Flutter Code" value={h.flutterCode as string} onChange={(v) => updateField("hero", ["flutterCode"], v)} />
        <CodeEditor label="React Native Code" value={h.rnCode as string} onChange={(v) => updateField("hero", ["rnCode"], v)} />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-200 text-sm font-semibold">Floating Tech Badges <span className="text-slate-500">({(h.techStack as unknown[])?.length || 0})</span></h3>
            <AddButtonSmall onClick={() => addArrayItem("hero", ["techStack"], { text: "New Tech" })} />
          </div>
          {(h.techStack as Record<string, unknown>[] || []).map((item: Record<string, unknown>, i: number) => (
            <CardItem key={i} title={item.text as string} onRemove={() => removeArrayItem("hero", ["techStack"], i)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Tech Name" value={item.text as string} onChange={(v) => { const n = [...(h.techStack as Record<string, unknown>[])]; n[i] = { ...n[i], text: v }; updateField("hero", ["techStack"], n); }} />
              </div>
            </CardItem>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-200 text-sm font-semibold">Badges <span className="text-slate-500">({(h.badges as unknown[])?.length || 0})</span></h3>
            <AddButtonSmall onClick={() => addArrayItem("hero", ["badges"], { icon: "🏆", text: "New Badge", color: "blue" })} />
          </div>
          {(h.badges as Record<string, unknown>[] || []).map((badge: Record<string, unknown>, i: number) => (
            <CardItem key={i} title={`${badge.icon as string} ${badge.text as string || "Badge"}`} onRemove={() => removeArrayItem("hero", ["badges"], i)}>
              <div className="grid grid-cols-3 gap-3">
                <Input label="Icon" value={badge.icon as string} onChange={(v) => { const n = [...(h.badges as Record<string, unknown>[])]; n[i] = { ...n[i], icon: v }; updateField("hero", ["badges"], n); }} />
                <Input label="Text" value={badge.text as string} onChange={(v) => { const n = [...(h.badges as Record<string, unknown>[])]; n[i] = { ...n[i], text: v }; updateField("hero", ["badges"], n); }} />
                <Input label="Color (yellow/blue)" value={badge.color as string} onChange={(v) => { const n = [...(h.badges as Record<string, unknown>[])]; n[i] = { ...n[i], color: v }; updateField("hero", ["badges"], n); }} />
              </div>
            </CardItem>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-200 text-sm font-semibold">Reviews <span className="text-slate-500">({(h.reviews as unknown[])?.length || 0})</span></h3>
            <AddButtonSmall onClick={() => addArrayItem("hero", ["reviews"], { name: "New User", date: "Today", text: "Great work!", rating: 5, likes: 0 })} />
          </div>
          {(h.reviews as Record<string, unknown>[] || []).map((review: Record<string, unknown>, i: number) => (
            <CardItem key={i} title={`${review.name as string} — ${review.rating as number}★`} onRemove={() => removeArrayItem("hero", ["reviews"], i)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Name" value={review.name as string} onChange={(v) => { const n = [...(h.reviews as Record<string, unknown>[])]; n[i] = { ...n[i], name: v }; updateField("hero", ["reviews"], n); }} />
                <Input label="Date" value={review.date as string} onChange={(v) => { const n = [...(h.reviews as Record<string, unknown>[])]; n[i] = { ...n[i], date: v }; updateField("hero", ["reviews"], n); }} />
                <Input label="Rating (1-5)" type="number" value={String(review.rating || 5)} onChange={(v) => { const n = [...(h.reviews as Record<string, unknown>[])]; n[i] = { ...n[i], rating: parseInt(v) || 5 }; updateField("hero", ["reviews"], n); }} />
                <Input label="Likes" type="number" value={String(review.likes || 0)} onChange={(v) => { const n = [...(h.reviews as Record<string, unknown>[])]; n[i] = { ...n[i], likes: parseInt(v) || 0 }; updateField("hero", ["reviews"], n); }} />
              </div>
              <div className="mt-3">
                <Textarea label="Review Text" value={review.text as string} onChange={(v) => { const n = [...(h.reviews as Record<string, unknown>[])]; n[i] = { ...n[i], text: v }; updateField("hero", ["reviews"], n); }} rows={2} />
              </div>
            </CardItem>
          ))}
        </div>
      </div>
    );
  }

  /* ===== ABOUT ===== */
  if (section === "about") {
    const a = content;
    return (
      <div className="space-y-6">
        <TextArray label="Paragraphs" items={a.paragraphs as string[]} onChange={(v) => updateField("about", ["paragraphs"], v)} />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-200 text-sm font-semibold">Highlights <span className="text-slate-500">({(a.highlights as unknown[])?.length || 0})</span></h3>
            <AddButtonSmall onClick={() => addArrayItem("about", ["highlights"], { icon: "FiCode", title: "New Highlight", desc: "Description", iconColor: "text-accent-blue" })} />
          </div>
          {(a.highlights as Record<string, unknown>[] || []).map((item: Record<string, unknown>, i: number) => (
            <CardItem key={i} title={item.title as string} onRemove={() => removeArrayItem("about", ["highlights"], i)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Icon name (FiCode, FiServer, etc)" value={item.icon as string} onChange={(v) => { const n = [...(a.highlights as Record<string, unknown>[])]; n[i] = { ...n[i], icon: v }; updateField("about", ["highlights"], n); }} />
                <Input label="Title" value={item.title as string} onChange={(v) => { const n = [...(a.highlights as Record<string, unknown>[])]; n[i] = { ...n[i], title: v }; updateField("about", ["highlights"], n); }} />
                <Input label="Icon Color Class" value={item.iconColor as string} onChange={(v) => { const n = [...(a.highlights as Record<string, unknown>[])]; n[i] = { ...n[i], iconColor: v }; updateField("about", ["highlights"], n); }} />
              </div>
              <div className="mt-3">
                <Textarea label="Description" value={item.desc as string} onChange={(v) => { const n = [...(a.highlights as Record<string, unknown>[])]; n[i] = { ...n[i], desc: v }; updateField("about", ["highlights"], n); }} rows={2} />
              </div>
            </CardItem>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-200 text-sm font-semibold">Achievements <span className="text-slate-500">({(a.achievements as unknown[])?.length || 0})</span></h3>
            <AddButtonSmall onClick={() => addArrayItem("about", ["achievements"], { icon: "🏆", text: "New achievement" })} />
          </div>
          {(a.achievements as Record<string, unknown>[] || []).map((item: Record<string, unknown>, i: number) => (
            <CardItem key={i} title={`${item.icon as string} ${item.text as string}`} onRemove={() => removeArrayItem("about", ["achievements"], i)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Icon" value={item.icon as string} onChange={(v) => { const n = [...(a.achievements as Record<string, unknown>[])]; n[i] = { ...n[i], icon: v }; updateField("about", ["achievements"], n); }} />
                <Input label="Text" value={item.text as string} onChange={(v) => { const n = [...(a.achievements as Record<string, unknown>[])]; n[i] = { ...n[i], text: v }; updateField("about", ["achievements"], n); }} />
              </div>
            </CardItem>
          ))}
        </div>
      </div>
    );
  }

  /* ===== SKILLS ===== */
  if (section === "skills") {
    const s = content;
    const cats = s.categories as Record<string, unknown>[];
    return (
      <div className="space-y-4">
        <AddButton onClick={() => addArrayItem("skills", ["categories"], { title: "New Category", icon: "⚙️", skills: ["Skill 1", "Skill 2"] })} label="Add Category" />
        {cats.map((cat, ci) => (
          <CardItem key={ci} title={`${cat.icon as string} ${cat.title as string}`} onRemove={() => removeArrayItem("skills", ["categories"], ci)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Title" value={cat.title as string} onChange={(v) => updateField("skills", ["categories", String(ci), "title"], v)} />
              <Input label="Icon" value={cat.icon as string} onChange={(v) => updateField("skills", ["categories", String(ci), "icon"], v)} />
            </div>
            <div className="mt-3">
              <TextArray label="Skills" items={cat.skills as string[]} onChange={(v) => updateField("skills", ["categories", String(ci), "skills"], v)} />
            </div>
          </CardItem>
        ))}
      </div>
    );
  }

  /* ===== EXPERIENCE ===== */
  if (section === "experience") {
    const ex = content;
    const items = ex.experiences as Record<string, unknown>[];
    return (
      <div className="space-y-4">
        <AddButton onClick={() => addArrayItem("experience", ["experiences"], {
          role: "New Role", company: "Company", period: "Jan 2024 – Present", type: "Full-time", location: "Location",
          color: "#6366f1", skills: ["Skill 1"], description: ["Description line 1"],
        })} label="Add Experience" />
        {items.map((exp, ei) => (
          <CardItem key={ei} title={`${exp.role as string} @ ${exp.company as string}`} onRemove={() => removeArrayItem("experience", ["experiences"], ei)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <Input label="Role" value={exp.role as string} onChange={(v) => updateField("experience", ["experiences", String(ei), "role"], v)} />
              <Input label="Company" value={exp.company as string} onChange={(v) => updateField("experience", ["experiences", String(ei), "company"], v)} />
              <Input label="Period" value={exp.period as string} onChange={(v) => updateField("experience", ["experiences", String(ei), "period"], v)} />
              <Input label="Type" value={exp.type as string} onChange={(v) => updateField("experience", ["experiences", String(ei), "type"], v)} />
              <Input label="Location" value={exp.location as string} onChange={(v) => updateField("experience", ["experiences", String(ei), "location"], v)} />
              <ColorInput label="Accent Color" value={exp.color as string} onChange={(v) => updateField("experience", ["experiences", String(ei), "color"], v)} />
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <TextArray label="Skills" items={exp.skills as string[]} onChange={(v) => updateField("experience", ["experiences", String(ei), "skills"], v)} />
              <TextArray label="Description" items={exp.description as string[]} onChange={(v) => updateField("experience", ["experiences", String(ei), "description"], v)} />
            </div>
          </CardItem>
        ))}
      </div>
    );
  }

  /* ===== EDUCATION ===== */
  if (section === "education") {
    const ed = content;
    const eduItems = ed.education as Record<string, unknown>[];
    const achItems = ed.achievements as Record<string, unknown>[];
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-slate-200 text-sm font-semibold mb-4">Education</h3>
          <div className="space-y-4">
            <AddButton onClick={() => addArrayItem("education", ["education"], { degree: "New Degree", school: "School", period: "Graduated", icon: "🎓" })} label="Add Education" />
            {eduItems.map((item, ei) => (
              <CardItem key={ei} title={`${item.icon as string} ${item.degree as string}`} onRemove={() => removeArrayItem("education", ["education"], ei)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Degree" value={item.degree as string} onChange={(v) => updateField("education", ["education", String(ei), "degree"], v)} />
                  <Input label="School" value={item.school as string} onChange={(v) => updateField("education", ["education", String(ei), "school"], v)} />
                  <Input label="Period" value={item.period as string} onChange={(v) => updateField("education", ["education", String(ei), "period"], v)} />
                  <Input label="Icon" value={item.icon as string} onChange={(v) => updateField("education", ["education", String(ei), "icon"], v)} />
                </div>
              </CardItem>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-slate-200 text-sm font-semibold mb-4">Achievements</h3>
          <div className="space-y-4">
            <AddButton onClick={() => addArrayItem("education", ["achievements"], { icon: "🏆", text: "New Achievement", gradient: "from-yellow-500/20 to-yellow-500/5", accent: "text-yellow-400" })} label="Add Achievement" />
            {achItems.map((item, ai) => (
              <CardItem key={ai} title={`${item.icon as string} ${item.text as string}`} onRemove={() => removeArrayItem("education", ["achievements"], ai)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Icon" value={item.icon as string} onChange={(v) => updateField("education", ["achievements", String(ai), "icon"], v)} />
                  <Input label="Text" value={item.text as string} onChange={(v) => updateField("education", ["achievements", String(ai), "text"], v)} />
                  <Input label="Gradient Class" value={item.gradient as string} onChange={(v) => updateField("education", ["achievements", String(ai), "gradient"], v)} />
                  <Input label="Accent Class" value={item.accent as string} onChange={(v) => updateField("education", ["achievements", String(ai), "accent"], v)} />
                </div>
              </CardItem>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ===== PROJECTS ===== */
  if (section === "projects") {
    const p = content;
    const projItems = p.projects as Record<string, unknown>[];
    return (
      <div className="space-y-4">
        <AddButton onClick={() => addArrayItem("projects", ["projects"], {
          id: (projItems.length + 1), title: "New Project", description: "Description", techStack: ["Tech 1"],
          androidLink: "", iosLink: "", githubLink: "", bannerImage: "", screenshots: [], features: ["Feature 1"],
          role: "Role description", category: "mobile",
        })} label="Add Project" />
        {projItems.map((proj, pi) => (
          <CardItem key={pi} title={`#${proj.id as number} ${proj.title as string}`} onRemove={() => removeArrayItem("projects", ["projects"], pi)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Title" value={proj.title as string} onChange={(v) => updateField("projects", ["projects", String(pi), "title"], v)} />
              <Input label="Category" value={proj.category as string} onChange={(v) => updateField("projects", ["projects", String(pi), "category"], v)} hint="e.g. mobile, web, backend, ai, iot..." />
              <Input label="Android Link" value={proj.androidLink as string} onChange={(v) => updateField("projects", ["projects", String(pi), "androidLink"], v)} />
              <Input label="iOS Link" value={proj.iosLink as string} onChange={(v) => updateField("projects", ["projects", String(pi), "iosLink"], v)} />
              <Input label="GitHub Link" value={proj.githubLink as string} onChange={(v) => updateField("projects", ["projects", String(pi), "githubLink"], v)} />
              <Input label="ID" type="number" value={String(proj.id || 0)} onChange={(v) => updateField("projects", ["projects", String(pi), "id"], parseInt(v) || 0)} />
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <Textarea label="Description" value={proj.description as string} onChange={(v) => updateField("projects", ["projects", String(pi), "description"], v)} rows={3} />
              <Textarea label="Role" value={proj.role as string} onChange={(v) => updateField("projects", ["projects", String(pi), "role"], v)} rows={3} />
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <TextArray label="Tech Stack" items={proj.techStack as string[]} onChange={(v) => updateField("projects", ["projects", String(pi), "techStack"], v)} />
              <TextArray label="Features" items={proj.features as string[]} onChange={(v) => updateField("projects", ["projects", String(pi), "features"], v)} />
            </div>
          </CardItem>
        ))}
      </div>
    );
  }

  /* ===== TESTIMONIALS ===== */
  if (section === "testimonials") {
    const t = content;
    const items = t.testimonials as Record<string, unknown>[];
    return (
      <div className="space-y-4">
        <AddButton onClick={() => addArrayItem("testimonials", ["testimonials"], { name: "New Person", role: "Role", avatar: "NP", quote: "Great work!", rating: 5 })} label="Add Testimonial" />
        {items.map((test, ti) => (
          <CardItem key={ti} title={`${test.name as string} — ${test.role as string}`} onRemove={() => removeArrayItem("testimonials", ["testimonials"], ti)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Name" value={test.name as string} onChange={(v) => updateField("testimonials", ["testimonials", String(ti), "name"], v)} />
              <Input label="Role" value={test.role as string} onChange={(v) => updateField("testimonials", ["testimonials", String(ti), "role"], v)} />
              <Input label="Avatar Initials" value={test.avatar as string} onChange={(v) => updateField("testimonials", ["testimonials", String(ti), "avatar"], v)} />
              <Input label="Rating (1-5)" type="number" value={String(test.rating || 5)} onChange={(v) => updateField("testimonials", ["testimonials", String(ti), "rating"], parseInt(v) || 5)} />
            </div>
            <div className="mt-3">
              <Textarea label="Quote" value={test.quote as string} onChange={(v) => updateField("testimonials", ["testimonials", String(ti), "quote"], v)} rows={3} />
            </div>
          </CardItem>
        ))}
      </div>
    );
  }

  /* ===== STATS ===== */
  if (section === "stats") {
    const st = content;
    const items = st.stats as Record<string, unknown>[];
    return (
      <div className="space-y-4">
        <AddButton onClick={() => addArrayItem("stats", ["stats"], { value: 10, suffix: "+", label: "New Stat", desc: "Description" })} label="Add Stat" />
        {items.map((stat, si) => (
          <CardItem key={si} title={`${stat.label as string} — ${stat.value as number}${stat.suffix as string}`} onRemove={() => removeArrayItem("stats", ["stats"], si)}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input label="Value" type="number" value={String(stat.value ?? 0)} onChange={(v) => updateField("stats", ["stats", String(si), "value"], parseInt(v) || 0)} />
              <Input label="Suffix" value={stat.suffix as string} onChange={(v) => updateField("stats", ["stats", String(si), "suffix"], v)} />
              <Input label="Label" value={stat.label as string} onChange={(v) => updateField("stats", ["stats", String(si), "label"], v)} />
              <Input label="Description" value={stat.desc as string} onChange={(v) => updateField("stats", ["stats", String(si), "desc"], v)} />
            </div>
          </CardItem>
        ))}
      </div>
    );
  }

  /* ===== CONTACT ===== */
  if (section === "contact") {
    const c = content;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Email" value={c.email as string} onChange={(v) => updateField("contact", ["email"], v)} />
          <Input label="Phone" value={c.phone as string} onChange={(v) => updateField("contact", ["phone"], v)} />
          <Input label="Location" value={c.location as string} onChange={(v) => updateField("contact", ["location"], v)} />
          <Input label="LinkedIn URL" value={c.linkedin as string} onChange={(v) => updateField("contact", ["linkedin"], v)} />
        </div>
      </div>
    );
  }

  /* ===== SOCIAL LINKS ===== */
  if (section === "socialLinks") {
    const items = content as unknown as Record<string, unknown>[];
    const guessIcon = (platform: string) => {
      const p = platform.toLowerCase();
      if (p.includes("git")) return "FiGithub";
      if (p.includes("linked")) return "FiLinkedin";
      if (p.includes("whats")) return "FaWhatsapp";
      if (p.includes("mail") || p.includes("email")) return "FiMail";
      if (p.includes("twit") || p.includes("x")) return "FiTwitter";
      if (p.includes("yout")) return "FiYoutube";
      if (p.includes("insta")) return "FiInstagram";
      if (p.includes("face")) return "FiFacebook";
      return "FiGlobe";
    };
    return (
      <div className="space-y-4">
        <AddButton onClick={() => addArrayItem("socialLinks", [], { platform: "GitHub", url: "https://", icon: "FiGithub" })} label="Add Link" />
        {items.map((link, i) => {
          const isWA = (link.platform as string).toLowerCase().includes("whats");
          return (
          <CardItem key={i} title={`${link.platform as string}`} onRemove={() => removeArrayItem("socialLinks", [], i)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input label="Platform" value={link.platform as string} onChange={(v) => {
                updateField("socialLinks", [String(i), "platform"], v);
                updateField("socialLinks", [String(i), "icon"], guessIcon(v));
              }} />
              {isWA ? (
                <div className="space-y-2">
                  <input placeholder="Phone number (e.g. 9198XXXXXXXX)" value={(link.url as string)?.replace(/^https:\/\/wa\.me\//,"")?.replace(/\?.*/,"") || ""}
                    onChange={(e) => updateField("socialLinks", [String(i), "url"], `https://wa.me/${e.target.value}`)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm" />
                  <input placeholder="Message (optional)" value={(link.url as string)?.match(/\?text=(.*)/)?.[1] || ""}
                    onChange={(e) => {
                      const base = (link.url as string)?.replace(/\?text=.*/,"");
                      updateField("socialLinks", [String(i), "url"], e.target.value ? `${base}?text=${encodeURIComponent(e.target.value)}` : base);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm" />
                </div>
              ) : (
                <Input label="URL" value={link.url as string} onChange={(v) => updateField("socialLinks", [String(i), "url"], v)} />
              )}
              <select value={link.icon as string} onChange={(e) => updateField("socialLinks", [String(i), "icon"], e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white focus:outline-none focus:border-blue-500/50 text-sm">
                {["FiGithub","FiLinkedin","FaWhatsapp","FiMail","FiTwitter","FiYoutube","FiLink","FiGlobe","FiInstagram","FiFacebook"].map(opt => (
                  <option key={opt} value={opt}>{opt.replace(/^(Fi|Fa)/,"")}</option>
                ))}
              </select>
            </div>
          </CardItem>
          );
        })}
      </div>
    );
  }

  /* ===== SETTINGS ===== */
  if (section === "settings") {
    const set = content;
    return (
      <div className="space-y-6">
        <Input label="Site Title" value={set.title as string} onChange={(v) => updateField("settings", ["title"], v)} />
        <Textarea label="Site Description" value={set.description as string} onChange={(v) => updateField("settings", ["description"], v)} />
        <TextArray label="Keywords" items={set.keywords as string[]} onChange={(v) => updateField("settings", ["keywords"], v)} />
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
          <div>
            <p className="text-slate-200 text-sm font-semibold">✨ Particle Background</p>
            <p className="text-slate-500 text-xs mt-0.5">Show animated particles on the hero section</p>
          </div>
          <button onClick={() => updateField("settings", ["particles"], !set.particles)}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${set.particles ? "bg-blue-500" : "bg-slate-600"}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${set.particles ? "left-7" : "left-1"}`} />
          </button>
        </div>
        <div className="pt-6 border-t border-slate-700/30">
          <h3 className="text-slate-200 text-sm font-semibold mb-4">🔑 Change Admin Password</h3>
          <PasswordChangeForm />
        </div>
      </div>
    );
  }

  return <p className="text-slate-500 text-center py-12">Select a section from the sidebar.</p>;
}

/* ===== HELPERS ===== */

function AddButtonSmall({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-all flex items-center gap-1.5"
    >
      <span>+</span> Add
    </button>
  );
}

function PasswordChangeForm() {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ text: "Password updated successfully!", type: "success" });
        setOldPw(""); setNewPw("");
      } else {
        setMsg({ text: data.error || "Failed to update", type: "error" });
      }
    } catch {
      setMsg({ text: "Network error", type: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
      <div>
        <label className="block text-slate-400 text-xs font-medium mb-1.5">Current Password</label>
        <input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} placeholder="Enter current password"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm" />
      </div>
      <div>
        <label className="block text-slate-400 text-xs font-medium mb-1.5">New Password</label>
        <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min 6 characters"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm" />
      </div>
      {msg && (
        <div className={`px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 ${
          msg.type === "success" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" : "bg-red-500/10 text-red-300 border border-red-500/20"
        }`}>
          <span>{msg.type === "success" ? "✅" : "❌"}</span>
          {msg.text}
        </div>
      )}
      <button type="submit" disabled={!oldPw || !newPw || newPw.length < 6}
        className="px-5 py-2.5 rounded-xl bg-slate-700 text-white text-sm font-medium hover:bg-slate-600 disabled:opacity-50 transition-all">
        Change Password
      </button>
    </form>
  );
}
