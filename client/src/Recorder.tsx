import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Mic,
  Square,
  RotateCcw,
  Sparkles,
} from "lucide-react";

type DiarizedSegment = {
  speaker?: string;
  text?: string;
};

interface RecorderProps {
  onFinished?: (audioBlob: Blob) => void;
  transcript?: string;
  segments?: DiarizedSegment[];
  isTranscribing?: boolean;
  error?: string;
  ehrSaved?: boolean;
}

export default function Recorder({
  onFinished,
  transcript = "",
  segments = [],
  isTranscribing = false,
  error,
  ehrSaved,
}: RecorderProps) {
  const [status, setStatus] = useState<"ready" | "recording" | "finished">("ready");
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  const speakerLabel = useMemo(() => {
    const uniq: string[] = [];
    for (const segment of segments) {
      const spk = (segment.speaker ?? "").trim();
      if (spk && !uniq.includes(spk)) uniq.push(spk);
      if (uniq.length === 2) break;
    }

    const map = new Map<string, string>();
    if (uniq[0]) map.set(uniq[0], "DOCTOR");
    if (uniq[1]) map.set(uniq[1], "PATIENT");

    return (raw?: string) => map.get((raw ?? "").trim()) || "SPEAKER";
  }, [segments]);

  const preview = useMemo(() => {
    const hasSegments = segments.some((s) => (s.text ?? "").trim());
    if (hasSegments) {
      return segments
        .filter((s) => (s.text ?? "").trim())
        .slice(0, 12)
        .map((s) => ({
          role: speakerLabel(s.speaker),
          text: (s.text ?? "").trim(),
        }));
    }

    const t = transcript.trim();
    return t ? [{ role: "TRANSCRIPT", text: t }] : [];
  }, [segments, transcript, speakerLabel]);

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const cleanup = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      if (recRef.current?.state === "recording") {
        recRef.current.stop();
      }
    } catch {}

    stopTracks();
  };

  useEffect(() => cleanup, []);

  const start = async () => {
    setShowPreview(false);
    setAudioBlob(null);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const rec = new MediaRecorder(stream);
    recRef.current = rec;
    chunksRef.current = [];

    rec.ondataavailable = (e) => {
      if (e.data.size) chunksRef.current.push(e.data);
    };

    rec.onstop = () => {
      setAudioBlob(new Blob(chunksRef.current, { type: "audio/webm" }));
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      stopTracks();
      setStatus("finished");
    };

    rec.start();
    setStatus("recording");
    setSeconds(0);
    timerRef.current = window.setInterval(() => setSeconds((prev) => prev + 1), 1000);
  };

  const stop = () => recRef.current?.stop();

  const again = () => {
    cleanup();
    setStatus("ready");
    setSeconds(0);
    setAudioBlob(null);
    setShowPreview(false);
  };

  const createNote = () => {
    if (!audioBlob || isTranscribing) return;
    setShowPreview(true);
    onFinished?.(audioBlob);
  };

  const showAudio = status === "finished" && audioBlob;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Recorder
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Record the encounter clearly, then generate a clinical note.
            </p>
          </div>

          <span className="pill">{fmt(seconds)}</span>
        </div>

        <div className="my-8 flex justify-center">
          <div
            className={[
              "flex h-24 w-24 items-center justify-center rounded-full border transition",
              status === "recording"
                ? "border-red-200 bg-red-50 shadow-[0_0_0_10px_rgba(254,226,226,0.9)]"
                : "border-blue-200 bg-blue-50",
            ].join(" ")}
          >
            <Mic
              size={30}
              className={status === "recording" ? "text-red-600" : "text-blue-600"}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {status === "ready" && (
            <button type="button" onClick={start} className="btn-primary">
              <Mic size={16} />
              Start recording
            </button>
          )}

          {status === "recording" && (
            <button type="button" onClick={stop} className="btn-danger">
              <Square size={16} />
              Stop
            </button>
          )}

          {status === "finished" && (
            <>
              <button
                type="button"
                onClick={again}
                disabled={isTranscribing}
                className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw size={16} />
                Record again
              </button>

              <button
                type="button"
                onClick={createNote}
                disabled={isTranscribing}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isTranscribing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Create note
                  </>
                )}
              </button>
            </>
          )}
        </div>

        <div className="mt-4 text-center text-sm text-slate-500">
          {status === "ready" && "Ready"}
          {status === "recording" && "Recording..."}
          {status === "finished" && (
            <span className="inline-flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={16} />
              Recording complete
            </span>
          )}
        </div>

        {showAudio && audioBlob && (
          <div className="mx-auto mt-5 max-w-2xl">
            <audio controls className="w-full" src={URL.createObjectURL(audioBlob)} />
          </div>
        )}

        {ehrSaved && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Clinical note saved.
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {showPreview && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Live preview</h3>

          <div className="mt-4 max-h-80 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {isTranscribing && preview.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-slate-500">
                <Loader2 size={18} className="animate-spin" />
              </div>
            ) : preview.length === 0 ? (
              <div className="text-sm text-slate-500">No preview yet.</div>
            ) : (
              <div className="space-y-3">
                {preview.map((line, index) => (
                  <div key={index} className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
                    <div className="text-right text-[11px] font-semibold tracking-[0.14em] text-slate-400">
                      {line.role}
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-800">
                      {line.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}