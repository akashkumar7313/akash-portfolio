"use client";

import { useState, useRef, useCallback } from "react";
import { FiUploadCloud, FiFileText, FiImage, FiX, FiAlertCircle, FiShield } from "react-icons/fi";
import { validateFile } from "@/features/ai-doc-scanner/services/imageProcessor";

interface Props {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export default function DocumentUploader({ onFileSelect, isProcessing }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const result = validateFile(file);
      if (!result.valid) {
        setError(result.error || "Invalid file");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[#c9f36c] flex items-center justify-center">
            <FiFileText className="w-7 h-7 text-[#101412]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
            AI Document Scanner
          </h1>
          <p className="text-sm sm:text-base opacity-50 max-w-sm mx-auto leading-relaxed">
            Upload an image or PDF. Edit the text directly on the original document.
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !isProcessing && inputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-300
            ${isProcessing ? "pointer-events-none opacity-50" : ""}
            ${dragOver
              ? "border-[#c9f36c] bg-[#c9f36c]/5 scale-[1.01]"
              : "border-white/10 hover:border-[#c9f36c]/40 hover:bg-white/[0.02]"
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.heic,.pdf"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              dragOver ? "bg-[#c9f36c]/15 scale-110" : "bg-white/5"
            }`}>
              <FiUploadCloud className={`w-8 h-8 transition-colors ${dragOver ? "text-[#c9f36c]" : "text-white/30"}`} />
            </div>
            <div>
              <p className="text-[var(--text-primary)] font-semibold text-lg">
                {dragOver ? "Drop here" : "Click or drag to upload"}
              </p>
              <p className="text-sm text-white/30 mt-1.5">
                JPG, PNG, WEBP, HEIC, PDF — max 50MB
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <FiAlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400/50 hover:text-red-400">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: <FiImage className="w-4 h-4" />, label: "Images & PDFs" },
            { icon: <FiFileText className="w-4 h-4" />, label: "Edit Text" },
            { icon: <FiShield className="w-4 h-4" />, label: "100% Private" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-[#c9f36c]/60">{item.icon}</div>
              <span className="text-[11px] text-white/40">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Privacy note */}
        <p className="text-center text-[11px] text-white/20 mt-6">
          All processing happens in your browser. No files are uploaded to any server.
        </p>
      </div>
    </div>
  );
}
