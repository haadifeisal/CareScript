import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import AppHeader from "./components/layout/AppHeader";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <AppHeader />
          <div className="app-shell py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}