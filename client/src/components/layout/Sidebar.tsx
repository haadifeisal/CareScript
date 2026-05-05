import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CalendarDays, FileText, PlusCircle, Stethoscope } from "lucide-react";

const navItems = [
  { to: "/dashboard/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/dashboard/create", label: "New Note", icon: PlusCircle },
  { to: "/dashboard/notes", label: "Notes", icon: FileText },
];

export default function Sidebar() {
  const loc = useLocation();

  return (
    <aside className="hidden w-72 border-r border-slate-200 bg-white xl:flex xl:flex-col">
      <div className="px-5 py-5">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
            <Stethoscope size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">CareScript</div>
            <div className="text-xs text-slate-500">AI Medical Transcription</div>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-4">
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const active = loc.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={[
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "border border-blue-200 bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto px-5 py-5 text-xs text-slate-400">
        © {new Date().getFullYear()} CareScript
      </div>
    </aside>
  );
}
