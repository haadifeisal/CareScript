import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PatientDraft, Appointment } from "../types";
import AppointmentCard from "../components/clinical/AppointmentCard";
import AppointmentDetail from "../components/clinical/AppointmentDetail";

type Props = {
  onAiscribe: (draft: PatientDraft) => void;
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

export default function AppointmentsPage({ onAiscribe }: Props) {
  const nav = useNavigate();
  const [selectedId, setSelectedId] = useState(APPTS[0]?.id ?? "");

  const selected = useMemo(
    () => APPTS.find((a) => a.id === selectedId) ?? APPTS[0],
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
            <p className="page-subtitle">
              Select a patient to begin documenting.
            </p>
          </div>
          <span className="pill">{APPTS.length}</span>
        </div>

        <div className="page-card-body">
          <div className="space-y-3">
            {APPTS.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                isActive={appt.id === selectedId}
                onSelect={() => setSelectedId(appt.id)}
                onScribe={() => startScribe(appt)}
              />
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <AppointmentDetail appointment={selected} onStart={startScribe} />
      )}
    </div>
  );
}
