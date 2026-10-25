"use client";

import { useRef, useState } from "react";
import { FiUpload, FiTrash2, FiCheck, FiAlertCircle, FiUser } from "react-icons/fi";

function squareJpeg(file: File, size = 400, quality = 0.86): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("invalid image"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas unavailable"));
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function PhotoUploader({ value, onChange }: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [urlDraft, setUrlDraft] = useState("");

  const notify = (text: string, type: "success" | "error") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      notify("Only image files are allowed", "error");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await squareJpeg(file);
      onChange(dataUrl);
      notify("Photo added", "success");
    } catch {
      notify("Could not read that image", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c9f36c]/10">
          <FiUser className="h-4 w-4 text-[#c9f36c]" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">Profile photo</h3>
          <p className="text-[10px] text-slate-600">Shown in the hero avatar — empty falls back to &quot;AK&quot;</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] font-mono text-lg font-bold text-[#c9f36c]">
          {value ? <img src={value} alt="Profile" className="h-full w-full object-cover" /> : "AK"}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-400 transition-all hover:border-[#c9f36c]/30 hover:text-[#c9f36c] disabled:opacity-50"
            >
              {busy ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#c9f36c]/30 border-t-[#c9f36c]" />
              ) : (
                <FiUpload className="h-3.5 w-3.5" />
              )}
              {value ? "Replace photo" : "Upload photo"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => { onChange(""); notify("Photo removed — showing AK", "success"); }}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/10 bg-red-500/5 px-3 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-500/10"
              >
                <FiTrash2 className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="…or paste an image URL"
              className="min-w-0 flex-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-300 outline-none placeholder:text-slate-600 focus:border-[#c9f36c]/30"
            />
            <button
              type="button"
              onClick={() => {
                if (!urlDraft.trim()) return;
                onChange(urlDraft.trim());
                setUrlDraft("");
                notify("Photo URL saved", "success");
              }}
              className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-400 transition-all hover:border-[#c9f36c]/30 hover:text-[#c9f36c]"
            >
              Use
            </button>
          </div>
          <p className="text-[10px] text-slate-600">Images are cropped square and resized to 400px.</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {msg && (
        <div className={`mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
          msg.type === "success"
            ? "border-emerald-500/15 bg-emerald-500/10 text-emerald-300"
            : "border-red-500/15 bg-red-500/10 text-red-300"
        }`}>
          {msg.type === "success" ? <FiCheck className="h-3.5 w-3.5" /> : <FiAlertCircle className="h-3.5 w-3.5" />}
          {msg.text}
        </div>
      )}
    </div>
  );
}
