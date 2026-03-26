import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import {
  Search,
  FileText,
  Download,
  X,
  Calendar,
  User,
  Stethoscope,
  Save,
} from "lucide-react";

type SavedNote = {
  id: number;
  patient: string;
  date: string;
  doctor: string;
  ehr: string;
  meta?: any;
};

const STORAGE_KEY = "ehrNotes";

const safe = (v: any) =>
  typeof v === "string" ? v : v == null ? "" : String(v);

const fmtDate = (s: string) => {
  const d = new Date(s);
  return isNaN(d.getTime())
    ? safe(s)
    : d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const generatePDF = (note: SavedNote) => {
  const ehrText = safe(note?.ehr).trim();
  if (!ehrText) return alert("Missing EHR data");

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
};

export default function Transcriptions() {
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [active, setActive] = useState<SavedNote | null>(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setNotes(Array.isArray(raw) ? raw : []);
    } catch {
      setNotes([]);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;

    return notes.filter((n) => {
      const patient = safe(n.patient).toLowerCase();
      const doctor = safe(n.doctor).toLowerCase();
      const date = safe(n.date).toLowerCase();
      return (
        patient.includes(q) || doctor.includes(q) || date.includes(q)
      );
    });
  }, [notes, query]);

  const openViewModal = (note: SavedNote) => {
    setActive(note);
    setEditedText(safe(note.ehr));
  };

  const closeModal = () => {
    setActive(null);
    setEditedText("");
  };

  const handleSave = () => {
    if (!active) return;

    const updatedNote: SavedNote = {
      ...active,
      ehr: editedText,
      date: new Date().toISOString(),
    };

    const updatedNotes = notes.map((note) =>
      note.id === active.id ? updatedNote : note
    );

    setNotes(updatedNotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    setActive(updatedNote);
  };

  const hasChanges = active ? editedText !== safe(active.ehr) : false;

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/80 px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                      <FileText size={20} />
                    </div>

                    <div>
                      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Notes
                      </h1>
                      <p className="mt-1 text-sm text-slate-500">
                        Search, review, edit, and export clinical notes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex w-full max-w-xl items-center gap-3">
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search patient, doctor, or date..."
                      className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {filtered.length} {filtered.length === 1 ? "note" : "notes"}
                </div>
              </div>
            </div>

            <div className="px-4 py-4 sm:px-8 sm:py-6">
              {filtered.length === 0 ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
                    <FileText size={22} />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-slate-900">
                    No saved notes found
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-slate-500">
                    Try changing your search, or create a new transcription to
                    generate a clinical note.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Date
                          </th>
                          <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Patient
                          </th>
                          <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Provider
                          </th>
                          <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200 bg-white">
                        {filtered.map((note) => (
                          <tr
                            key={note.id}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                              {fmtDate(note.date)}
                            </td>

                            <td className="px-5 py-4">
                              <div className="font-medium text-slate-900">
                                {note.patient || "Unknown"}
                              </div>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-700">
                              {note.doctor || "Unknown"}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openViewModal(note)}
                                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                >
                                  <FileText size={16} />
                                  View
                                </button>

                                <button
                                  type="button"
                                  onClick={() => generatePDF(note)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                  <Download size={16} />
                                  PDF
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 sm:px-7">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold tracking-tight text-slate-900">
                  {active.patient || "Clinical Note"}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
                    <Calendar size={14} />
                    {fmtDate(active.date)}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
                    <Stethoscope size={14} />
                    {active.doctor || "Unknown"}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
                    <User size={14} />
                    {active.patient || "Unknown"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-7">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="min-h-[55vh] w-full resize-none rounded-xl border-0 bg-white p-5 text-sm leading-7 text-slate-800 outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
                  placeholder="Clinical note..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div className="text-sm text-slate-500">
                {hasChanges
                  ? "You have unsaved changes."
                  : "All changes saved."}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {hasChanges && (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    generatePDF({
                      ...active,
                      ehr: editedText,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Download size={16} />
                  Download PDF
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}