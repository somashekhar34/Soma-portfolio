import { CANDIDATE_CONTEXT } from "./profile";
import type { Env } from "./index";

const MAX_JOB_TEXT_CHARS = 12000;
const MODEL = "llama-3.3-70b-versatile";

export type FitResult = {
  score: number;
  verdict: string;
  breakdown: { requirement: string; status: string; note: string }[];
  pitch: string;
};

function buildPrompt(jobText: string, corrections: string[]): string {
  const correctionsBlock =
    corrections.length > 0
      ? `\nKNOWN CORRECTIONS FROM PAST FEEDBACK (the candidate or a reviewer flagged these as mistakes in earlier analyses — treat them as accurate facts about the candidate and do not repeat the same mistake):\n${corrections.map((c) => `- ${c}`).join("\n")}\n`
      : "";

  return `You are an impartial technical recruiting analyst. Compare the CANDIDATE background below against the JOB DESCRIPTION, and assess fit honestly — do not inflate the score, and call out real gaps where they exist.

CANDIDATE BACKGROUND:
"""
${CANDIDATE_CONTEXT}
"""
${correctionsBlock}
JOB DESCRIPTION:
"""
${jobText.slice(0, MAX_JOB_TEXT_CHARS)}
"""

Respond with ONLY a JSON object (no markdown, no commentary) matching exactly this shape:
{
  "score": <integer 0-100, overall fit score>,
  "verdict": "<one short phrase, e.g. 'Strong Match', 'Good Match', 'Partial Match', 'Not a Strong Fit'>",
  "breakdown": [
    { "requirement": "<a specific requirement or theme from the job post>", "status": "<match|partial|gap>", "note": "<one sentence grounded in the candidate's actual background>" }
  ],
  "pitch": "<a short, honest, specific 2-4 sentence pitch for why this candidate suits the role, written in third person, grounded only in what's in the candidate background above>"
}

Include 4 to 7 items in "breakdown", covering the most important requirements in the job post. Never invent experience the candidate doesn't have. If the role is a poor fit, say so plainly in the verdict and pitch rather than forcing a positive spin.`;
}

function validateFitResult(data: unknown): FitResult {
  if (!data || typeof data !== "object") throw new Error("Malformed model response.");
  const d = data as Record<string, unknown>;
  if (
    typeof d.score !== "number" ||
    typeof d.verdict !== "string" ||
    typeof d.pitch !== "string" ||
    !Array.isArray(d.breakdown)
  ) {
    throw new Error("Malformed model response.");
  }
  const breakdown = d.breakdown.map((item) => {
    const i = item as Record<string, unknown>;
    return {
      requirement: String(i.requirement ?? ""),
      status: String(i.status ?? "partial"),
      note: String(i.note ?? ""),
    };
  });
  return {
    score: Math.max(0, Math.min(100, Math.round(d.score))),
    verdict: d.verdict,
    breakdown,
    pitch: d.pitch,
  };
}

export async function callGroq(
  env: Env,
  jobText: string,
  corrections: string[],
): Promise<FitResult> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: buildPrompt(jobText, corrections) }],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1500,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Groq API error (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from model.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Model did not return valid JSON.");
  }
  return validateFitResult(parsed);
}
