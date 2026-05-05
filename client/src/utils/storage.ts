import type { SavedNote } from "../types";

export const STORAGE_KEY = "ehrNotes";

export function getNotes(): SavedNote[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: SavedNote[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function addNote(note: SavedNote): void {
  const notes = getNotes();
  notes.unshift(note);
  saveNotes(notes);
}
