import openai from "../config/openai.js";

function nowTimestamp() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

class ChatGPTService {
  static async generateEHR(transcript) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `
You are a medical scribe and clinical coding assistant.

Return ONLY valid JSON.

The JSON must have this shape:
{
  "ehr": "string",
  "diagnoses": [
    {
      "label": "string",
      "codeSystem": "ICD-10",
      "code": "string",
      "confidence": "suggested or uncertain",
      "evidence": ["string"]
    }
  ]
}

Diagnosis codes are suggestions only and must be reviewed by a clinician.
Only suggest ICD-10 codes supported by the transcript.
If evidence is insufficient, return an empty diagnoses array.
            `.trim(),
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
- Provider should be "AI Clinician" unless clearly mentioned
- Keep the EHR concise
- Leave the "Diagnosis Codes:" line blank in the EHR — codes will be appended separately
- Return only JSON, no markdown

EHR FORMAT:

Patient:
Date:
Provider:

Chief Complaint:
Summary:
Assessment:
Diagnosis Codes:
Plan:
            `.trim(),
          },
        ],
      });

      const content = completion.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response from ChatGPT");
      }

      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        console.error("RAW CHATGPT RESPONSE:", content);
        throw new Error("ChatGPT returned invalid JSON");
      }

      return {
        ehr: parsed.ehr || "",
        diagnoses: Array.isArray(parsed.diagnoses) ? parsed.diagnoses : [],
      };
    } catch (err) {
      console.error("ChatGPT ERROR:", err);
      throw new Error("ChatGPT generation failed");
    }
  }
}

export default ChatGPTService;
