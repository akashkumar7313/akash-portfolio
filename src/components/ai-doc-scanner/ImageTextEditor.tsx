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

function detectColor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, isBg: boolean): string {
  try {
    const sx = Math.max(0, Math.floor(isBg ? x - 5 : x + w * 0.1));
    const sy = Math.max(0, Math.floor(isBg ? y - 5 : y + h * 0.1));
    const sw = Math.min(4, ctx.canvas.width - sx);
    const sh = Math.min(4, ctx.canvas.height - sy);
    if (sw <= 0 || sh <= 0) return isBg ? "#ffffff" : "#000000";
    const data = ctx.getImageData(sx, sy, sw, sh).data;
    let r = 0, g = 0, b = 0;
    const pixels = sw * sh;
    for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i + 1]; b += data[i + 2]; }
    if (isBg) return `rgb(${Math.round(r / pixels)},${Math.round(g / pixels)},${Math.round(b / pixels)})`;
    return ((r + g + b) / (pixels * 3)) < 128 ? "#000000" : "#ffffff";
  } catch {
    return isBg ? "#ffffff" : "#000000";
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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => { imgRef.current = img; drawCanvas(); };
    img.src = originalImage;
  }, [originalImage]);

  useEffect(() => { drawCanvas(); }, [blocks, zoom, selectedId]);

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
        ctx.fillStyle = detectColor(ctx, bx, by, bw, bh, true);
        ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
        ctx.fillStyle = detectColor(ctx, bx, by, bw, bh, false);
        ctx.font = `${block.fontSize * zoom}px Arial, sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillText(block.text, bx, by + (bh - block.fontSize * zoom) / 2);
      }

      if (block.id === selectedId) {
        ctx.strokeStyle = "#c9f36c";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(bx - 3, by - 3, bw + 6, bh + 6);
        ctx.setLineDash([]);
      }
    }
  }, [blocks, zoom, selectedId, pageWidth, pageHeight]);

  const findBlockAt = useCallback((mx: number, my: number): TextBlock | null => {
    for (const block of blocks) {
      if (mx >= block.x && mx <= block.x + block.width && my >= block.y && my <= block.y + block.height) {
        return block;
      }
    }
    return null;
  }, [blocks]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (editingId) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / zoom;
    const my = (e.clientY - rect.top) / zoom;
    setSelectedId(findBlockAt(mx, my)?.id || null);
  }, [zoom, editingId, findBlockAt]);

  const handleCanvasDoubleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / zoom;
    const my = (e.clientY - rect.top) / zoom;
    const block = findBlockAt(mx, my);
    if (block) {
      setSelectedId(block.id);
      setEditingId(block.id);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [zoom, findBlockAt]);

  const handleTextEdit = useCallback((id: string, newText: string) => {
    setBlocks((prev) => prev.map((b) => b.id === id ? { ...b, text: newText, edited: newText !== b.originalText } : b));
  }, []);

  const handleSave = useCallback(() => {
    if (!canvasRef.current) return;
    onSave(canvasRef.current.toDataURL("image/png"));
  }, [onSave]);

  const editingBlock = blocks.find((b) => b.id === editingId);
  const editedCount = blocks.filter((b) => b.edited).length;

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-body)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[var(--bg-body)]/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white transition-colors">← Back</button>
          <div className="w-px h-5 bg-white/10" />
          <h1 className="text-sm font-semibold text-[var(--text-primary)]">Edit Text in Original Image</h1>
          {editedCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#c9f36c]/10 text-[#c9f36c]">{editedCount} change{editedCount > 1 ? "s" : ""}</span>
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

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Canvas with inline editor overlay */}
        <div ref={containerRef} className="flex-1 overflow-auto p-8 flex items-center justify-center bg-black/20 relative">
          <div className="relative inline-block">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onDoubleClick={handleCanvasDoubleClick}
              className="shadow-2xl cursor-crosshair max-w-full max-h-full"
            />
            {/* Inline text input overlay on image */}
            {editingBlock && (
              <textarea
                ref={inputRef}
                value={editingBlock.text}
                onChange={(e) => handleTextEdit(editingBlock.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setEditingId(null); }
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setEditingId(null); }
                }}
                className="absolute border-2 border-[#c9f36c] rounded px-1 py-0.5 resize-none focus:outline-none overflow-hidden"
                style={{
                  left: editingBlock.x * zoom,
                  top: editingBlock.y * zoom,
                  width: Math.max(editingBlock.width * zoom, 100),
                  height: editingBlock.height * zoom + 8,
                  fontSize: editingBlock.fontSize * zoom,
                  lineHeight: `${editingBlock.fontSize * zoom}px`,
                  fontFamily: "Arial, sans-serif",
                  backgroundColor: "rgba(0,0,0,0.85)",
                  color: "#ffffff",
                }}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 border-l border-white/10 bg-[var(--bg-body)] flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Text Elements</h2>
            <p className="text-xs text-white/40 mt-1">Double-click text on image to edit directly</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {blocks.length === 0 && <p className="text-xs text-white/30 text-center py-8">No text detected</p>}
            {blocks.map((block) => (
              <div
                key={block.id}
                onClick={() => { setSelectedId(block.id); setEditingId(block.id); setTimeout(() => inputRef.current?.focus(), 50); }}
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  block.id === selectedId ? "bg-[#c9f36c]/10 border border-[#c9f36c]/30" : "bg-white/5 border border-transparent hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-[10px] font-mono ${block.edited ? "text-[#c9f36c]" : "text-white/40"}`}>
                    {block.edited ? "edited" : "original"}
                  </span>
                  <span className="text-[10px] text-white/20">{Math.round(block.confidence * 100)}%</span>
                </div>
                <p className={`text-sm break-words leading-snug ${block.id === editingId ? "text-[#c9f36c]" : "text-[var(--text-primary)]"}`}>
                  {block.text}
                </p>
                {block.edited && <p className="text-[10px] text-white/25 mt-0.5 line-through">{block.originalText}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
