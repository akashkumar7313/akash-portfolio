import { jsPDF } from "jspdf";
import type { DocumentModel, DocumentPage, DocumentElement, TextElement, TableElement, ImageElement } from "../types";

export async function exportAsPDF(doc: DocumentModel): Promise<Blob> {
  const firstPage = doc.pages[0];
  if (!firstPage) throw new Error("No pages to export");

  const pdf = new jsPDF({
    orientation: firstPage.width > firstPage.height ? "landscape" : "portrait",
    unit: "px",
    format: [firstPage.width, firstPage.height],
  });

  for (let i = 0; i < doc.pages.length; i++) {
    if (i > 0) {
      const page = doc.pages[i];
      pdf.addPage([page.width, page.height], page.width > page.height ? "landscape" : "portrait");
    }
    renderPageToPDF(pdf, doc.pages[i]);
  }

  return pdf.output("blob");
}

function renderPageToPDF(pdf: jsPDF, page: DocumentPage) {
  for (const el of page.elements) {
    switch (el.type) {
      case "text":
        renderTextToPDF(pdf, el);
        break;
      case "table":
        renderTableToPDF(pdf, el);
        break;
      case "image":
        renderImageToPDF(pdf, el);
        break;
    }
  }
}

function renderTextToPDF(pdf: jsPDF, el: TextElement) {
  const fontSize = el.fontSize || 14;
  const style: string[] = [];
  if (el.fontWeight === "bold") style.push("bold");
  if (el.fontStyle === "italic") style.push("italic");

  pdf.setFontSize(fontSize);
  if (style.includes("bold") && style.includes("italic")) {
    pdf.setFont("helvetica", "bolditalic");
  } else if (style.includes("bold")) {
    pdf.setFont("helvetica", "bold");
  } else if (style.includes("italic")) {
    pdf.setFont("helvetica", "italic");
  } else {
    pdf.setFont("helvetica", "normal");
  }

  if (el.color) {
    const r = parseInt(el.color.slice(1, 3), 16);
    const g = parseInt(el.color.slice(3, 5), 16);
    const b = parseInt(el.color.slice(5, 7), 16);
    pdf.setTextColor(r, g, b);
  } else {
    pdf.setTextColor(0, 0, 0);
  }

  const align = el.textAlign || "left";
  pdf.text(el.text, el.x, el.y + fontSize, {
    align: align as "left" | "center" | "right",
    maxWidth: el.width,
  });
}

function renderTableToPDF(pdf: jsPDF, el: TableElement) {
  const cellWidth = el.width / el.cols;
  const cellHeight = el.height / el.rows;

  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.5);

  for (let r = 0; r < el.rows; r++) {
    for (let c = 0; c < el.cols; c++) {
      const x = el.x + c * cellWidth;
      const y = el.y + r * cellHeight;
      pdf.rect(x, y, cellWidth, cellHeight);

      const cell = el.cells[r]?.[c];
      if (cell?.text) {
        pdf.setFontSize(cell.fontSize || 10);
        pdf.setFont("helvetica", cell.fontWeight === "bold" ? "bold" : "normal");
        pdf.setTextColor(0, 0, 0);
        pdf.text(cell.text, x + 2, y + cellHeight - 3, {
          maxWidth: cellWidth - 4,
        });
      }
    }
  }
}

function renderImageToPDF(pdf: jsPDF, el: ImageElement) {
  try {
    pdf.addImage(el.src, "PNG", el.x, el.y, el.width, el.height);
  } catch {
    // skip if image fails
  }
}

export async function exportAsPNG(
  page: DocumentPage,
  scaleFactor: number = 1
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = page.width * scaleFactor;
  canvas.height = page.height * scaleFactor;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(scaleFactor, scaleFactor);

  for (const el of page.elements) {
    switch (el.type) {
      case "text":
        drawTextOnCanvas(ctx, el);
        break;
      case "table":
        drawTableOnCanvas(ctx, el);
        break;
      case "image":
        await drawImageOnCanvas(ctx, el);
        break;
    }
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

function drawTextOnCanvas(ctx: CanvasRenderingContext2D, el: TextElement) {
  const weight = el.fontWeight || "normal";
  const style = el.fontStyle || "normal";
  ctx.font = `${style} ${weight} ${el.fontSize}px ${el.fontFamily || "sans-serif"}`;
  ctx.fillStyle = el.color || "#000000";
  ctx.textAlign = el.textAlign || "left";
  ctx.textBaseline = "top";

  const x =
    el.textAlign === "center"
      ? el.x + el.width / 2
      : el.textAlign === "right"
      ? el.x + el.width
      : el.x;
  ctx.fillText(el.text, x, el.y, el.width);
}

function drawTableOnCanvas(ctx: CanvasRenderingContext2D, el: TableElement) {
  const cellWidth = el.width / el.cols;
  const cellHeight = el.height / el.rows;

  ctx.strokeStyle = el.borderColor || "#000000";
  ctx.lineWidth = 0.5;

  for (let r = 0; r < el.rows; r++) {
    for (let c = 0; c < el.cols; c++) {
      const x = el.x + c * cellWidth;
      const y = el.y + r * cellHeight;
      ctx.strokeRect(x, y, cellWidth, cellHeight);

      const cell = el.cells[r]?.[c];
      if (cell?.text) {
        ctx.font = `${cell.fontWeight || "normal"} ${cell.fontSize || 10}px sans-serif`;
        ctx.fillStyle = "#000000";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(cell.text, x + 3, y + cellHeight / 2, cellWidth - 6);
      }
    }
  }
}

async function drawImageOnCanvas(
  ctx: CanvasRenderingContext2D,
  el: ImageElement
) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, el.x, el.y, el.width, el.height);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = el.src;
  });
}
