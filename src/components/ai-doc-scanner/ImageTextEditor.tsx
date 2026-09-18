"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { OCRWord } from "@/features/ai-doc-scanner/types";

interface TextBlock {
  id: string;
  text: string;
  originalText: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  confidence: number;
  edited: boolean;
}

interface Props {
  originalImage: string;
  words: OCRWord[];
  pageWidth: number;
  pageHeight: number;
  onSave: (modifiedImageUrl: string) => void;
  onBack: () => void;
}

function groupWordsToBlocks(words: OCRWord[]): TextBlock[] {
  if (words.length === 0) return [];
  const sorted = [...words].sort((a, b) => a.y - b.y || a.x - b.x);
  const lines: OCRWord[][] = [];
  let currentLine: OCRWord[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const word = sorted[i];
    const prev = currentLine[currentLine.length - 1];
    const prevCenter = prev.y + prev.height / 2;
    const wordCenter = word.y + word.height / 2;
    if (Math.abs(wordCenter - prevCenter) < Math.max(prev.height, word.height) * 0.6) {
      currentLine.push(word);
    } else {
      lines.push(currentLine);
      currentLine = [word];
    }
  }
  lines.push(currentLine);

  return lines.map((line, idx) => {
    const minX = Math.min(...line.map((w) => w.x));
    const minY = Math.min(...line.map((w) => w.y));
    const maxX = Math.max(...line.map((w) => w.x + w.width));
    const maxY = Math.max(...line.map((w) => w.y + w.height));
    return {
      id: `block-${idx}`,
      text: line.map((w) => w.text).join(" "),
      originalText: line.map((w) => w.text).join(" "),
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      fontSize: Math.round(line.reduce((s, w) => s + w.height, 0) / line.length * 0.75),
      confidence: line.reduce((s, w) => s + w.confidence, 0) / line.length,
      edited: false,
    };
  });
}

function sampleColor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, inside: boolean): string {
  try {
    const sx = Math.max(0, Math.floor(inside ? x + w * 0.15 : x - 5));
    const sy = Math.max(0, Math.floor(inside ? y + h * 0.15 : y - 5));
    const sw = Math.min(6, ctx.canvas.width - sx);
    const sh = Math.min(6, ctx.canvas.height - sy);
    if (sw <= 0 || sh <= 0) return inside ? "#000000" : "#ffffff";
    const data = ctx.getImageData(sx, sy, sw, sh).data;
    let r = 0, g = 0, b = 0;
    const px = sw * sh;
    for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i + 1]; b += data[i + 2]; }
    if (inside) return ((r + g + b) / (px * 3)) < 128 ? "#000000" : "#ffffff";
    return `rgb(${Math.round(r / px)},${Math.round(g / px)},${Math.round(b / px)})`;
  } catch {
    return inside ? "#000000" : "#ffffff";
  }
}

