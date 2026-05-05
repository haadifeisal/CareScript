# Copilot Instructions — CareScript

CareScript is an AI medical scribe app for doctor-patient encounters. It records audio, transcribes the conversation, generates a structured EHR note, suggests diagnosis codes, and lets the clinician review, edit, save, and export the result.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Backend: Node.js + Express
- AI: OpenAI for transcription and EHR generation
- Storage: currently localStorage / planned database
- Clinical interoperability: planned FHIR/openEHR export

## General Coding Rules

- Write clean, simple, maintainable code.
- Prefer small components over very large files.
- Avoid unnecessary abstractions.
- Avoid inline styles unless necessary.
- Use Tailwind classes and shared utility classes from `index.css`.
- Keep UI consistent, light, professional, and clinical.
- Do not reintroduce Bootstrap unless explicitly requested.
- Use TypeScript types for patient, note, diagnosis, transcript, and appointment data.
- Do not hardcode patient data unless it is mock/demo data.
- Avoid duplicating business logic across components.
- Remove unused imports and dead code.

## UI / UX Guidelines

The app should feel like a modern clinical SaaS product:

- Light theme
- Clear contrast for buttons and actions
- Soft borders
- Clean cards
- Small professional typography
- Good spacing
- Minimal visual clutter
- Accessible labels and button text
- Clear primary actions

Preferred Tailwind styling:

- Background: `bg-slate-50`
- Cards: `bg-white border border-slate-200 rounded-2xl shadow-sm`
- Text: `text-slate-900`, `text-slate-600`, `text-slate-500`
- Primary action: `bg-blue-600 hover:bg-blue-700 text-white`
- Success action: `bg-emerald-600 hover:bg-emerald-700 text-white`
- Danger action: `bg-red-600 hover:bg-red-700 text-white`
- Inputs: `rounded-2xl border border-slate-300 focus:ring-4 focus:ring-blue-100`
- Buttons should remain clearly visible on a light theme.

## Clinical Safety Rules

CareScript is a clinical documentation assistant, not a final medical decision-maker.

- Diagnosis codes must always be treated as suggestions.
- Add wording like: `Suggested diagnosis codes — clinician review required`.
- Do not present AI-generated diagnosis codes as final.
- Do not invent symptoms, diagnoses, test results, medications, allergies, or findings.
- If evidence is insufficient, use uncertainty or return no diagnosis code.
- Preserve the clinician’s ability to edit the final EHR note.
- Avoid making definitive medical claims unless clearly supported by transcript data.

## EHR Note Format

Generated EHR notes should be concise and structured:

```txt
Patient:
Date:
Provider:

Chief Complaint:
Summary:
Assessment:
Diagnosis Codes:
Plan: