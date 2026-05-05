import React from "react";
import {
  X,
  Calendar,
  User,
  Stethoscope,
  Download,
  Save,
} from "lucide-react";
import type { SavedNote } from "../../types";
import { safe, fmtDate } from "../../utils/format";
import { generatePDF } from "../../utils/pdf";

type Props = {
  note: SavedNote;
  editedText: string;
  onTextChange: (text: string) => void;
  onSave: () => void;
  onClose: () => void;
};

export default function NoteModal({
  note,
  editedText,
  onTextChange,
  onSave,
  onClose,
}: Props) {
  const hasChanges = editedText !== safe(note.ehr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 sm:px-7">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold tracking-tight text-slate-900">
              {note.patient || "Clinical Note"}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
                <Calendar size={14} />
                {fmtDate(note.date)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
                <Stethoscope size={14} />
                {note.doctor || "Unknown"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
                <User size={14} />
                {note.patient || "Unknown"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
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
              onChange={(e) => onTextChange(e.target.value)}
              className="min-h-[55vh] w-full resize-none rounded-xl border-0 bg-white p-5 text-sm leading-7 text-slate-800 outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
              placeholder="Clinical note..."
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="text-sm text-slate-500">
            {hasChanges ? "You have unsaved changes." : "All changes saved."}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hasChanges && (
              <button
                type="button"
                onClick={onSave}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                <Save size={16} />
                Save Changes
              </button>
            )}

            <button
              type="button"
              onClick={() => generatePDF({ ...note, ehr: editedText })}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Download size={16} />
              Download PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
