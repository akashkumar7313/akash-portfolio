"use client";

import { FiArrowLeft, FiType, FiTable, FiImage, FiTrash2, FiCopy, FiZoomIn, FiZoomOut, FiCornerUpLeft, FiCornerUpRight, FiDownload, FiSave, FiEye, FiEdit3, FiColumns, FiMoreVertical } from "react-icons/fi";
import type { ViewMode, EditorMode } from "@/features/ai-doc-scanner/types";
import { useState } from "react";

interface Props {
  editorMode: EditorMode;
  onModeChange: (m: EditorMode) => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onAddText: () => void;
  onAddTable: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onExportPDF: () => void;
  onExportPNG: () => void;
  hasSelection: boolean;
  saveStatus: "idle" | "saving" | "saved";
  onSave: () => void;
  onBack: () => void;
  onDeleteDoc: () => void;
  docName: string;
}

export default function EditorToolbar(props: Props) {
  const [showExport, setShowExport] = useState(false);
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="flex-shrink-0 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl">
      <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto">
        <button
          onClick={props.onBack}
          className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-primary)] opacity-60 hover:opacity-100 transition-all flex-shrink-0"
          title="Back"
        >
          <FiArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-medium text-[var(--text-primary)] opacity-40 truncate max-w-[120px] flex-shrink-0 hidden sm:block">
          {props.docName}
        </span>

        <div className="w-px h-6 bg-[var(--glass-border)] mx-1 flex-shrink-0" />

        <ToolGroup>
          <ToolBtn active={props.editorMode === "select"} onClick={() => props.onModeChange("select")} title="Select (V)">
            <FiEdit3 className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn active={props.editorMode === "text"} onClick={() => { props.onModeChange("text"); props.onAddText(); }} title="Add Text">
            <FiType className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn onClick={props.onAddTable} title="Add Table">
            <FiTable className="w-3.5 h-3.5" />
          </ToolBtn>
        </ToolGroup>

        <div className="w-px h-6 bg-[var(--glass-border)] mx-1 flex-shrink-0" />

        <ToolGroup>
          <ToolBtn onClick={props.onUndo} disabled={!props.canUndo} title="Undo (Ctrl+Z)">
            <FiCornerUpLeft className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn onClick={props.onRedo} disabled={!props.canRedo} title="Redo (Ctrl+Y)">
            <FiCornerUpRight className="w-3.5 h-3.5" />
          </ToolBtn>
        </ToolGroup>

        <div className="w-px h-6 bg-[var(--glass-border)] mx-1 flex-shrink-0 hidden sm:block" />

        <ToolGroup className="hidden sm:flex">
          <ToolBtn onClick={() => props.onZoomChange(Math.max(0.25, props.zoom - 0.25))} title="Zoom Out">
            <FiZoomOut className="w-3.5 h-3.5" />
          </ToolBtn>
          <span className="text-[10px] text-[var(--text-primary)] opacity-40 px-1 min-w-[32px] text-center">
            {Math.round(props.zoom * 100)}%
          </span>
          <ToolBtn onClick={() => props.onZoomChange(Math.min(4, props.zoom + 0.25))} title="Zoom In">
            <FiZoomIn className="w-3.5 h-3.5" />
          </ToolBtn>
        </ToolGroup>

        <div className="w-px h-6 bg-[var(--glass-border)] mx-1 flex-shrink-0 hidden sm:block" />

        <ToolGroup className="hidden md:flex">
          <ToolBtn active={props.viewMode === "original"} onClick={() => props.onViewModeChange("original")} title="Original">
            <FiImage className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn active={props.viewMode === "reconstructed"} onClick={() => props.onViewModeChange("reconstructed")} title="Reconstructed">
            <FiColumns className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn active={props.viewMode === "edit"} onClick={() => props.onViewModeChange("edit")} title="Edit">
            <FiEdit3 className="w-3.5 h-3.5" />
          </ToolBtn>
        </ToolGroup>

        <div className="flex-1" />

        {props.hasSelection && (
          <ToolGroup className="hidden sm:flex">
            <ToolBtn onClick={props.onDuplicate} title="Duplicate">
              <FiCopy className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn onClick={props.onDelete} title="Delete" className="text-red-400/60 hover:text-red-400">
              <FiTrash2 className="w-3.5 h-3.5" />
            </ToolBtn>
          </ToolGroup>
        )}

        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowExport(!showExport)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c9f36c]/10 text-[#c9f36c] text-xs font-medium hover:bg-[#c9f36c]/20 transition-all"
          >
            <FiDownload className="w-3.5 h-3.5" /> Export
          </button>
          {showExport && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowExport(false)} />
              <div className="absolute right-0 top-full mt-1 z-50 bg-[#1a1f1c] border border-white/10 rounded-xl shadow-2xl p-1 min-w-[140px]">
                <button onClick={() => { props.onExportPDF(); setShowExport(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 rounded-lg transition-colors">
                  <FiDownload className="w-4 h-4" /> Export PDF
                </button>
                <button onClick={() => { props.onExportPNG(); setShowExport(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 rounded-lg transition-colors">
                  <FiImage className="w-4 h-4" /> Export PNG
                </button>
              </div>
            </>
          )}
        </div>

        <div className="sm:hidden relative">
          <button onClick={() => setShowMore(!showMore)} className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-primary)]">
            <FiMoreVertical className="w-4 h-4" />
          </button>
          {showMore && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />
              <div className="absolute right-0 top-full mt-1 z-50 bg-[#1a1f1c] border border-white/10 rounded-xl shadow-2xl p-2 min-w-[180px]">
                <button onClick={() => { props.onExportPDF(); setShowMore(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 rounded-lg">
                  <FiDownload className="w-4 h-4" /> Export PDF
                </button>
                <button onClick={() => { props.onExportPNG(); setShowMore(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 rounded-lg">
                  <FiImage className="w-4 h-4" /> Export PNG
                </button>
                {props.hasSelection && (
                  <>
                    <div className="h-px bg-white/10 my-1" />
                    <button onClick={() => { props.onDuplicate(); setShowMore(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 rounded-lg">
                      <FiCopy className="w-4 h-4" /> Duplicate
                    </button>
                    <button onClick={() => { props.onDelete(); setShowMore(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400/70 hover:bg-white/5 rounded-lg">
                      <FiTrash2 className="w-4 h-4" /> Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <div className="text-[10px] text-[var(--text-primary)] opacity-30 flex-shrink-0 hidden lg:block">
          {props.saveStatus === "saving" ? "Saving..." : props.saveStatus === "saved" ? "Saved" : ""}
        </div>
      </div>
    </div>
  );
}

function ToolGroup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex items-center gap-0.5 ${className}`}>{children}</div>;
}

function ToolBtn({
  children,
  active,
  disabled,
  onClick,
  title,
  className = "",
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-all ${
        active
          ? "bg-[#c9f36c]/10 text-[#c9f36c]"
          : disabled
          ? "text-white/10 cursor-not-allowed"
          : `text-[var(--text-primary)] opacity-50 hover:opacity-100 hover:bg-white/5 ${className}`
      }`}
    >
      {children}
    </button>
  );
}
