import * as pdfjsLib from "pdfjs-dist";
import type { DocumentPage } from "../types";
import { performOCR, detectTableFromWords } from "./ocr";
import { buildElementsFromOCR } from "./documentBuilder";

if (typeof window !== "undefined") {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.3.289/pdf.worker.min.mjs";
}

const MAX_PAGES = 50;
const RENDER_SCALE = 1.5;

export async function processPDF(
  file: File,
  onProgress?: (progress: number, message: string) => void
): Promise<DocumentPage[]> {
  onProgress?.(0, "Reading PDF file");
  const arrayBuffer = await file.arrayBuffer();

  let pdf: any;
  try {
    pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      disableFontFace: true,
    } as any).promise;
  } catch (e) {
    throw new Error(`Cannot open PDF: ${e instanceof Error ? e.message : "file may be corrupted"}`);
  }

  const totalPages = Math.min(pdf.numPages, MAX_PAGES);
  const pages: DocumentPage[] = [];

  for (let i = 1; i <= totalPages; i++) {
    onProgress?.(
      Math.round((i / totalPages) * 40),
      `Rendering page ${i} of ${totalPages}`
    );

    try {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: RENDER_SCALE });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport } as any).promise;

      const originalImage = canvas.toDataURL("image/png", 0.8);

      onProgress?.(
        Math.round(40 + (i / totalPages) * 50),
        `Detecting text on page ${i}`
      );

      const ocrResult = await performOCR(originalImage, (p, msg) => {
        onProgress?.(
          Math.round(40 + (i / totalPages) * (40 + p * 0.1)),
          msg
        );
      });

      onProgress?.(
        Math.round(40 + (i / totalPages) * 95),
        `Building page ${i}`
      );

      const tableResult = detectTableFromWords(
        ocrResult.words,
        viewport.width,
        viewport.height
      );
      const elements = buildElementsFromOCR(
        ocrResult,
        viewport.width,
        viewport.height,
        tableResult
      );

      pages.push({
        id: crypto.randomUUID(),
        width: viewport.width,
        height: viewport.height,
        elements,
        originalImage,
      });
    } catch (pageErr) {
      console.warn(`Page ${i} failed, skipping:`, pageErr);
      // Skip failed pages, continue with others
    }

    // Free memory
    if (typeof window !== "undefined" && (window as any).gc) {
      (window as any).gc();
    }
  }

  if (pages.length === 0) {
    throw new Error("No pages could be processed from this PDF");
  }

  onProgress?.(100, "Done");
  return pages;
}
