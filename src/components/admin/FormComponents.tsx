"use client";

import { useState, useEffect } from "react";
import { FiLock, FiCheck, FiAlertCircle, FiChevronDown, FiPlus, FiX } from "react-icons/fi";

export function FormField({ label, name, type = "text", hint, required, value, onChange, error }: {
  label: string; name: string; type?: string; hint?: string; required?: boolean;
  value: unknown; onChange: (v: unknown) => void; error?: string;
}) {
  const hasError = !!error;
  const cls = `w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 transition-all text-sm ${
    hasError
      ? "border-red-500/40 focus:border-red-500 focus:ring-red-500/20"
      : "border-white/[0.06] focus:border-indigo-500/50 focus:ring-indigo-500/20"
  }`;
  return (
    <div>
      <label className="block text-slate-500 text-xs font-medium mb-1.5 tracking-wide">
        {label}
        {required ? <span className="text-red-400 ml-1">*</span> : <span className="text-slate-700 ml-2 text-[10px]">opt</span>}
      </label>
      {type === "textarea" ? (
        <textarea value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={cls} rows={3} />
      ) : type === "number" ? (
        <input type="number" value={String(value ?? "")} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} className={cls} />
      ) : (
        <input type={type} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      {hint && <p className="text-slate-700 text-[10px] mt-1.5">{hint}</p>}
      {hasError && <p className="text-red-400 text-[10px] mt-1">Required</p>}
    </div>
  );
}

export function FormFieldArray({ label, name, items, onChange }: {
  label: string; name: string; items: string[]; onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white/[0.02] rounded-lg border border-white/[0.05] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
          {label} <span className="text-slate-600 font-normal">({items.length})</span>
        </span>
        <FiChevronDown className={`w-3 h-3 text-slate-600 transition-transform duration-200 ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-white/[0.04] pt-3">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => { const n = [...items]; n[i] = e.target.value; onChange(n); }}
                className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
              />
              <button
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="px-2.5 rounded-lg text-red-400/40 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange([...items, ""])}
            className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors flex items-center gap-1.5 mt-1"
          >
            <FiPlus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      )}
    </div>
  );
}

export function InputB({ label, value, onChange, type = "text", hint }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-slate-500 text-xs font-medium mb-1.5 tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm"
      />
      {hint && <p className="text-slate-700 text-[10px] mt-1.5">{hint}</p>}
    </div>
  );
}

export function TextareaB({ label, value, onChange, rows = 4 }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div>
      <label className="block text-slate-500 text-xs font-medium mb-1.5 tracking-wide">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm resize-none"
      />
    </div>
  );
}

export function FieldArrayInline({ label, items, onChange }: {
  label: string; items: string[]; onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<string[]>(items || []);
  useEffect(() => { setLocal(items || []); }, [JSON.stringify(items)]);
  const sync = (arr: string[]) => { setLocal(arr); onChange(arr); };
  return (
    <div className="bg-white/[0.02] rounded-lg border border-white/[0.05] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
          {label} <span className="text-slate-600 font-normal">({local.length})</span>
        </span>
        <FiChevronDown className={`w-3 h-3 text-slate-600 transition-transform duration-200 ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-white/[0.04] pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {local.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) => { const n = [...local]; n[i] = e.target.value; sync(n); }}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
                />
                <button
                  onClick={() => sync(local.filter((_, j) => j !== i))}
                  className="px-2.5 rounded-lg text-red-400/40 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => sync([...local, ""])}
            className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors flex items-center gap-1.5 mt-2"
          >
            <FiPlus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      )}
    </div>
  );
}

export function CodeEditorB({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white/[0.02] rounded-lg border border-white/[0.05] overflow-hidden transition-all duration-200 hover:border-white/[0.08]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500/50" /><div className="w-2 h-2 rounded-full bg-yellow-500/50" /><div className="w-2 h-2 rounded-full bg-green-500/50" /></div>
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</span>
        </div>
        <FiChevronDown className={`w-3 h-3 text-slate-600 transition-transform duration-200 ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-white/[0.04] pt-3">
          <div className="relative rounded-lg overflow-hidden border border-white/[0.06]">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-black/30 border-r border-white/[0.04] flex flex-col items-center py-2.5 text-[10px] text-slate-700 font-mono leading-5 pointer-events-none select-none">
              {value.split("\n").map((_, i) => <span key={i}>{i + 1}</span>)}
            </div>
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.02] text-emerald-400 font-mono text-xs leading-5 focus:outline-none resize-none min-h-[180px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function PasswordChangeForm() {
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
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-slate-500 text-xs font-medium mb-1.5 tracking-wide">Current Password</label>
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
          <input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} placeholder="Enter current password"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-slate-500 text-xs font-medium mb-1.5 tracking-wide">New Password</label>
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
          <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min 6 characters"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm" />
        </div>
      </div>
      {msg && (
        <div className={`px-4 py-2.5 rounded-lg text-sm flex items-center gap-2.5 ${
          msg.type === "success"
            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/15"
            : "bg-red-500/10 text-red-300 border border-red-500/15"
        }`}>
          {msg.type === "success" ? <FiCheck className="w-4 h-4" /> : <FiAlertCircle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}
      <button type="submit" disabled={!oldPw || !newPw || newPw.length < 6}
        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/10">
        <FiLock className="w-3.5 h-3.5" /> Update Password
      </button>
    </form>
  );
}
