import jsPDF from "jspdf";
import type { SavedNote } from "../types";
import { safe } from "./format";

export function generatePDF(note: SavedNote): void {
  const ehrText = safe(note?.ehr).trim();
  if (!ehrText) {
    alert("Missing EHR data");
    return;
  }

  const doc = new jsPDF();
  let y = 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("EHR CLINICAL NOTE", 105, y, { align: "center" });
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Patient: ${safe(note.patient) || "Unknown"}`, 20, y);
  doc.text(`Provider: ${safe(note.doctor) || "Unknown"}`, 120, y);
  y += 6;
  doc.text(`Date: ${safe(note.date) || ""}`, 20, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(doc.splitTextToSize(ehrText, 170), 20, y);

  doc.save(`${(note.patient || "EHR").replace(/\s+/g, "_")}_EHR.pdf`);
}
