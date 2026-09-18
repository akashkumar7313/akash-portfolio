"use client";

import { useState, useRef, useCallback } from "react";
import { FiUploadCloud, FiFileText, FiImage, FiX, FiAlertCircle } from "react-icons/fi";
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#c9f36c] to-[#a8d94a] flex items-center justify-center">
            <FiFileText className="w-8 h-8 text-[#101412]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            AI Document Scanner
          </h2>
          <p className="text-sm opacity-60 max-w-md mx-auto">
            Upload an image or PDF to scan, extract text, and create an editable document.
            All processing happens locally in your browser.
          </p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isProcessing && inputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-2xl border-2 border-dashed p-12 sm:p-16 text-center transition-all duration-300
            ${isProcessing ? "pointer-events-none opacity-50" : ""}
            ${
              dragOver
                ? "border-[#c9f36c] bg-[#c9f36c]/5 scale-[1.02]"
                : "border-[var(--glass-border)] hover:border-[#c9f36c]/40 hover:bg-[var(--glass-bg)]"
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.heic,.pdf"
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                dragOver
                  ? "bg-[#c9f36c]/20 scale-110"
                  : "bg-[var(--glass-bg)]"
              }`}
            >
              <FiUploadCloud
                className={`w-7 h-7 transition-colors ${
                  dragOver ? "text-[#c9f36c]" : "text-[var(--text-primary)] opacity-40"
                }`}
              />
            </div>
            <div>
              <p className="text-[var(--text-primary)] font-semibold text-lg">
                {dragOver ? "Drop your file here" : "Click to upload or drag & drop"}
              </p>
              <p className="text-sm opacity-40 mt-1">
                JPG, PNG, WEBP, HEIC, PDF (max 50MB)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs opacity-30">
              <span className="flex items-center gap-1">
                <FiImage className="w-3 h-3" /> Images
              </span>
              <span className="flex items-center gap-1">
                <FiFileText className="w-3 h-3" /> PDF
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <FiAlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400/50 hover:text-red-400">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="mt-6 p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          <p className="text-xs text-center opacity-40">
            Your documents are processed locally in your browser and are not uploaded to a server.
          </p>
        </div>
      </div>
    </div>
  );
}
