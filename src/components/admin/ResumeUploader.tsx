"use client";

import { useState, useEffect, useRef } from "react";
import { FiUpload, FiFile, FiEye, FiTrash2, FiCheck, FiAlertCircle, FiDownload } from "react-icons/fi";

interface ResumeInfo {
  exists: boolean;
  size: number;
  modified: string | null;
  fileName?: string;
}

export default function ResumeUploader({ resumeUrl, onResumeUrlChange }: {
  resumeUrl: string;
  onResumeUrlChange: (url: string) => void;
}) {
  const [info, setInfo] = useState<ResumeInfo>({ exists: false, size: 0, modified: null });
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrl = "/api/resume";

  useEffect(() => {
    fetch("/api/admin/resume?check=true")
      .then((r) => r.json())
      .then((d) => { setInfo(d); if (d.exists) setShowPreview(true); })
      .catch(() => {});
  }, []);

  const showStatus = (text: string, type: "success" | "error") => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const saveHeroResumeUrl = async (url: string) => {
    try {
      const getRes = await fetch("/api/admin/data", { credentials: "include" });
      if (!getRes.ok) { showStatus("Failed to fetch current data", "error"); return; }
      const allData = await getRes.json();
      if (allData?.hero) {
        allData.hero.resumeUrl = url;
        const patchRes = await fetch("/api/admin/data", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ section: "hero", data: allData.hero }),
        });
        if (!patchRes.ok) showStatus("Failed to save resume URL to data", "error");
      }
    } catch {
      showStatus("Network error saving resume URL", "error");
    }
  };

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      showStatus("Only PDF files are allowed", "error");
      return;
    }
    setUploading(true);
    setStatusMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/resume", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        showStatus(`Resume uploaded (${(data.fileSize / 1024).toFixed(1)} KB)`, "success");
        onResumeUrlChange(previewUrl);
        setInfo({ exists: true, size: data.actualSize, modified: data.modified, fileName: file.name });
        setShowPreview(true);
        await saveHeroResumeUrl(previewUrl);
      } else {
        showStatus(data.error || "Upload failed", "error");
      }
    } catch {
      showStatus("Network error during upload", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/resume", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onResumeUrlChange("");
        setInfo({ exists: false, size: 0, modified: null });
        setShowPreview(false);
        showStatus("Resume deleted", "success");
        await saveHeroResumeUrl("");
      } else {
        showStatus(data.error || "Delete failed", "error");
      }
    } catch {
      showStatus("Network error during delete", "error");
    } finally {
      setDeleting(false);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (iso: string | null): string => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <FiFile className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white text-sm font-medium">Resume (PDF)</h3>
            <p className="text-slate-600 text-[10px]">Upload & preview your resume</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {info.exists ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <FiCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-300 text-sm font-medium truncate">Resume uploaded</p>
                  <p className="text-slate-600 text-[11px]">
                    {formatSize(info.size)} &middot; {formatDate(info.modified)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowPreview(!showPreview)}
                className="flex-1 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 text-xs font-medium hover:bg-white/[0.08] hover:text-indigo-400 transition-all flex items-center justify-center gap-1.5">
                <FiEye className="w-3.5 h-3.5" /> {showPreview ? "Hide" : "Preview"}
              </button>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 text-xs font-medium hover:bg-white/[0.08] hover:text-indigo-400 transition-all flex items-center justify-center gap-1.5">
                <FiDownload className="w-3.5 h-3.5" /> Download
              </a>
              <button onClick={handleDelete} disabled={deleting}
                className="px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-all flex items-center gap-1.5 disabled:opacity-40">
                {deleting ? <span className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <FiTrash2 className="w-3.5 h-3.5" />}
                Delete
              </button>
            </div>

            {showPreview && (
              <div className="rounded-lg overflow-hidden border border-white/[0.06] bg-white/[0.01]">
                <iframe
                  key={info.modified || "no-file"}
                  src={previewUrl}
                  className="w-full h-[500px]"
                  title="Resume Preview"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/[0.03] flex items-center justify-center">
              <FiUpload className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-slate-500 text-sm mb-1">No resume uploaded</p>
            <p className="text-slate-700 text-[10px] mb-4">Upload a PDF file to display on your portfolio</p>
          </div>
        )}

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f); }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer p-4 rounded-lg border-2 border-dashed text-center transition-all duration-200 ${
            dragOver
              ? "border-indigo-500/50 bg-indigo-500/[0.03]"
              : "border-white/[0.06] hover:border-indigo-500/30 hover:bg-indigo-500/[0.02]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); if (e.target) e.target.value = ""; }}
          />
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
              <span className="text-slate-400 text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <FiUpload className="w-4 h-4" />
              <span>Drop PDF here or <span className="text-indigo-400 underline underline-offset-2">browse</span></span>
            </div>
          )}
        </div>

        {statusMsg && (
          <div className={`px-4 py-2.5 rounded-lg text-sm flex items-center gap-2.5 ${
            statusMsg.type === "success"
              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/15"
              : "bg-red-500/10 text-red-300 border border-red-500/15"
          }`}>
            {statusMsg.type === "success" ? <FiCheck className="w-4 h-4" /> : <FiAlertCircle className="w-4 h-4" />}
            <span>{statusMsg.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
