import React, { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./DashboardLayout";
import Appointments from "./Appointments";
import CreateNote from "./CreateNote";
import RecordNote from "./RecordNote";
import Transcriptions from "./Transcriptions";

export type PatientDraft = {
  patientName: string;
  age: string;
  gender: "Male" | "Female" | "Other";
  language: "sv" | "en";
};

type DiarizedSegment = {
  speaker?: string;
  start?: number;
  end?: number;
  text?: string;
};

const STORAGE_KEY = "ehrNotes";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const extractField = (ehr: string, label: string, fallback: string) => {
  const m = String(ehr || "").match(new RegExp(`^${label}:\\s*(.*)$`, "mi"));
  return (m?.[1] || fallback).trim();
};

export default function App() {
  const [draft, setDraft] = useState<PatientDraft | null>(() => {
    try {
      return JSON.parse(sessionStorage.getItem("currentDraft") || "null");
    } catch {
      return null;
    }
  });

  const [transcript, setTranscript] = useState("");
  const [segments, setSegments] = useState<DiarizedSegment[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState("");
  const [ehrSaved, setEhrSaved] = useState(false);

  const hasDraft = useMemo(() => !!draft?.patientName, [draft]);

  const beginDraft = (nextDraft: PatientDraft) => {
    setDraft(nextDraft);
    sessionStorage.setItem("currentDraft", JSON.stringify(nextDraft));
  };

  const clearDraft = () => {
    setDraft(null);
    sessionStorage.removeItem("currentDraft");
  };

  const handleFinished = async (blob: Blob) => {
    try {
      setError("");
      setTranscript("");
      setSegments([]);
      setIsTranscribing(true);
      setEhrSaved(false);

      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      if (draft) {
        formData.append("patientName", draft.patientName);
        formData.append("age", draft.age);
        formData.append("gender", draft.gender);
        formData.append("language", draft.language);
      }

      const res = await fetch(`${BASE_URL}/api/transcribe`, {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || data?.details || "Request failed.");
      }

      setTranscript(data.transcript || "");
      setSegments(Array.isArray(data.segments) ? data.segments : []);

      if (!data.ehr) {
        throw new Error("EHR note was not returned.");
      }

      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      const patient =
        draft?.patientName?.trim() || extractField(data.ehr, "Patient", "Unknown");
      const doctor = extractField(data.ehr, "Provider", "AI Clinician");

      saved.unshift({
        id: Date.now(),
        patient,
        date: new Date().toISOString(),
        doctor,
        ehr: data.ehr,
        meta: draft || null,
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      setEhrSaved(true);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/appointments" replace />} />

        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/appointments" replace />}
          />
          <Route
            path="/dashboard/appointments"
            element={<Appointments onAiscribe={beginDraft} />}
          />
          <Route
            path="/dashboard/create"
            element={<CreateNote onProceed={beginDraft} />}
          />
          <Route
            path="/dashboard/record"
            element={
              hasDraft ? (
                <RecordNote
                  draft={draft!}
                  onClearDraft={clearDraft}
                  onFinished={handleFinished}
                  transcript={transcript}
                  segments={segments}
                  isTranscribing={isTranscribing}
                  error={error}
                  ehrSaved={ehrSaved}
                />
              ) : (
                <Navigate to="/dashboard/appointments" replace />
              )
            }
          />
          <Route path="/dashboard/notes" element={<Transcriptions />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard/appointments" replace />} />
      </Routes>
    </BrowserRouter>
  );
}