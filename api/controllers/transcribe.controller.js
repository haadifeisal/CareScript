import { toFile } from "openai/uploads";
import WhisperService from "../services/whisper.service.js";
import ChatGPTService from "../services/chatgpt.service.js";

export async function transcribe(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio uploaded" });
    }

    const audioFile = await toFile(req.file.buffer, "recording.webm");

    // 1. Transcribe audio
    const whisperResult = await WhisperService.transcribe(audioFile);

    const transcript = whisperResult?.transcript || "";
    const segments = Array.isArray(whisperResult?.segments)
      ? whisperResult.segments
      : [];

    if (!transcript.trim()) {
      return res.status(400).json({ error: "No transcript generated" });
    }

    // 2. Generate EHR + diagnosis codes
    const ehrResult = await ChatGPTService.generateEHR(transcript);

    const diagnoses = Array.isArray(ehrResult?.diagnoses)
      ? ehrResult.diagnoses
      : [];

    const diagnosisBlock =
      diagnoses.length > 0
        ? diagnoses
            .map((d) => {
              const label = d.label || "Unknown diagnosis";
              const codeSystem = d.codeSystem || "ICD-10";
              const code = d.code || "N/A";
              return `- ${label} (${codeSystem}: ${code})`;
            })
            .join("\n")
        : "No diagnosis codes suggested.";

    let ehr = ehrResult?.ehr || "";

    // Rebuild the Diagnosis Codes section cleanly, preserving Plan: that follows it.
    const ehrBase = ehr.replace(/Diagnosis Codes:[\s\S]*/i, "").trim();
    const planMatch = ehr.match(/Plan:[\s\S]*/i);
    const planSection = planMatch ? `\n\n${planMatch[0].trim()}` : "";
    ehr = `${ehrBase}\n\nDiagnosis Codes:\n${diagnosisBlock}${planSection}`.trim();

    res.json({ transcript, segments, ehr, diagnoses });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
      error: "Processing failed",
      details: err?.message || "Unknown server error",
    });
  }
}
