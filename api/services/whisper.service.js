import openai from "../config/openai.js";

const LANGUAGE = "en";
const DIARIZE_MODEL = "gpt-4o-transcribe-diarize";
const FALLBACK_MODEL = "gpt-4o-mini-transcribe";

class WhisperService {
  static async transcribe(audioFile) {
    try {
      const diarized = await openai.audio.transcriptions.create({
        file: audioFile,
        model: DIARIZE_MODEL,
        language: LANGUAGE,
        response_format: "diarized_json",
      });

      const segments = diarized.segments || [];

      const transcript =
        segments.length > 0
          ? segments.map((s) => `[${s.speaker}] ${s.text}`).join("\n")
          : diarized.text || "";

      return { transcript, segments };
    } catch {
      console.log("Diarization failed → fallback");

      const t = await openai.audio.transcriptions.create({
        file: audioFile,
        model: FALLBACK_MODEL,
        language: LANGUAGE,
      });

      return { transcript: t.text, segments: [] };
    }
  }
}

export default WhisperService;
