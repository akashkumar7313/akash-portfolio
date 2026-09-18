"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { ProcessingState } from "@/features/ai-doc-scanner/types";
import DocumentUploader from "@/components/ai-doc-scanner/DocumentUploader";
import ProcessingProgress from "@/components/ai-doc-scanner/ProcessingProgress";

const ImageTextEditor = dynamic(() => import("@/components/ai-doc-scanner/ImageTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-[var(--bg-body)]">
      <div className="text-[var(--text-primary)] opacity-40">Loading editor...</div>
    </div>
  ),
});

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function AIDocScannerPage() {
  const [ocrWords, setOcrWords] = useState<any[]>([]);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [originalImage, setOriginalImage] = useState("");
  const [docName, setDocName] = useState("");
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
    message: "",
  });

  const handleFileSelect = useCallback(async (file: File) => {
    const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const name = file.name.replace(/\.[^.]+$/, "");
    setDocName(name);

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

        if (pages[0]) {
          const firstPage = pages[0];
          setOriginalImage(firstPage.originalImage || "");
          setPageWidth(firstPage.width);
          setPageHeight(firstPage.height);

          const allWords: any[] = [];
          for (const el of firstPage.elements) {
            if ("text" in el && "x" in el && "y" in el) {
              allWords.push({
                text: (el as any).text,
                x: (el as any).x,
                y: (el as any).y,
                width: (el as any).width || 100,
                height: (el as any).height || 20,
                confidence: 0.9,
              });
            }
          }
          setOcrWords(allWords);
        }

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
      const { performOCR } = await import("@/features/ai-doc-scanner/services/ocr");
      const dataUrl = await readFileAsDataUrl(file);
      const img = await loadImage(dataUrl);

      setOriginalImage(dataUrl);
      setPageWidth(img.naturalWidth);
      setPageHeight(img.naturalHeight);

      setProcessing({ status: "ocr", progress: 30, message: "Detecting text" });
      const ocrResult = await performOCR(dataUrl, (p, msg) => {
        setProcessing({ status: "ocr", progress: 30 + Math.round(p * 0.6), message: msg });
      });

      setOcrWords(ocrResult.words);
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
    setOcrWords([]);
    setPageWidth(0);
    setPageHeight(0);
    setOriginalImage("");
    setDocName("");
    setProcessing({ status: "idle", progress: 0, message: "" });
  }, []);

  const handleSaveModified = useCallback((modifiedImageUrl: string) => {
    const link = window.document.createElement("a");
    link.download = `${docName || "modified"}-edited.png`;
    link.href = modifiedImageUrl;
    link.click();
  }, [docName]);

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

  if (originalImage && ocrWords.length > 0 && pageWidth > 0) {
    return (
      <ImageTextEditor
        originalImage={originalImage}
        words={ocrWords}
        pageWidth={pageWidth}
        pageHeight={pageHeight}
        onSave={handleSaveModified}
        onBack={handleReset}
      />
    );
  }

  return <DocumentUploader onFileSelect={handleFileSelect} isProcessing={false} />;
}
