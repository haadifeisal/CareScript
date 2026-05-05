import React, { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import AppointmentsPage from "./pages/AppointmentsPage";
import CreateNotePage from "./pages/CreateNotePage";
import RecordNotePage from "./pages/RecordNotePage";
import NotesPage from "./pages/NotesPage";
import type { PatientDraft, DiarizedSegment } from "./types";
import { transcribeAudio } from "./services/api";
import { addNote } from "./utils/storage";
import { extractField } from "./utils/format";

export type { PatientDraft };

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
    setEhrSaved(false);
    setTranscript("");
    setSegments([]);
    setError("");
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

      const result = await transcribeAudio(blob, draft);

      setTranscript(result.transcript);
      setSegments(result.segments);

      const patient =
        draft?.patientName?.trim() ||
        extractField(result.ehr, "Patient", "Unknown");
      const doctor = extractField(result.ehr, "Provider", "AI Clinician");

      addNote({
        id: Date.now(),
        patient,
        date: new Date().toISOString(),
        doctor,
        ehr: result.ehr,
        diagnoses: result.diagnoses,
        meta: draft ?? null,
      });

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
        <Route
          path="/"
          element={<Navigate to="/dashboard/appointments" replace />}
        />
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/appointments" replace />}
          />
          <Route
            path="/dashboard/appointments"
            element={<AppointmentsPage onAiscribe={beginDraft} />}
          />
          <Route
            path="/dashboard/create"
            element={<CreateNotePage onProceed={beginDraft} />}
          />
          <Route
            path="/dashboard/record"
            element={
              hasDraft ? (
                <RecordNotePage
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
          <Route path="/dashboard/notes" element={<NotesPage />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to="/dashboard/appointments" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}