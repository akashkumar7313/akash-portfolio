import type { OCRResult, OCRWord } from "../types";

let Tesseract: any = null;

export async function initTesseract() {
  if (!Tesseract) {
    Tesseract = await import("tesseract.js");
  }
  return Tesseract;
}

export async function performOCR(
  imageSource: string | HTMLCanvasElement,
  onProgress?: (progress: number, status: string) => void
): Promise<OCRResult> {
  const tess = await initTesseract();
  const worker = await tess.createWorker("eng", 1, {
    logger: (m: { status: string; progress: number }) => {
      if (onProgress) {
        const msg =
          m.status === "recognizing text" ? "Detecting text" : "Processing";
        onProgress(Math.round(m.progress * 100), msg);
      }
    },
  });

  try {
    const { data } = await worker.recognize(imageSource);
    const words: OCRWord[] = [];

    if (data.lines) {
      for (const line of data.lines) {
        for (const word of line.words) {
          words.push({
            text: word.text,
            x: word.bbox.x0,
            y: word.bbox.y0,
            width: word.bbox.x1 - word.bbox.x0,
            height: word.bbox.y1 - word.bbox.y0,
            confidence: word.confidence / 100,
          });
        }
      }
    }

    return {
      text: data.text,
      confidence: data.confidence / 100,
      words,
    };
  } finally {
    await worker.terminate();
  }
}

export function groupWordsIntoLines(words: OCRWord[]): OCRWord[][] {
  if (words.length === 0) return [];

  const sorted = [...words].sort((a, b) => a.y - b.y || a.x - b.x);
  const lines: OCRWord[][] = [];
  let currentLine: OCRWord[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const word = sorted[i];
    const prevWord = currentLine[currentLine.length - 1];
    const sameLine = Math.abs(word.y - prevWord.y) < prevWord.height * 0.5;

    if (sameLine) {
      currentLine.push(word);
    } else {
      lines.push(currentLine);
      currentLine = [word];
    }
  }
  lines.push(currentLine);
  return lines;
}

export function detectTableFromWords(
  words: OCRWord[],
  pageWidth: number,
  pageHeight: number
): { rows: string[][]; bounds: { x: number; y: number; width: number; height: number } } | null {
  const lines = groupWordsIntoLines(words);
  if (lines.length < 3) return null;

  const delimiterLines = lines.filter((line) => {
    const text = line.map((w) => w.text).join(" ");
    return /^[-|=+\s]+$/.test(text) || text.includes("---");
  });

  if (delimiterLines.length < 2) return null;

  const dataLines = lines.filter((line) => !delimiterLines.includes(line));
  if (dataLines.length < 2) return null;

  const allWords = dataLines.flat();
  const minX = Math.min(...allWords.map((w) => w.x));
  const minY = Math.min(...allWords.map((w) => w.y));
  const maxX = Math.max(...allWords.map((w) => w.x + w.width));
  const maxY = Math.max(...allWords.map((w) => w.y + w.height));

  const rows = dataLines.map((line) =>
    line.sort((a, b) => a.x - b.x).map((w) => w.text)
  );

  return {
    rows,
    bounds: { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
  };
}
