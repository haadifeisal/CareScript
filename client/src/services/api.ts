import type { PatientDraft, DiarizedSegment, DiagnosisCode } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL;

export type TranscribeResult = {
  transcript: string;
  segments: DiarizedSegment[];
  ehr: string;
  diagnoses: DiagnosisCode[];
};

export async function transcribeAudio(
  blob: Blob,
  draft: PatientDraft | null
): Promise<TranscribeResult> {
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

  if (!data.ehr) {
    throw new Error("EHR note was not returned.");
  }

  return {
    transcript: data.transcript || "",
    segments: Array.isArray(data.segments) ? data.segments : [],
    ehr: data.ehr,
    diagnoses: data.diagnoses || [],
  };
}
