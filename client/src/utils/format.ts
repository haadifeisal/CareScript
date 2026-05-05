export function safe(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

export function fmtDate(s: string): string {
  const d = new Date(s);
  return isNaN(d.getTime())
    ? safe(s)
    : d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
}

export function extractField(
  ehr: string,
  label: string,
  fallback: string
): string {
  const m = String(ehr || "").match(new RegExp(`^${label}:\\s*(.*)$`, "mi"));
  return (m?.[1] || fallback).trim();
}
