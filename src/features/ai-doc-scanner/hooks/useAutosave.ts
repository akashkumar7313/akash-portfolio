import { useState, useCallback, useEffect, useRef } from "react";
import type { DocumentModel } from "../types";
import { saveDocument, getDocument, getAllDocuments } from "../services/storage";

export function useAutosave(doc: DocumentModel | null, enabled: boolean = true) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const docRef = useRef(doc);

  useEffect(() => {
    docRef.current = doc;
  }, [doc]);

  useEffect(() => {
    if (!enabled || !doc) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        await saveDocument(docRef.current!);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("idle");
      }
    }, 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [doc, enabled]);

  return saveStatus;
}

export function useDocumentLoader() {
  const [documents, setDocuments] = useState<DocumentModel[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const docs = await getAllDocuments();
      setDocuments(docs.sort((a, b) => b.updatedAt - a.updatedAt));
    } catch {
      setDocuments([]);
    }
    setLoading(false);
  }, []);

  const loadOne = useCallback(async (id: string): Promise<DocumentModel | undefined> => {
    return getDocument(id);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return { documents, loading, loadAll, loadOne };
}
