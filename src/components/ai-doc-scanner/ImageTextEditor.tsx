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
    const text = line.map((w) => w.text).join(" ");
    const avgHeight = line.reduce((s, w) => s + w.height, 0) / line.length;

    return {
      id: `block-${idx}`,
      text,
      originalText: text,
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      fontSize: Math.round(avgHeight * 0.75),
      confidence: line.reduce((s, w) => s + w.confidence, 0) / line.length,
      edited: false,
    };
  });
}

function detectBackgroundColor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): string {
  try {
    const sampleSize = 4;
    const sx = Math.max(0, Math.floor(x - 5));
    const sy = Math.max(0, Math.floor(y - 5));
    const sw = Math.min(sampleSize, ctx.canvas.width - sx);
    const sh = Math.min(sampleSize, ctx.canvas.height - sy);
    if (sw <= 0 || sh <= 0) return "#ffffff";
    const data = ctx.getImageData(sx, sy, sw, sh).data;
    let r = 0, g = 0, b = 0;
    const pixels = sw * sh;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i]; g += data[i + 1]; b += data[i + 2];
    }
    return `rgb(${Math.round(r / pixels)},${Math.round(g / pixels)},${Math.round(b / pixels)})`;
  } catch {
    return "#ffffff";
  }
}

function detectTextColor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): string {
  try {
    const sx = Math.max(0, Math.floor(x + w * 0.1));
    const sy = Math.max(0, Math.floor(y + h * 0.1));
    const sw = Math.min(4, ctx.canvas.width - sx);
    const sh = Math.min(4, ctx.canvas.height - sy);
    if (sw <= 0 || sh <= 0) return "#000000";
    const data = ctx.getImageData(sx, sy, sw, sh).data;
    let r = 0, g = 0, b = 0;
    const pixels = sw * sh;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i]; g += data[i + 1]; b += data[i + 2];
    }
    const avg = (r + g + b) / (pixels * 3);
    return avg < 128 ? "#000000" : "#ffffff";
  } catch {
    return "#000000";
  }
}

export default function ImageTextEditor({ originalImage, words, pageWidth, pageHeight, onSave, onBack }: Props) {
  const [blocks, setBlocks] = useState<TextBlock[]>(() => groupWordsToBlocks(words));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => { imgRef.current = img; drawCanvas(); };
    img.src = originalImage;
  }, [originalImage]);

  useEffect(() => { drawCanvas(); }, [blocks, zoom, selectedId, editingId]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d")!;
    const w = pageWidth * zoom;
    const h = pageHeight * zoom;
    canvas.width = w;
    canvas.height = h;

    ctx.drawImage(img, 0, 0, w, h);

    for (const block of blocks) {
      const bx = block.x * zoom;
      const by = block.y * zoom;
      const bw = block.width * zoom;
      const bh = block.height * zoom;

      if (block.edited) {
        const bg = detectBackgroundColor(ctx, bx, by, bw, bh);
        ctx.fillStyle = bg;
        ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);

        const tc = detectTextColor(ctx, bx, by, bw, bh);
        const fs = block.fontSize * zoom;
        ctx.fillStyle = tc;
        ctx.font = `${fs}px Arial, sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillText(block.text, bx, by + (bh - fs) / 2);
      }

      if (block.id === selectedId && !editingId) {
        ctx.strokeStyle = "#c9f36c";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(bx - 3, by - 3, bw + 6, bh + 6);
        ctx.setLineDash([]);
      }
    }
  }, [blocks, zoom, selectedId, editingId, pageWidth, pageHeight]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (editingId) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / zoom;
    const my = (e.clientY - rect.top) / zoom;

    let found: string | null = null;
    for (const block of blocks) {
      if (mx >= block.x && mx <= block.x + block.width && my >= block.y && my <= block.y + block.height) {
        found = block.id;
        break;
      }
    }
    setSelectedId(found);
  }, [blocks, zoom, editingId]);

  const handleCanvasDoubleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / zoom;
    const my = (e.clientY - rect.top) / zoom;

    for (const block of blocks) {
      if (mx >= block.x && mx <= block.x + block.width && my >= block.y && my <= block.y + block.height) {
        setSelectedId(block.id);
        setEditingId(block.id);
        setTimeout(() => editInputRef.current?.focus(), 50);
        return;
      }
    }
  }, [blocks, zoom]);

  const handleTextEdit = useCallback((id: string, newText: string) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, text: newText, edited: newText !== b.originalText } : b
      )
    );
  }, []);

  const handleSave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL("image/png"));
  }, [onSave]);

  const editedCount = blocks.filter((b) => b.edited).length;

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-body)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[var(--bg-body)]/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">
            ← Back
          </button>
          <div className="w-px h-5 bg-white/10" />
          <h1 className="text-sm font-semibold text-[var(--text-primary)]">Edit Text in Original Image</h1>
          {editedCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#c9f36c]/10 text-[#c9f36c]">
              {editedCount} change{editedCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 text-sm transition-colors"
          >
            −
          </button>
          <span className="text-xs text-white/40 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 text-sm transition-colors"
          >
            +
          </button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-[#c9f36c] text-[#101412] text-sm font-semibold hover:bg-[#a8d94a] transition-colors"
          >
            Save Modified Image
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Canvas */}
        <div ref={containerRef} className="flex-1 overflow-auto p-8 flex items-center justify-center bg-black/20">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onDoubleClick={handleCanvasDoubleClick}
            className="shadow-2xl cursor-crosshair max-w-full max-h-full"
          />
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-white/10 bg-[var(--bg-body)] flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Text Elements</h2>
            <p className="text-xs text-white/40 mt-1">Double-click text on image to edit</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {blocks.length === 0 && (
              <p className="text-xs text-white/30 text-center py-8">No text detected in this image</p>
            )}
            {blocks.map((block) => (
              <div
                key={block.id}
                onClick={() => { setSelectedId(block.id); setEditingId(block.id); }}
                className={`p-2.5 rounded-lg cursor-pointer transition-all ${
                  block.id === selectedId
                    ? "bg-[#c9f36c]/10 border border-[#c9f36c]/30"
                    : "bg-white/5 border border-transparent hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-mono ${block.edited ? "text-[#c9f36c]" : "text-white/40"}`}>
                    {block.edited ? "edited" : "original"}
                  </span>
                  <span className="text-[10px] text-white/20">
                    {Math.round(block.confidence * 100)}%
                  </span>
                </div>
                {editingId === block.id ? (
                  <textarea
                    ref={editInputRef}
                    value={block.text}
                    onChange={(e) => handleTextEdit(block.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setEditingId(null); } }}
                    className="w-full bg-black/30 text-white text-sm p-1.5 rounded border border-[#c9f36c]/30 resize-none focus:outline-none focus:border-[#c9f36c]"
                    rows={2}
                  />
                ) : (
                  <p className="text-sm text-[var(--text-primary)] break-words leading-snug">
                    {block.text}
                  </p>
                )}
                {block.edited && (
                  <p className="text-[10px] text-white/25 mt-1 line-through">{block.originalText}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
