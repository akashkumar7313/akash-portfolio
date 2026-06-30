"use client";

import { useEffect } from "react";
import { FiCheck, FiAlertCircle, FiX, FiPlus, FiEdit3, FiTrash2 } from "react-icons/fi";

export function ToastItem({ toast, onDismiss }: {
  toast: { msg: string; type: "success" | "error"; id: number } | null;
  onDismiss: () => void;
}) {
  if (!toast) return null;
  const ok = toast.type === "success";
  return (
    <div className="fixed top-5 right-5 z-[200] animate-slide-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-xl ${
        ok
          ? "bg-emerald-900/80 text-emerald-200 border-emerald-700/30"
          : "bg-red-900/80 text-red-200 border-red-700/30"
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          ok ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
        }`}>
          {ok ? <FiCheck className="w-4 h-4" /> : <FiAlertCircle className="w-4 h-4" />}
        </div>
        <div>
          <p className="text-sm font-medium">{toast.msg}</p>
          <p className="text-[10px] opacity-60">{ok ? "Operation completed" : "Operation failed"}</p>
        </div>
        <button onClick={onDismiss} className="text-current opacity-30 hover:opacity-100 transition-opacity ml-2 p-1">
          <FiX className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function ConfirmDlg({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel, danger = true }: {
  open: boolean; title: string; message: string; confirmLabel?: string;
  onConfirm: () => void; onCancel: () => void; danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-[#151520] border border-white/[0.06] rounded-xl p-6 shadow-2xl shadow-black/40">
        <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
          danger ? "bg-red-500/10" : "bg-indigo-500/10"
        }`}>
          {danger ? <FiAlertCircle className="w-5 h-5 text-red-400" /> : <FiCheck className="w-5 h-5 text-indigo-400" />}
        </div>
        <h3 className="text-white font-semibold text-base mb-2 text-center">{title}</h3>
        <p className="text-slate-500 text-sm mb-6 text-center">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel}
            className="px-5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 text-sm font-medium hover:bg-white/[0.08] transition-all">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-all shadow-lg ${
              danger
                ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-500/15"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/15"
            }`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SectionGroup({ title, icon, desc, onAdd, children }: {
  title: string; icon: React.ReactNode; desc: string; onAdd: () => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center text-base">{icon}</div>
          <div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-slate-600 text-[10px]">{desc}</p>
          </div>
        </div>
        <button onClick={onAdd}
          className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-indigo-400 text-xs font-medium hover:bg-white/[0.08] hover:text-indigo-300 transition-all flex items-center gap-1.5">
          <FiPlus className="w-3 h-3" /> Add
        </button>
      </div>
      {children}
    </div>
  );
}

export function ItemCard({ title, icon, onEdit, onDelete }: {
  title: string; icon?: React.ReactNode; onEdit: () => void; onDelete: () => void;
}) {
  return (
    <div className="bg-white/[0.02] rounded-lg border border-white/[0.05] overflow-hidden hover:border-white/[0.08] hover:bg-white/[0.03] transition-all duration-200">
      <div className="flex items-center justify-between px-4 py-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {icon && <span className="text-lg flex-shrink-0">{icon}</span>}
          <h4 className="text-slate-300 text-sm font-medium truncate">{title}</h4>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onEdit}
            className="px-2 py-1 rounded-md text-[10px] font-medium text-slate-500 hover:bg-white/[0.05] hover:text-indigo-400 transition-all flex items-center gap-1">
            <FiEdit3 className="w-3 h-3" /> Edit
          </button>
          <button onClick={onDelete}
            className="px-2 py-1 rounded-md text-[10px] font-medium text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all flex items-center gap-1">
            <FiTrash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className="w-full py-3.5 rounded-lg border-2 border-dashed border-white/[0.06] text-slate-500 text-sm font-medium hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-indigo-500/[0.02] transition-all flex items-center justify-center gap-2.5 group">
      <div className="w-6 h-6 rounded-full bg-white/[0.03] group-hover:bg-indigo-500/10 flex items-center justify-center group-hover:rotate-90 transition-all duration-300">
        <FiPlus className="w-3.5 h-3.5" />
      </div>
      <span>{label}</span>
    </button>
  );
}

export function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#151520] border border-white/[0.06] rounded-xl shadow-2xl shadow-black/40"
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] bg-[#151520]/90 backdrop-blur-xl rounded-t-xl">
          <h2 className="text-white font-semibold text-sm">{title}</h2>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.04] text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all">
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}

export function ActionButtons({ isAdd, onSave, onCancel }: {
  isAdd: boolean; onSave: () => void; onCancel: () => void;
}) {
  return (
    <div className="flex gap-3 pt-2">
      <button onClick={onSave}
        className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2">
        <FiCheck className="w-4 h-4" />{isAdd ? "Add" : "Save Changes"}
      </button>
      <button onClick={onCancel}
        className="px-5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 text-sm hover:bg-white/[0.08] transition-all">
        Cancel
      </button>
    </div>
  );
}
