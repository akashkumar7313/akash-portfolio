"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { DocumentModel, DocumentPage, DocumentElement, TextElement, TableElement, ViewMode, EditorMode } from "@/features/ai-doc-scanner/types";
import { useDocumentHistory } from "@/features/ai-doc-scanner/hooks/useDocumentHistory";
import { useAutosave } from "@/features/ai-doc-scanner/hooks/useAutosave";
import { exportAsPDF, exportAsPNG } from "@/features/ai-doc-scanner/services/exportService";
import { saveDocument, deleteDocument } from "@/features/ai-doc-scanner/services/storage";
import EditorToolbar from "./EditorToolbar";
import PageThumbnails from "./PageThumbnails";
import PropertiesPanel from "./PropertiesPanel";

interface Props {
  document: DocumentModel;
  onClose: () => void;
}

export default function DocumentEditor({ document: doc, onClose }: Props) {
  const [currentDoc, setCurrentDoc] = useState<DocumentModel>(doc);
  const {
    pages,
    pageIndex,
    setPages,
    setPageIndex,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useDocumentHistory(doc.pages);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [editorMode, setEditorMode] = useState<EditorMode>("select");
  const [zoom, setZoom] = useState(1);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const saveStatus = useAutosave({ ...currentDoc, pages }, true);

  useEffect(() => {
    setCurrentDoc((prev) => ({ ...prev, pages, updatedAt: Date.now() }));
  }, [pages]);

  const currentPage = pages[pageIndex] || pages[0];
  const selectedElement = currentPage?.elements.find((el) => el.id === selectedId);

  const updateElement = useCallback(
    (elementId: string, updates: Partial<DocumentElement>) => {
      setPages((prev) =>
        prev.map((page, i) => {
          if (i !== pageIndex) return page;
          return {
            ...page,
            elements: page.elements.map((el) =>
              el.id === elementId ? { ...el, ...updates } : el
            ) as DocumentElement[],
          };
        }) as DocumentPage[]
      );
    },
    [pageIndex, setPages]
  );

  const deleteElement = useCallback(
    (elementId: string) => {
      setPages((prev) =>
        prev.map((page, i) => {
          if (i !== pageIndex) return page;
          return {
            ...page,
            elements: page.elements.filter((el) => el.id !== elementId),
          };
        }) as DocumentPage[]
      );
      setSelectedId(null);
    },
    [pageIndex, setPages]
  );

  const addTextElement = useCallback(() => {
    if (!currentPage) return;
    const el: TextElement = {
      id: crypto.randomUUID(),
      type: "text",
      text: "New text",
      x: currentPage.width * 0.1,
      y: currentPage.height * 0.1,
      width: currentPage.width * 0.5,
      height: 30,
      fontSize: 14,
      color: "#000000",
      textAlign: "left",
    };
    setPages((prev) =>
      prev.map((page, i) => {
        if (i !== pageIndex) return page;
        return { ...page, elements: [...page.elements, el] };
      }) as DocumentPage[]
    );
    setSelectedId(el.id);
    setEditorMode("select");
  }, [currentPage, pageIndex, setPages]);

  const addTableElement = useCallback(() => {
    if (!currentPage) return;
    const el: TableElement = {
      id: crypto.randomUUID(),
      type: "table",
      x: currentPage.width * 0.1,
      y: currentPage.height * 0.3,
      width: currentPage.width * 0.8,
      height: 200,
      rows: 3,
      cols: 3,
      cells: Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => ({ text: "", fontSize: 12, textAlign: "left" as const }))
      ),
      borderColor: "#000000",
    };
    setPages((prev) =>
      prev.map((page, i) => {
        if (i !== pageIndex) return page;
        return { ...page, elements: [...page.elements, el] };
      }) as DocumentPage[]
    );
    setSelectedId(el.id);
    setEditorMode("select");
  }, [currentPage, pageIndex, setPages]);

  const duplicateElement = useCallback(
    (elementId: string) => {
      if (!currentPage) return;
      const el = currentPage.elements.find((e) => e.id === elementId);
      if (!el) return;
      const newEl = {
        ...JSON.parse(JSON.stringify(el)),
        id: crypto.randomUUID(),
        x: (el as any).x + 20,
        y: (el as any).y + 20,
      };
      setPages((prev) =>
        prev.map((page, i) => {
          if (i !== pageIndex) return page;
          return { ...page, elements: [...page.elements, newEl] };
        }) as DocumentPage[]
      );
      setSelectedId(newEl.id);
    },
    [currentPage, pageIndex, setPages]
  );

  const handlePageMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.stopPropagation();
      if (editorMode === "select") {
        setSelectedId(elementId);
        const el = currentPage?.elements.find((el) => el.id === elementId);
        if (el && "x" in el && "y" in el) {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            setIsDragging(true);
            setDragOffset({
              x: e.clientX - rect.left - (el as any).x * zoom,
              y: e.clientY - rect.top - (el as any).y * zoom,
            });
          }
        }
      }
    },
    [editorMode, currentPage, zoom]
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !selectedId || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - dragOffset.x) / zoom;
      const y = (e.clientY - rect.top - dragOffset.y) / zoom;
      const el = currentPage?.elements.find((el) => el.id === selectedId);
      if (el && "x" in el && "y" in el) {
        updateElement(selectedId, { x: Math.max(0, x), y: Math.max(0, y) } as any);
      }
    },
    [isDragging, selectedId, dragOffset, zoom, currentPage, updateElement]
  );

  const handleCanvasMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains("canvas-bg")) {
        setSelectedId(null);
        setEditingCell(null);
      }
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId && !editingCell) {
          e.preventDefault();
          deleteElement(selectedId);
        }
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
        }
        if (e.key === "y") {
          e.preventDefault();
          redo();
        }
      }
    },
    [selectedId, editingCell, deleteElement, undo, redo]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleExportPDF = useCallback(async () => {
    try {
      const blob = await exportAsPDF({ ...currentDoc, pages });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentDoc.name || "document"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  }, [currentDoc, pages]);

  const handleExportPNG = useCallback(async () => {
    if (!currentPage) return;
    try {
      const blob = await exportAsPNG(currentPage, 2);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentDoc.name || "document"}-page${pageIndex + 1}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  }, [currentPage, currentDoc.name, pageIndex]);

  const handleDeletePage = useCallback(() => {
    if (pages.length <= 1) return;
    const newPages = pages.filter((_, i) => i !== pageIndex);
    const newIdx = Math.min(pageIndex, newPages.length - 1);
    setPages(() => newPages as DocumentPage[], newIdx);
  }, [pages, pageIndex, setPages]);

  const handleDuplicatePage = useCallback(() => {
    if (!currentPage) return;
    const cloned = JSON.parse(JSON.stringify(currentPage));
    cloned.id = crypto.randomUUID();
    const newPages = [...pages.slice(0, pageIndex + 1), cloned, ...pages.slice(pageIndex + 1)];
    setPages(() => newPages as DocumentPage[], pageIndex + 1);
  }, [currentPage, pages, pageIndex, setPages]);

  const handleSaveAndClose = useCallback(async () => {
    const finalDoc = { ...currentDoc, pages, updatedAt: Date.now() };
    await saveDocument(finalDoc);
    onClose();
  }, [currentDoc, pages, onClose]);

  const handleDeleteDoc = useCallback(async () => {
    if (!confirm("Delete this document permanently?")) return;
    await deleteDocument(currentDoc.id);
    onClose();
  }, [currentDoc.id, onClose]);

  if (!currentPage) return null;

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-body)]">
      <EditorToolbar
        editorMode={editorMode}
        onModeChange={setEditorMode}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        zoom={zoom}
        onZoomChange={setZoom}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onAddText={addTextElement}
        onAddTable={addTableElement}
        onDelete={() => selectedId && deleteElement(selectedId)}
        onDuplicate={() => selectedId && duplicateElement(selectedId)}
        onExportPDF={handleExportPDF}
        onExportPNG={handleExportPNG}
        hasSelection={!!selectedId}
        saveStatus={saveStatus}
        onSave={handleSaveAndClose}
        onBack={onClose}
        onDeleteDoc={handleDeleteDoc}
        docName={currentDoc.name}
      />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <PageThumbnails
          pages={pages}
          currentPageIndex={pageIndex}
          onPageSelect={setPageIndex}
          onDeletePage={handleDeletePage}
          onDuplicatePage={handleDuplicatePage}
          canDelete={pages.length > 1}
        />

        <div
          className="flex-1 overflow-auto bg-[var(--bg-body)] relative"
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        >
          <div
            ref={canvasRef}
            className={`canvas-bg mx-auto my-8 relative ${viewMode === "edit" ? "cursor-crosshair" : ""}`}
            style={{
              width: currentPage.width * zoom,
              height: currentPage.height * zoom,
              background: "#ffffff",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              borderRadius: "4px",
              overflow: "hidden",
            }}
            onClick={handleCanvasClick}
          >
            {viewMode === "original" && currentPage.originalImage ? (
              <img
                src={currentPage.originalImage}
                alt="Original"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="relative w-full h-full" style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: currentPage.width, height: currentPage.height }}>
                {currentPage.elements.map((el) => {
                  const isSelected = el.id === selectedId;
                  return (
                    <div
                      key={el.id}
                      onMouseDown={(e) => handlePageMouseDown(e, el.id)}
                      className={`absolute ${editorMode === "select" ? "cursor-move" : ""} ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}
                      style={{
                        left: el.x,
                        top: el.y,
                        width: "width" in el ? el.width : undefined,
                        height: "height" in el ? el.height : undefined,
                      }}
                    >
                      {el.type === "text" && (
                        <TextElementComponent
                          element={el}
                          isSelected={isSelected}
                          isEditing={isSelected && editorMode === "text"}
                          onEdit={(text) => updateElement(el.id, { text })}
                          onResize={(w, h) => updateElement(el.id, { width: w, height: h })}
                        />
                      )}
                      {el.type === "table" && (
                        <TableElementComponent
                          element={el}
                          isSelected={isSelected}
                          editingCell={isSelected ? editingCell : null}
                          onCellEdit={(row, col, text) => {
                            const newCells = el.cells.map((r, ri) =>
                              r.map((c, ci) => (ri === row && ci === col ? { ...c, text } : c))
                            );
                            updateElement(el.id, { cells: newCells } as any);
                          }}
                          onCellClick={(row, col) => setEditingCell({ row, col })}
                          onAddRow={() => {
                            const newCells = [...el.cells, Array.from({ length: el.cols }, () => ({ text: "", fontSize: 12, textAlign: "left" as const }))];
                            updateElement(el.id, { cells: newCells, rows: el.rows + 1 } as any);
                          }}
                          onAddCol={() => {
                            const newCells = el.cells.map((r) => [...r, { text: "", fontSize: 12, textAlign: "left" as const }]);
                            updateElement(el.id, { cells: newCells, cols: el.cols + 1 } as any);
                          }}
                          onDelRow={() => {
                            if (el.rows <= 1) return;
                            const newCells = el.cells.slice(0, -1);
                            updateElement(el.id, { cells: newCells, rows: el.rows - 1 } as any);
                          }}
                          onDelCol={() => {
                            if (el.cols <= 1) return;
                            const newCells = el.cells.map((r) => r.slice(0, -1));
                            updateElement(el.id, { cells: newCells, cols: el.cols - 1 } as any);
                          }}
                        />
                      )}
                      {el.type === "image" && (
                        <img
                          src={el.src}
                          alt=""
                          className="w-full h-full object-contain pointer-events-none"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {selectedElement && editorMode === "select" && (
          <PropertiesPanel
            element={selectedElement}
            onUpdate={(updates) => updateElement(selectedId!, updates)}
            onDelete={() => deleteElement(selectedId!)}
            onDuplicate={() => duplicateElement(selectedId!)}
          />
        )}
      </div>
    </div>
  );
}

function TextElementComponent({
  element,
  isSelected,
  isEditing,
  onEdit,
}: {
  element: TextElement;
  isSelected: boolean;
  isEditing: boolean;
  onEdit: (text: string) => void;
  onResize: (w: number, h: number) => void;
}) {
  const [localText, setLocalText] = useState(element.text);

  useEffect(() => {
    setLocalText(element.text);
  }, [element.text]);

  if (isEditing) {
    return (
      <textarea
        autoFocus
        value={localText}
        onChange={(e) => {
          setLocalText(e.target.value);
          onEdit(e.target.value);
        }}
        onBlur={() => onEdit(localText)}
        className="w-full border-none outline-none resize-none bg-transparent"
        style={{
          fontSize: element.fontSize,
          color: element.color || "#000000",
          fontWeight: element.fontWeight || "normal",
          fontStyle: element.fontStyle || "normal",
          textDecoration: element.textDecoration || "none",
          textAlign: element.textAlign || "left",
          fontFamily: element.fontFamily || "sans-serif",
          lineHeight: 1.4,
          minHeight: element.height,
        }}
      />
    );
  }

  return (
    <div
      className={`w-full h-full overflow-hidden whitespace-pre-wrap ${isSelected ? "" : "pointer-events-none"}`}
      style={{
        fontSize: element.fontSize,
        color: element.color || "#000000",
        fontWeight: element.fontWeight || "normal",
        fontStyle: element.fontStyle || "normal",
        textDecoration: element.textDecoration || "none",
        textAlign: element.textAlign || "left",
        fontFamily: element.fontFamily || "sans-serif",
        lineHeight: 1.4,
        backgroundColor: element.backgroundColor || "transparent",
        cursor: "text",
      }}
    >
      {element.text}
    </div>
  );
}

function TableElementComponent({
  element,
  isSelected,
  editingCell,
  onCellEdit,
  onCellClick,
  onAddRow,
  onAddCol,
  onDelRow,
  onDelCol,
}: {
  element: TableElement;
  isSelected: boolean;
  editingCell: { row: number; col: number } | null;
  onCellEdit: (row: number, col: number, text: string) => void;
  onCellClick: (row: number, col: number) => void;
  onAddRow: () => void;
  onAddCol: () => void;
  onDelRow: () => void;
  onDelCol: () => void;
}) {
  const cellWidth = element.width / element.cols;
  const cellHeight = element.height / element.rows;

  return (
    <div className="w-full h-full relative">
      <table
        className="w-full h-full border-collapse"
        style={{ borderColor: element.borderColor || "#000" }}
      >
        <tbody>
          {element.cells.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`border p-0.5 ${editingCell?.row === ri && editingCell?.col === ci ? "bg-blue-50" : ""}`}
                  style={{
                    borderColor: element.borderColor || "#000",
                    borderWidth: "1px",
                    width: cellWidth,
                    height: cellHeight,
                    fontSize: cell.fontSize || 12,
                    fontWeight: cell.fontWeight || "normal",
                    textAlign: cell.textAlign || "left",
                    backgroundColor: cell.backgroundColor || "transparent",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCellClick(ri, ci);
                  }}
                >
                  {editingCell?.row === ri && editingCell?.col === ci ? (
                    <input
                      autoFocus
                      value={cell.text}
                      onChange={(e) => onCellEdit(ri, ci, e.target.value)}
                      onBlur={() => onCellClick(-1, -1)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") onCellClick(-1, -1);
                        if (e.key === "Tab") {
                          e.preventDefault();
                          const nextCol = ci + 1;
                          if (nextCol < element.cols) onCellClick(ri, nextCol);
                          else if (ri + 1 < element.rows) onCellClick(ri + 1, 0);
                        }
                      }}
                      className="w-full h-full border-none outline-none bg-transparent p-0.5"
                      style={{ fontSize: cell.fontSize || 12 }}
                    />
                  ) : (
                    <span className="block w-full h-full p-0.5">{cell.text}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {isSelected && (
        <div className="absolute -bottom-7 left-0 flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); onAddRow(); }} className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">+Row</button>
          <button onClick={(e) => { e.stopPropagation(); onDelRow(); }} className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded">-Row</button>
          <button onClick={(e) => { e.stopPropagation(); onAddCol(); }} className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">+Col</button>
          <button onClick={(e) => { e.stopPropagation(); onDelCol(); }} className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded">-Col</button>
        </div>
      )}
    </div>
  );
}
