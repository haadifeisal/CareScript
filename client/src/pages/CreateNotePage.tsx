import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PatientDraft } from "../types";

type Props = {
  onProceed: (draft: PatientDraft) => void;
};

export default function CreateNotePage({ onProceed }: Props) {
  const nav = useNavigate();
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<PatientDraft["gender"]>("Male");
  const [language, setLanguage] = useState<PatientDraft["language"]>("en");

  const proceed = () => {
    const cleanName = patientName.trim();
    if (!cleanName) return;
    onProceed({ patientName: cleanName, age: age.trim(), gender, language });
    nav("/dashboard/record");
  };

  return (
    <section className="page-card max-w-4xl">
      <div className="page-card-header">
        <h1 className="section-title">New Patient / Note</h1>
        <p className="page-subtitle">
          Enter minimal patient details, then proceed to recording.
        </p>
      </div>

      <div className="page-card-body">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Patient Name
            </label>
            <input
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. John Doe"
              className="app-input"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Age
            </label>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="42"
              className="app-input"
            />
          </div>

          <div className="md:col-span-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) =>
                setGender(e.target.value as PatientDraft["gender"])
              }
              className="app-select"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Language
            </label>
            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as PatientDraft["language"])
              }
              className="app-select"
            >
              <option value="en">English</option>
              <option value="sv">Swedish</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={proceed}
            disabled={!patientName.trim()}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Proceed
          </button>
        </div>
      </div>
    </section>
  );
}
