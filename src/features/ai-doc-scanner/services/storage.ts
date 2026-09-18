import { openDB, IDBPDatabase } from "idb";
import type { DocumentModel } from "../types";

const DB_NAME = "ai-doc-scanner";
const DB_VERSION = 1;
const DOC_STORE = "documents";
const FILE_STORE = "files";

let dbInstance: IDBPDatabase | null = null;

async function getDB(): Promise<IDBPDatabase> {
  if (dbInstance) return dbInstance;
  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(DOC_STORE)) {
        db.createObjectStore(DOC_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(FILE_STORE)) {
        db.createObjectStore(FILE_STORE);
      }
    },
  });
  return dbInstance;
}

export async function saveDocument(doc: DocumentModel): Promise<void> {
  const db = await getDB();
  const record = { ...doc, updatedAt: Date.now() };
  await db.put(DOC_STORE, record);
}

export async function getDocument(id: string): Promise<DocumentModel | undefined> {
  const db = await getDB();
  return db.get(DOC_STORE, id);
}

export async function getAllDocuments(): Promise<DocumentModel[]> {
  const db = await getDB();
  return db.getAll(DOC_STORE);
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(DOC_STORE, id);
}

export async function saveFile(key: string, blob: Blob | string): Promise<void> {
  const db = await getDB();
  await db.put(FILE_STORE, blob, key);
}

export async function getFile(key: string): Promise<Blob | string | undefined> {
  const db = await getDB();
  return db.get(FILE_STORE, key);
}

export async function deleteFile(key: string): Promise<void> {
  const db = await getDB();
  await db.delete(FILE_STORE, key);
}
