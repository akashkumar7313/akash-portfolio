import type { DocumentPage } from "../types";
import { performOCR } from "./ocr";
import { buildElementsFromOCR } from "./documentBuilder";

export async function processImage(
  file: File,
  onProgress?: (progress: number, message: string) => void
): Promise<DocumentPage[]> {
  onProgress?.(0, "Reading image file");

  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  onProgress?.(20, "Processing image");
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  onProgress?.(30, "Detecting text");
  const ocrResult = await performOCR(dataUrl, (p, msg) => {
    onProgress?.(30 + Math.round(p * 0.6), msg);
  });

  onProgress?.(95, "Building editable document");
  const elements = buildElementsFromOCR(
    ocrResult,
    img.naturalWidth,
    img.naturalHeight
  );

  onProgress?.(100, "Done");

  return [
    {
      id: crypto.randomUUID(),
      width: img.naturalWidth,
      height: img.naturalHeight,
      elements,
      originalImage: dataUrl,
    },
  ];
}

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

export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 50 * 1024 * 1024;
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
    "application/pdf",
  ];

  if (!allowedTypes.includes(file.type) && !file.name.endsWith(".heic")) {
    return {
      valid: false,
      error: `Unsupported file format: ${file.type || "unknown"}. Supported: JPG, PNG, WEBP, HEIC, PDF.`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: 50MB.`,
    };
  }

  return { valid: true };
}
