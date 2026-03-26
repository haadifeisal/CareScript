import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  Mic,
  User,
  Languages,
  FileText,
} from "lucide-react";
import type { PatientDraft } from "./App";

type Props = {
  onAiscribe: (draft: PatientDraft) => void;
};

type Appointment = {
  id: string;
  name: string;
  gender: "Male" | "Female";
  age: string;
  date: string;
  language: "sv" | "en";
  template: "Routine Checkup" | "Follow-up" | "Consultation";
  dob: string;
};

const APPTS: Appointment[] = [
  {
    id: "a1",
    name: "Emily Carter",
    gender: "Female",
    age: "34",
    date: "09/02/2025 10:30",
    language: "en",
    template: "Routine Checkup",
    dob: "1991-08-12",
  },
  {
    id: "a2",
    name: "Michael Brown",
    gender: "Male",
    age: "45",
    date: "09/03/2025 14:15",
    language: "en",
    template: "Follow-up",
    dob: "1980-03-02",
  },
  {
    id: "a3",
    name: "Sophia Parker",
    gender: "Female",
    age: "29",
    date: "09/04/2025 11:00",
    language: "sv",
    template: "Consultation",
    dob: "1995-01-21",
  },
  {
    id: "a4",
    name: "David Lee",
    gender: "Male",
    age: "52",
    date: "09/05/2025 16:45",
    language: "en",
    template: "Consultation",
    dob: "1972-06-19",
  },
];

const languageLabel = (lang: Appointment["language"]) =>
  lang === "sv" ? "Swedish" : "English";

export default function Appointments({ onAiscribe }: Props) {
  const nav = useNavigate();
  const [selectedId, setSelectedId] = useState(APPTS[0]?.id ?? "");
  const [mode, setMode] = useState<"Transcription" | "Conversation">(
    "Transcription"
  );

  const selected = useMemo(
    () => APPTS.find((a) => a.id === selectedId) || APPTS[0],
    [selectedId]
  );

  const startScribe = (appointment: Appointment) => {
    onAiscribe({
      patientName: appointment.name,
      age: appointment.age,
      gender: appointment.gender,
      language: appointment.language,
    });
    nav("/dashboard/record");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <section className="page-card">
        <div className="page-card-header flex items-center justify-between">
          <div>
            <h1 className="section-title">Appointments</h1>
            <p className="page-subtitle">Select a patient to begin documenting.</p>
          </div>
          <span className="pill">{APPTS.length}</span>
        </div>

        <div className="page-card-body">
          <div className="space-y-3">
            {APPTS.map((appointment) => {
              const active = appointment.id === selectedId;

              return (
                <button
                  key={appointment.id}
                  type="button"
                  onClick={() => setSelectedId(appointment.id)}
                  className={[
                    "w-full rounded-2xl border p-4 text-left transition",
                    active
                      ? "border-blue-200 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {appointment.name}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {appointment.gender} · {appointment.age} yrs
                      </div>
                    </div>

                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                      {appointment.template}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                      <CalendarDays size={15} />
                      {appointment.date}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(appointment.id);
                        startScribe(appointment);
                      }}
                      className="btn-primary"
                    >
                      <Mic size={16} />
                      AI Scribe
                    </button>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-card">
        <div className="page-card-header flex items-center justify-between gap-4">
          <div>
            <h2 className="section-title">New Clinical Encounter Note</h2>
            <p className="page-subtitle">
              Review the visit details and start recording when ready.
            </p>
          </div>
          <span className="pill">{selected?.template || "Template"}</span>
        </div>

        <div className="page-card-body space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="stat-card">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                <User size={16} />
                Patient Name
              </div>
              <div className="text-base font-semibold text-slate-900">
                {selected?.name}
              </div>
            </div>

            <div className="stat-card">
              <div className="mb-2 text-sm font-medium text-slate-500">
                Dictation Mode
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMode("Transcription")}
                  className={
                    mode === "Transcription" ? "btn-primary" : "btn-secondary"
                  }
                >
                  Transcription
                </button>
                <button
                  type="button"
                  onClick={() => setMode("Conversation")}
                  className={
                    mode === "Conversation" ? "btn-primary" : "btn-secondary"
                  }
                >
                  Conversation
                </button>
              </div>
            </div>

            <div className="stat-card">
              <div className="mb-2 text-sm font-medium text-slate-500">Gender</div>
              <div className="text-base font-semibold text-slate-900">
                {selected?.gender}
              </div>
            </div>

            <div className="stat-card">
              <div className="mb-2 text-sm font-medium text-slate-500">
                Date of Birth
              </div>
              <div className="text-base font-semibold text-slate-900">
                {selected?.dob}
              </div>
            </div>

            <div className="stat-card md:col-span-2">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                <Languages size={16} />
                Language
              </div>
              <div className="text-base font-semibold text-slate-900">
                {selected ? languageLabel(selected.language) : "Unknown"}
              </div>
            </div>

            <div className="stat-card md:col-span-2">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                <FileText size={16} />
                Template
              </div>
              <div className="text-base font-semibold text-slate-900">
                {selected?.template}
              </div>
            </div>
          </div>

          <div className="soft-panel">
            <div className="text-sm font-medium text-slate-700">
              Optional audio upload
            </div>
            <p className="mt-1 text-sm text-slate-500">
              You can add upload support later. For now, start recording directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <div className="text-sm font-medium text-slate-900">
                Ready to start this encounter
              </div>
              <div className="mt-1 text-sm text-slate-500">
                This opens the recorder with the selected patient pre-filled.
              </div>
            </div>

            <button
              type="button"
              onClick={() => selected && startScribe(selected)}
              className="btn-primary"
            >
              Start recording
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}