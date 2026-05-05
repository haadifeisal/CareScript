import React from "react";
import { Link } from "react-router-dom";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="app-shell flex h-16 items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">
            AI Medical Transcription
          </div>
          <div className="text-xs text-slate-500">
            Clinical documentation workflow
          </div>
        </div>

        <Link to="/dashboard/create" className="btn-primary">
          Create note
        </Link>
      </div>
    </header>
  );
}
