import * as pdfjsLib from "pdfjs-dist";
import type { DocumentPage } from "../types";
import { performOCR, detectTableFromWords } from "./ocr";
import { buildElementsFromOCR } from "./documentBuilder";

if (typeof window !== "undefined") {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export async function processPDF(
  file: File,
  onProgress?: (progress: number, message: string) => void
): Promise<DocumentPage[]> {
  onProgress?.(0, "Reading PDF file");
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: DocumentPage[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress?.(
      Math.round((i / pdf.numPages) * 40),
      `Rendering page ${i} of ${pdf.numPages}`
    );
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport } as any).promise;

    const originalImage = canvas.toDataURL("image/png");

    onProgress?.(
      Math.round(40 + (i / pdf.numPages) * 50),
      `Detecting text on page ${i}`
    );

    const ocrResult = await performOCR(originalImage, (p, msg) => {
      onProgress?.(
        Math.round(40 + (i / pdf.numPages) * (40 + p * 0.1)),
        msg
      );
    });

    onProgress?.(
      Math.round(40 + (i / pdf.numPages) * 95),
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
  }

  onProgress?.(100, "Done");
  return pages;
}
