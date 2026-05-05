import React, { useState } from "react";
import { ChevronRight, User, Languages, FileText } from "lucide-react";
import type { Appointment } from "../../types";

type Props = {
  appointment: Appointment;
  onStart: (appointment: Appointment) => void;
};

const languageLabel = (lang: Appointment["language"]) =>
  lang === "sv" ? "Swedish" : "English";

export default function AppointmentDetail({ appointment, onStart }: Props) {
  const [mode, setMode] = useState<"Transcription" | "Conversation">(
    "Transcription"
  );

  return (
    <section className="page-card">
      <div className="page-card-header flex items-center justify-between gap-4">
        <div>
          <h2 className="section-title">New Clinical Encounter Note</h2>
          <p className="page-subtitle">
            Review the visit details and start recording when ready.
          </p>
        </div>
        <span className="pill">{appointment.template}</span>
      </div>

      <div className="page-card-body space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="stat-card">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
              <User size={16} />
              Patient Name
            </div>
            <div className="text-base font-semibold text-slate-900">
              {appointment.name}
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
                className={mode === "Transcription" ? "btn-primary" : "btn-secondary"}
              >
                Transcription
              </button>
              <button
                type="button"
                onClick={() => setMode("Conversation")}
                className={mode === "Conversation" ? "btn-primary" : "btn-secondary"}
              >
                Conversation
              </button>
            </div>
          </div>

          <div className="stat-card">
            <div className="mb-2 text-sm font-medium text-slate-500">Gender</div>
            <div className="text-base font-semibold text-slate-900">
              {appointment.gender}
            </div>
          </div>

          <div className="stat-card">
            <div className="mb-2 text-sm font-medium text-slate-500">
              Date of Birth
            </div>
            <div className="text-base font-semibold text-slate-900">
              {appointment.dob}
            </div>
          </div>

          <div className="stat-card md:col-span-2">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
              <Languages size={16} />
              Language
            </div>
            <div className="text-base font-semibold text-slate-900">
              {languageLabel(appointment.language)}
            </div>
          </div>

          <div className="stat-card md:col-span-2">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
              <FileText size={16} />
              Template
            </div>
            <div className="text-base font-semibold text-slate-900">
              {appointment.template}
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
            onClick={() => onStart(appointment)}
            className="btn-primary"
          >
            Start recording
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
