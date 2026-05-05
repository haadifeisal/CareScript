import React, { useEffect, useMemo, useState } from "react";
import { Search, FileText, Download, Trash2 } from "lucide-react";
import type { SavedNote } from "../types";
import { safe, fmtDate } from "../utils/format";
import { generatePDF } from "../utils/pdf";
import { getNotes, saveNotes } from "../utils/storage";
import NoteModal from "../components/clinical/NoteModal";

export default function NotesPage() {
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [active, setActive] = useState<SavedNote | null>(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => {
      const patient = safe(n.patient).toLowerCase();
      const doctor = safe(n.doctor).toLowerCase();
      const date = safe(n.date).toLowerCase();
      return patient.includes(q) || doctor.includes(q) || date.includes(q);
    });
  }, [notes, query]);

  const openModal = (note: SavedNote) => {
    setActive(note);
    setEditedText(safe(note.ehr));
  };

  const closeModal = () => {
    setActive(null);
    setEditedText("");
  };

  const handleSave = () => {
    if (!active) return;
    const updated: SavedNote = {
      ...active,
      ehr: editedText,
      date: new Date().toISOString(),
    };
    const updatedNotes = notes.map((n) => (n.id === active.id ? updated : n));
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setActive(updated);
  };

  const handleDelete = (note: SavedNote) => {
    const confirmed = window.confirm(
      `Delete the note for "${note.patient || "Unknown"}"? This cannot be undone.`
    );
    if (!confirmed) return;
    const updated = notes.filter((n) => n.id !== note.id);
    setNotes(updated);
    saveNotes(updated);
    if (active?.id === note.id) closeModal();
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/80 px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
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

              <div className="mt-5">
                <span className="pill">
                  {filtered.length} {filtered.length === 1 ? "note" : "notes"}
                </span>
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
                                  onClick={() => openModal(note)}
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
                                <button
                                  type="button"
                                  onClick={() => handleDelete(note)}
                                  className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                  aria-label="Delete note"
                                >
                                  <Trash2 size={16} />
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
        <NoteModal
          note={active}
          editedText={editedText}
          onTextChange={setEditedText}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </>
  );
}
