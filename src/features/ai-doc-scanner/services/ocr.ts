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

  onProgress?.(10, "Initializing OCR engine");
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
    onProgress?.(20, "Running OCR");
    const result = await worker.recognize(imageSource);
    const data = result.data;
    const words: OCRWord[] = [];

    // Tesseract.js v5+ puts words directly in data.words
    if (data.words && data.words.length > 0) {
      for (const word of data.words) {
        const bbox = word.bbox;
        words.push({
          text: word.text,
          x: bbox.x0,
          y: bbox.y0,
          width: bbox.x1 - bbox.x0,
          height: bbox.y1 - bbox.y0,
          confidence: (word.confidence || 0) / 100,
        });
      }
    }
    // Fallback: try lines -> words path (older API)
    else if (data.lines) {
      for (const line of data.lines) {
        if (line.words) {
          for (const word of line.words) {
            const bbox = word.bbox || word.bounding_box;
            if (bbox) {
              words.push({
                text: word.text,
                x: bbox.x0 ?? bbox.left,
                y: bbox.y0 ?? bbox.top,
                width: (bbox.x1 ?? bbox.right) - (bbox.x0 ?? bbox.left),
                height: (bbox.y1 ?? bbox.bottom) - (bbox.y0 ?? bbox.top),
                confidence: (word.confidence || 0) / 100,
              });
            }
          }
        }
      }
    }
    // Fallback: build words from text + paragraphs
    else if (data.text && data.text.trim()) {
      const lines = data.text.split("\n").filter((l: string) => l.trim());
      let y = 40;
      for (const line of lines) {
        const lineWords = line.split(/\s+/).filter(Boolean);
        let x = 20;
        for (const w of lineWords) {
          words.push({
            text: w,
            x,
            y,
            width: w.length * 8,
            height: 20,
            confidence: 0.8,
          });
          x += w.length * 9;
        }
        y += 28;
      }
    }

    onProgress?.(95, "Building editable document");

    return {
      text: data.text || "",
      confidence: (data.confidence || 0) / 100,
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
    const prevCenter = prevWord.y + prevWord.height / 2;
    const wordCenter = word.y + word.height / 2;
    const sameLine = Math.abs(wordCenter - prevCenter) < Math.max(prevWord.height, word.height) * 0.6;

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
