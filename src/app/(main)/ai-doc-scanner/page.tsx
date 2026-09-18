"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { DocumentModel, ProcessingState } from "@/features/ai-doc-scanner/types";
import { processImage, validateFile } from "@/features/ai-doc-scanner/services/imageProcessor";
import { saveDocument } from "@/features/ai-doc-scanner/services/storage";
import DocumentUploader from "@/components/ai-doc-scanner/DocumentUploader";
import ProcessingProgress from "@/components/ai-doc-scanner/ProcessingProgress";

const DocumentEditor = dynamic(() => import("@/components/ai-doc-scanner/DocumentEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-[var(--bg-body)]">
      <div className="text-[var(--text-primary)] opacity-40">Loading editor...</div>
    </div>
  ),
});

export default function AIDocScannerPage() {
  const [document, setDocument] = useState<DocumentModel | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
    message: "",
  });

  const handleFileSelect = useCallback(async (file: File) => {
    const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");

    if (isPDF) {
      setProcessing({ status: "reading", progress: 0, message: "Reading PDF file" });

      try {
        const { processPDF } = await import("@/features/ai-doc-scanner/services/pdfProcessor");
        const pages = await processPDF(file, (progress, message) => {
          const statusMap: Record<string, ProcessingState["status"]> = {
            "Reading PDF file": "reading",
            "Rendering page": "rendering",
            "Detecting text": "ocr",
            "Building page": "building",
            Done: "done",
          };
          const status = statusMap[message.split(" ").slice(0, 2).join(" ")] || "ocr";
          setProcessing({ status, progress, message });
        });

        const doc: DocumentModel = {
          id: crypto.randomUUID(),
          name: file.name.replace(/\.[^.]+$/, ""),
          pages,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        await saveDocument(doc);
        setDocument(doc);
        setProcessing({ status: "done", progress: 100, message: "Done" });
      } catch (err) {
        console.error("PDF processing failed:", err);
        const msg = err instanceof Error ? err.message : String(err);
        setProcessing({
          status: "error",
          progress: 0,
          message: "Failed to process PDF",
          error: `Unable to process this PDF: ${msg}. Try a smaller file or an image instead.`,
        });
      }
      return;
    }

    setProcessing({ status: "reading", progress: 0, message: "Reading image file" });

    try {
      const pages = await processImage(file, (progress, message) => {
        const statusMap: Record<string, ProcessingState["status"]> = {
          "Reading image file": "reading",
          "Processing image": "rendering",
          "Detecting text": "ocr",
          "Building editable document": "building",
          Done: "done",
        };
        const status = statusMap[message] || "ocr";
        setProcessing({ status, progress, message });
      });

      const doc: DocumentModel = {
        id: crypto.randomUUID(),
        name: file.name.replace(/\.[^.]+$/, ""),
        pages,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await saveDocument(doc);
      setDocument(doc);
      setProcessing({ status: "done", progress: 100, message: "Done" });
    } catch (err) {
      console.error("Image processing failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setProcessing({
        status: "error",
        progress: 0,
        message: "Failed to process image",
        error: `Unable to process this image: ${msg}. Try a higher quality image or a different format.`,
      });
    }
  }, []);

  const handleReset = useCallback(() => {
    setDocument(null);
    setProcessing({ status: "idle", progress: 0, message: "" });
  }, []);

  if (processing.status !== "idle" && processing.status !== "done" && processing.status !== "error") {
    return <ProcessingProgress state={processing} />;
  }

  if (processing.status === "error") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <span className="text-2xl">!</span>
          </div>
          <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-2">
            Processing Failed
          </h3>
          <p className="text-sm opacity-50 mb-4">{processing.error || "An unexpected error occurred."}</p>
          <p className="text-xs opacity-30 mb-6">
            You can try: a higher-quality image, a smaller PDF, or another file format.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-[#c9f36c]/10 text-[#c9f36c] font-medium text-sm hover:bg-[#c9f36c]/20 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (document) {
    return <DocumentEditor document={document} onClose={handleReset} />;
  }

  return <DocumentUploader onFileSelect={handleFileSelect} isProcessing={false} />;
}
