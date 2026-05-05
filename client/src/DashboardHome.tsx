import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { getNotes } from "./utils/storage";

const features = [
  { icon: "", title: "Record the encounter", desc: "Capture history, symptoms, and clinician questions in one flow." },
  { icon: "", title: "Transcribe with context", desc: "Clear text with punctuation and clinical phrasing support." },
  { icon: "", title: "Generate structured note", desc: "Assessment + Plan formatted in an EHR-ready template." },
];

export default function DashboardHome() {
  const notesCount = useMemo(() => getNotes().length, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="page-card">
          <div className="page-card-body">
            <div className="flex flex-wrap gap-2">
              <span className="pill">Doctorpatient workflow</span>
              <span className="pill">Audio  EHR</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
              Create clean clinical notesfast.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
              Start by adding patient details, then record the encounter. CareScript transcribes and turns it into a structured note ready for review and export.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/dashboard/create" className="btn-primary">Create new note</Link>
              <Link to="/dashboard/notes" className="btn-secondary">View previous notes</Link>
            </div>
          </div>
        </div>

        <div className="page-card">
          <div className="page-card-body">
            <div className="text-sm text-slate-500">Saved notes</div>
            <div className="mt-1 text-4xl font-bold text-slate-900">{notesCount}</div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your generated EHR notes are stored locally and available under "Notes".
            </p>
            <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50 p-3">
              <div className="text-sm font-semibold text-slate-800">Tip</div>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Keep recordings concise (one visit at a time) for best note quality.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="page-card">
            <div className="page-card-body">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-lg">{f.icon}</div>
              <div className="mt-3 text-sm font-semibold text-slate-900">{f.title}</div>
              <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
