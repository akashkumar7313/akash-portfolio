import { useState, useCallback, useRef } from "react";
import type { DocumentPage, HistoryEntry } from "../types";

const MAX_HISTORY = 50;

export function useDocumentHistory(initialPages: DocumentPage[]) {
  const [pages, setPages] = useState<DocumentPage[]>(initialPages);
  const [pageIndex, setPageIndex] = useState(0);
  const historyRef = useRef<HistoryEntry[]>([{ pages: initialPages, pageIndex: 0 }]);
  const historyPosRef = useRef(0);

  const pushHistory = useCallback((newPages: DocumentPage[], newPageIndex: number) => {
    const pos = historyPosRef.current;
    const newEntry: HistoryEntry = {
      pages: JSON.parse(JSON.stringify(newPages)),
      pageIndex: newPageIndex,
    };

    const history = historyRef.current.slice(0, pos + 1);
    history.push(newEntry);

    if (history.length > MAX_HISTORY) {
      history.shift();
    }

    historyRef.current = history;
    historyPosRef.current = history.length - 1;
    setPages(newPages);
    setPageIndex(newPageIndex);
  }, []);

  const updatePages = useCallback(
    (updater: (pages: DocumentPage[]) => DocumentPage[], newPageIndex?: number) => {
      setPages((prev) => {
        const newPages = updater(prev);
        const idx = newPageIndex !== undefined ? newPageIndex : pageIndex;
        pushHistory(newPages, idx);
        return newPages;
      });
    },
    [pageIndex, pushHistory]
  );

  const canUndo = historyPosRef.current > 0;
  const canRedo = historyPosRef.current < historyRef.current.length - 1;

  const undo = useCallback(() => {
    if (historyPosRef.current <= 0) return;
    historyPosRef.current--;
    const entry = historyRef.current[historyPosRef.current];
    setPages(entry.pages);
    setPageIndex(entry.pageIndex);
  }, []);

  const redo = useCallback(() => {
    if (historyPosRef.current >= historyRef.current.length - 1) return;
    historyPosRef.current++;
    const entry = historyRef.current[historyPosRef.current];
    setPages(entry.pages);
    setPageIndex(entry.pageIndex);
  }, []);

  const setPageIndexSafe = useCallback((idx: number) => {
    setPageIndex(idx);
  }, []);

  return {
    pages,
    pageIndex,
    setPages: updatePages,
    setPageIndex: setPageIndexSafe,
    canUndo,
    canRedo,
    undo,
    redo,
  };
}
