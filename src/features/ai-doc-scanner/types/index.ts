export interface DocumentModel {
  id: string;
  name: string;
  pages: DocumentPage[];
  createdAt: number;
  updatedAt: number;
}

export interface DocumentPage {
  id: string;
  width: number;
  height: number;
  elements: DocumentElement[];
  originalImage?: string;
}

export type DocumentElement =
  | TextElement
  | ImageElement
  | TableElement
  | LineElement;

export interface TextElement {
  id: string;
  type: "text";
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
}

export interface ImageElement {
  id: string;
  type: "image";
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TableElement {
  id: string;
  type: "table";
  x: number;
  y: number;
  width: number;
  height: number;
  rows: number;
  cols: number;
  cells: TableCell[][];
  borderColor?: string;
}

export interface TableCell {
  text: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
  backgroundColor?: string;
}

export interface LineElement {
  id: string;
  type: "line";
  x: number;
  y: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke?: string;
  strokeWidth?: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  words: OCRWord[];
}

export interface OCRWord {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export interface ProcessingState {
  status: "idle" | "reading" | "rendering" | "ocr" | "layout" | "building" | "done" | "error";
  progress: number;
  message: string;
  error?: string;
}

export type EditorMode = "select" | "text" | "image" | "table" | "line";

export type ViewMode = "original" | "reconstructed" | "edit";

export interface HistoryEntry {
  pages: DocumentPage[];
  pageIndex: number;
}
