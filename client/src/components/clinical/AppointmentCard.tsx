import React from "react";
import { CalendarDays, Mic } from "lucide-react";
import type { Appointment } from "../../types";

type Props = {
  appointment: Appointment;
  isActive: boolean;
  onSelect: () => void;
  onScribe: () => void;
};

export default function AppointmentCard({
  appointment,
  isActive,
  onSelect,
  onScribe,
}: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full rounded-2xl border p-4 text-left transition",
        isActive
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
            onScribe();
          }}
          className="btn-primary"
        >
          <Mic size={16} />
          AI Scribe
        </button>
      </div>
    </button>
  );
}
