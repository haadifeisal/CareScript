export type PatientDraft = {
  patientName: string;
  age: string;
  gender: "Male" | "Female" | "Other";
  language: "sv" | "en";
};

export type DiagnosisCode = {
  label: string;
  codeSystem: "ICD-10";
  code: string;
  confidence: "suggested" | "uncertain";
  evidence: string[];
};

export type SavedNote = {
  id: number;
  patient: string;
  date: string;
  doctor: string;
  ehr: string;
  diagnoses?: DiagnosisCode[];
  meta?: PatientDraft | null;
};

export type DiarizedSegment = {
  speaker?: string;
  start?: number;
  end?: number;
  text?: string;
};

export type Appointment = {
  id: string;
  name: string;
  gender: "Male" | "Female";
  age: string;
  date: string;
  language: "sv" | "en";
  template: "Routine Checkup" | "Follow-up" | "Consultation";
  dob: string;
};
