import type { DocumentPage, DocumentElement, TextElement, ImageElement, TableElement } from "../types";
import type { OCRResult } from "../types";
import { groupWordsIntoLines } from "./ocr";

export function buildElementsFromOCR(
  ocrResult: OCRResult,
  pageWidth: number,
  pageHeight: number,
  tableResult?: { rows: string[][]; bounds: { x: number; y: number; width: number; height: number } } | null
): DocumentElement[] {
  const elements: DocumentElement[] = [];

  if (tableResult && tableResult.rows.length > 0) {
    const { rows, bounds } = tableResult;
    const maxCols = Math.max(...rows.map((r) => r.length));
    const cellWidth = bounds.width / maxCols;
    const cellHeight = bounds.height / rows.length;

    const cells = rows.map((row) =>
      Array.from({ length: maxCols }, (_, ci) => ({
        text: row[ci] || "",
        fontSize: 12,
        textAlign: "left" as const,
      }))
    );

    elements.push({
      id: crypto.randomUUID(),
      type: "table",
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      rows: rows.length,
      cols: maxCols,
      cells,
      borderColor: "#000000",
    });

    const tableWords = new Set<string>();
    for (const row of tableResult.rows) {
      for (const word of row) {
        tableWords.add(word.toLowerCase());
      }
    }

    const remainingWords = ocrResult.words.filter((w) => {
      return !tableWords.has(w.text.toLowerCase());
    });

    const lines = groupWordsIntoLines(remainingWords);
    for (const line of lines) {
      const text = line.map((w) => w.text).join(" ");
      if (!text.trim()) continue;

      const x = line[0].x;
      const y = line[0].y;
      const lastWord = line[line.length - 1];
      const width = lastWord.x + lastWord.width - x;
      const height = Math.max(...line.map((w) => w.height));

      elements.push(createTextElement(text, x, y, width, height));
    }
  } else {
    const lines = groupWordsIntoLines(ocrResult.words);
    for (const line of lines) {
      const text = line.map((w) => w.text).join(" ");
      if (!text.trim()) continue;

      const x = line[0].x;
      const y = line[0].y;
      const lastWord = line[line.length - 1];
      const width = lastWord.x + lastWord.width - x;
      const height = Math.max(...line.map((w) => w.height));

      elements.push(createTextElement(text, x, y, width, height));
    }
  }

  if (elements.length === 0) {
    elements.push(
      createTextElement(
        "(No text detected - click to add text)",
        pageWidth * 0.1,
        pageHeight * 0.1,
        pageWidth * 0.8,
        30
      )
    );
  }

  return elements;
}

export function createTextElement(
  text: string,
  x: number,
  y: number,
  width: number,
  height: number
): TextElement {
  return {
    id: crypto.randomUUID(),
    type: "text",
    text,
    x,
    y,
    width,
    height,
    fontSize: 14,
    color: "#000000",
    textAlign: "left",
  };
}

export function buildImageElements(
  canvas: HTMLCanvasElement,
  originalWidth: number,
  originalHeight: number
): DocumentElement[] {
  return [
    {
      id: crypto.randomUUID(),
      type: "image",
      src: canvas.toDataURL("image/png"),
      x: 0,
      y: 0,
      width: originalWidth,
      height: originalHeight,
    } as ImageElement,
  ];
}
