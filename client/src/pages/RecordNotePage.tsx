import React from "react";
import { RotateCcw } from "lucide-react";
import Recorder from "../components/clinical/Recorder";
import type { PatientDraft, DiarizedSegment } from "../types";

type Props = {
  draft: PatientDraft;
  onClearDraft: () => void;
  onFinished: (audioBlob: Blob) => void;
  transcript: string;
  segments: DiarizedSegment[];
  isTranscribing: boolean;
  error: string;
  ehrSaved: boolean;
};

export default function RecordNotePage({
  draft,
  onClearDraft,
  onFinished,
  transcript,
  segments,
  isTranscribing,
  error,
  ehrSaved,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="page-card">
        <div className="page-card-body flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Current Patient
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              {draft.patientName}
            </div>
            <div className="mt-2 text-sm text-slate-500">
              {draft.age ? `${draft.age} yrs` : "Age N/A"} · {draft.gender} ·{" "}
              {draft.language === "sv" ? "Swedish" : "English"}
            </div>
          </div>

          <button
            type="button"
            onClick={onClearDraft}
            className="btn-secondary"
          >
            <RotateCcw size={16} />
            Reset Patient
          </button>
        </div>
      </section>

      <section className="page-card">
        <div className="page-card-body">
          <Recorder
            onFinished={onFinished}
            transcript={transcript}
            segments={segments}
            isTranscribing={isTranscribing}
            error={error}
            ehrSaved={ehrSaved}
          />
        </div>
      </section>
    </div>
  );
}
