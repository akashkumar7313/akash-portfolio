"use client";

import { FiPlus, FiCopy, FiTrash2 } from "react-icons/fi";
import type { DocumentPage } from "@/features/ai-doc-scanner/types";

interface Props {
  pages: DocumentPage[];
  currentPageIndex: number;
  onPageSelect: (index: number) => void;
  onDeletePage: () => void;
  onDuplicatePage: () => void;
  canDelete: boolean;
}

export default function PageThumbnails({
  pages,
  currentPageIndex,
  onPageSelect,
  onDeletePage,
  onDuplicatePage,
  canDelete,
}: Props) {
  return (
    <div className="w-20 flex-shrink-0 border-r border-[var(--glass-border)] bg-[var(--glass-bg)] overflow-y-auto hidden md:flex flex-col gap-2 p-2">
      {pages.map((page, i) => (
        <button
          key={page.id}
          onClick={() => onPageSelect(i)}
          className={`relative w-full aspect-[3/4] rounded-lg border overflow-hidden transition-all ${
            i === currentPageIndex
              ? "border-[#c9f36c] ring-1 ring-[#c9f36c]/50"
              : "border-[var(--glass-border)] hover:border-white/20"
          }`}
        >
          {page.originalImage ? (
            <img
              src={page.originalImage}
              alt={`Page ${i + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--text-primary)] opacity-20 text-xs">
              {i + 1}
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5">
            {i + 1}
          </div>
        </button>
      ))}

      <div className="flex flex-col gap-1 mt-1">
        <button
          onClick={onDuplicatePage}
          className="w-full aspect-square rounded-lg border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-primary)] opacity-30 hover:opacity-60 hover:bg-white/5 transition-all"
          title="Duplicate page"
        >
          <FiCopy className="w-3.5 h-3.5" />
        </button>
        {canDelete && (
          <button
            onClick={onDeletePage}
            className="w-full aspect-square rounded-lg border border-red-500/20 flex items-center justify-center text-red-400/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
            title="Delete page"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
