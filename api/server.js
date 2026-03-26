import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import OpenAI from "openai";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));

const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ================== CONFIG ================== */

const LANGUAGE = "en";
const DIARIZE_MODEL = "gpt-4o-transcribe-diarize";
const FALLBACK_MODEL = "gpt-4o-mini-transcribe";

/* ================== HELPERS ================== */

function nowTimestamp() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

/* ================== WHISPER ================== */

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
    } catch (err) {
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

/* ================== CHATGPT ================== */

class ChatGPTService {
  static async generateEHR(transcript) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a medical scribe. Always return structured EHR notes.",
          },
          {
            role: "user",
            content: `
Create a SHORT professional EHR note.

Transcript:
${transcript}

Rules:
- If patient name is mentioned, extract it
- Otherwise use "Unknown"
- Use this timestamp: ${nowTimestamp()}

FORMAT:

Patient:
Date:
Provider:

Chief Complaint:
Summary:
Assessment:
Plan:
`,
          },
        ],
      });

      return completion.choices[0].message.content;
    } catch (err) {
      console.error("ChatGPT ERROR:", err);
      throw new Error("ChatGPT generation failed");
    }
  }
}

/* ================== ROUTE ================== */

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio uploaded" });
    }

    const { toFile } = await import("openai/uploads");

    const audioFile = await toFile(
      req.file.buffer,
      "recording.webm"
    );

    // 1. Whisper
    const whisperResult = await WhisperService.transcribe(audioFile);

    // 2. ChatGPT
    const ehr = await ChatGPTService.generateEHR(
      whisperResult.transcript
    );

    res.json({
      transcript: whisperResult.transcript,
      segments: whisperResult.segments,
      ehr,
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
      error: "Processing failed",
      details: err.message,
    });
  }
});

/* ================== START ================== */

app.listen(5000, () =>
  console.log("API running → http://localhost:5000")
);