export default function ImageTextEditor({ originalImage, words, pageWidth, pageHeight, onSave, onBack }: Props) {
  const [blocks, setBlocks] = useState<TextBlock[]>(() => groupWordsToBlocks(words));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => { imgRef.current = img; drawCanvas(); };
    img.src = originalImage;
  }, [originalImage]);

  useEffect(() => { drawCanvas(); }, [blocks, zoom]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = pageWidth * zoom;
    canvas.height = pageHeight * zoom;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    for (const block of blocks) {
      const bx = block.x * zoom, by = block.y * zoom, bw = block.width * zoom, bh = block.height * zoom;

      if (block.edited) {
        // Cover old text with background
        ctx.fillStyle = sampleColor(ctx, bx, by, bw, bh, false);
        ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
        // Draw new text
        ctx.fillStyle = sampleColor(ctx, bx, by, bw, bh, true);
        ctx.font = `${block.fontSize * zoom}px Arial, sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillText(block.text, bx, by + (bh - block.fontSize * zoom) / 2);
      }

      // Highlight on hover / selection
      if (block.id === editingId) {
        ctx.fillStyle = "rgba(201,243,108,0.15)";
        ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
      }
    }
  }, [blocks, zoom, editingId, pageWidth, pageHeight]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / zoom;
    const my = (e.clientY - rect.top) / zoom;

    for (const block of blocks) {
      if (mx >= block.x && mx <= block.x + block.width && my >= block.y && my <= block.y + block.height) {
        setEditingId(block.id);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
          }
        }, 30);
        return;
      }
    }
    setEditingId(null);
  }, [blocks, zoom]);

  const handleTextChange = useCallback((id: string, newText: string) => {
    setBlocks((prev) => prev.map((b) => b.id === id ? { ...b, text: newText, edited: newText !== b.originalText } : b));
  }, []);

  const handleSave = useCallback(() => {
    if (!canvasRef.current) return;
    onSave(canvasRef.current.toDataURL("image/png"));
  }, [onSave]);

  const editingBlock = blocks.find((b) => b.id === editingId);
  const editedCount = blocks.filter((b) => b.edited).length;

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl shrink-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Back</button>
          <div className="w-px h-5 bg-white/10" />
          <h1 className="text-sm font-semibold text-white">Edit Text on Image</h1>
          {editedCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#c9f36c]/10 text-[#c9f36c]">{editedCount} changed</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 text-sm">−</button>
          <span className="text-xs text-white/40 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(3, z + 0.25))} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 text-sm">+</button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button onClick={handleSave} className="px-4 py-1.5 rounded-lg bg-[#c9f36c] text-[#101412] text-sm font-semibold hover:bg-[#a8d94a] transition-colors">Save Modified Image</button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Image canvas - click text to edit */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-black/30 p-8">
          <div className="relative inline-block">
            {/* Canvas draws the image + edited text */}
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="shadow-2xl max-w-full max-h-full"
              style={{ cursor: editingId ? "text" : "pointer" }}
            />

            {/* Transparent input overlay - sits exactly on the text being edited */}
            {editingBlock && (
              <input
                ref={inputRef}
                type="text"
                value={editingBlock.text}
                onChange={(e) => handleTextChange(editingBlock.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setEditingId(null);
                  if (e.key === "Enter") { e.preventDefault(); setEditingId(null); }
                  if (e.key === "Tab") {
                    e.preventDefault();
                    const idx = blocks.findIndex((b) => b.id === editingBlock.id);
                    const next = blocks[(idx + 1) % blocks.length];
                    setEditingId(next.id);
                    setTimeout(() => inputRef.current?.focus(), 30);
                  }
                }}
                className="absolute border-none outline-none bg-transparent"
                style={{
                  left: editingBlock.x * zoom - 2,
                  top: editingBlock.y * zoom - 2,
                  width: Math.max(editingBlock.width * zoom + 4, 60),
                  height: editingBlock.height * zoom + 4,
                  fontSize: editingBlock.fontSize * zoom,
                  lineHeight: `${editingBlock.height * zoom + 4}px`,
                  fontFamily: "Arial, sans-serif",
                  color: "transparent",
                  caretColor: "#c9f36c",
                  padding: "0 2px",
                  margin: 0,
                }}
              />
            )}
          </div>
        </div>

        {/* Sidebar - text list */}
        <div className="w-72 border-l border-white/10 bg-[#0a0a0a] flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white">Detected Text</h2>
            <p className="text-xs text-white/40 mt-1">Click text on image to edit in place</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {blocks.map((block) => (
              <div
                key={block.id}
                onClick={() => { setEditingId(block.id); setTimeout(() => inputRef.current?.focus(), 30); }}
                className={`px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                  block.id === editingId
                    ? "bg-[#c9f36c]/10 text-[#c9f36c] border border-[#c9f36c]/30"
                    : block.edited
                    ? "bg-white/5 text-[#c9f36c]/70 border border-transparent"
                    : "bg-white/5 text-white/70 border border-transparent hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{block.text}</span>
                  {block.edited && <span className="text-[10px] text-[#c9f36c] ml-2 shrink-0">edited</span>}
                </div>
                {block.edited && <p className="text-[10px] text-white/25 mt-0.5 line-through truncate">{block.originalText}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
