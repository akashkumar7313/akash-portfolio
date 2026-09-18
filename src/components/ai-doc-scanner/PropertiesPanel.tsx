"use client";

import { FiTrash2, FiCopy } from "react-icons/fi";
import type { DocumentElement, TextElement, TableElement } from "@/features/ai-doc-scanner/types";

interface Props {
  element: DocumentElement;
  onUpdate: (updates: Partial<DocumentElement>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function PropertiesPanel({ element, onUpdate, onDelete, onDuplicate }: Props) {
  return (
    <div className="w-60 flex-shrink-0 border-l border-[var(--glass-border)] bg-[var(--glass-bg)] overflow-y-auto hidden lg:block">
      <div className="p-3 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider opacity-60">
            Properties
          </h3>
          <div className="flex gap-1">
            <button onClick={onDuplicate} className="p-1.5 rounded hover:bg-white/5 text-[var(--text-primary)] opacity-40 hover:opacity-80" title="Duplicate">
              <FiCopy className="w-3 h-3" />
            </button>
            <button onClick={onDelete} className="p-1.5 rounded hover:bg-red-500/10 text-red-400/50 hover:text-red-400" title="Delete">
              <FiTrash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
          <p className="text-[10px] text-[var(--text-primary)] opacity-40 uppercase tracking-wider mb-2">Type</p>
          <p className="text-xs text-[var(--text-primary)] font-medium capitalize">{element.type}</p>
        </div>

        {"x" in element && (
          <div className="grid grid-cols-2 gap-2">
            <PropInput label="X" value={Math.round((element as any).x)} onChange={(v) => onUpdate({ x: v } as any)} />
            <PropInput label="Y" value={Math.round((element as any).y)} onChange={(v) => onUpdate({ y: v } as any)} />
            {"width" in element && <PropInput label="W" value={Math.round((element as any).width)} onChange={(v) => onUpdate({ width: v } as any)} />}
            {"height" in element && <PropInput label="H" value={Math.round((element as any).height)} onChange={(v) => onUpdate({ height: v } as any)} />}
          </div>
        )}

        {element.type === "text" && (
          <TextProperties element={element as TextElement} onUpdate={onUpdate} />
        )}

        {element.type === "table" && (
          <TableProperties element={element as TableElement} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
}

function PropInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] text-[var(--text-primary)] opacity-40 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-2 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[#c9f36c]/50"
      />
    </div>
  );
}

function TextProperties({
  element,
  onUpdate,
}: {
  element: TextElement;
  onUpdate: (updates: Partial<DocumentElement>) => void;
}) {
  return (
    <>
      <div>
        <label className="block text-[10px] text-[var(--text-primary)] opacity-40 mb-1">Font Size</label>
        <input
          type="number"
          value={element.fontSize}
          onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
          className="w-full px-2 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[#c9f36c]/50"
        />
      </div>

      <div>
        <label className="block text-[10px] text-[var(--text-primary)] opacity-40 mb-1">Text</label>
        <textarea
          value={element.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          rows={3}
          className="w-full px-2 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[#c9f36c]/50 resize-none"
        />
      </div>

      <div>
        <label className="block text-[10px] text-[var(--text-primary)] opacity-40 mb-1">Style</label>
        <div className="flex gap-1">
          <button
            onClick={() => onUpdate({ fontWeight: element.fontWeight === "bold" ? "normal" : "bold" })}
            className={`px-2 py-1 rounded text-xs font-bold transition-all ${
              element.fontWeight === "bold" ? "bg-[#c9f36c]/10 text-[#c9f36c]" : "bg-white/5 text-white/40"
            }`}
          >
            B
          </button>
          <button
            onClick={() => onUpdate({ fontStyle: element.fontStyle === "italic" ? "normal" : "italic" })}
            className={`px-2 py-1 rounded text-xs italic transition-all ${
              element.fontStyle === "italic" ? "bg-[#c9f36c]/10 text-[#c9f36c]" : "bg-white/5 text-white/40"
            }`}
          >
            I
          </button>
          <button
            onClick={() => onUpdate({ textDecoration: element.textDecoration === "underline" ? "none" : "underline" })}
            className={`px-2 py-1 rounded text-xs underline transition-all ${
              element.textDecoration === "underline" ? "bg-[#c9f36c]/10 text-[#c9f36c]" : "bg-white/5 text-white/40"
            }`}
          >
            U
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[10px] text-[var(--text-primary)] opacity-40 mb-1">Align</label>
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              onClick={() => onUpdate({ textAlign: align })}
              className={`px-2 py-1 rounded text-[10px] capitalize transition-all ${
                element.textAlign === align ? "bg-[#c9f36c]/10 text-[#c9f36c]" : "bg-white/5 text-white/40"
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[10px] text-[var(--text-primary)] opacity-40 mb-1">Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.color || "#000000"}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-8 h-8 rounded border border-white/10 cursor-pointer"
          />
          <span className="text-xs text-[var(--text-primary)] opacity-40">{element.color || "#000000"}</span>
        </div>
      </div>
    </>
  );
}

function TableProperties({
  element,
  onUpdate,
}: {
  element: TableElement;
  onUpdate: (updates: Partial<DocumentElement>) => void;
}) {
  return (
    <>
      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
        <p className="text-[10px] text-[var(--text-primary)] opacity-40 uppercase tracking-wider mb-1">Dimensions</p>
        <p className="text-xs text-[var(--text-primary)]">{element.rows} rows x {element.cols} cols</p>
      </div>
      <div>
        <label className="block text-[10px] text-[var(--text-primary)] opacity-40 mb-1">Border Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.borderColor || "#000000"}
            onChange={(e) => onUpdate({ borderColor: e.target.value })}
            className="w-8 h-8 rounded border border-white/10 cursor-pointer"
          />
          <span className="text-xs text-[var(--text-primary)] opacity-40">{element.borderColor || "#000000"}</span>
        </div>
      </div>
    </>
  );
}
