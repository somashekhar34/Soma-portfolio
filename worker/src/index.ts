import { CANDIDATE_CONTEXT } from "./profile";

export interface Env {
  GROQ_API_KEY: string;
  RATE_LIMIT: KVNamespace;
}

const ALLOWED_ORIGINS = new Set([
  "https://somaaddakula.com",
  "https://www.somaaddakula.com",
  "https://somashekhar34.github.io",
  "http://localhost:5173",
  "http://localhost:4173",
]);

const RATE_LIMIT_MAX = 6; // requests per window, per IP
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60; // 1 hour
const MAX_JOB_TEXT_CHARS = 12000;
const MODEL = "llama-3.3-70b-versatile";

function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/(p|div|li|br|h[1-6]|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function fetchJobTextFromUrl(url: string): Promise<string> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http(s) URLs are supported.");
  }

  const res = await fetch(parsed.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; SomaFitAnalyzer/1.0; +https://somaaddakula.com)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(
      `Couldn't fetch that URL (status ${res.status}). Many job boards block automated fetches — try pasting the job description text instead.`,
    );
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("text/html") && !contentType.includes("text")) {
    throw new Error("That URL didn't return a readable web page.");
  }

  const html = await res.text();
  const text = stripHtml(html);

  if (text.length < 200) {
    throw new Error(
      "Couldn't extract enough text from that page (it may require JavaScript or block automated access) — try pasting the job description text instead.",
    );
  }

  return text;
}

function buildPrompt(jobText: string): string {
  return `You are an impartial technical recruiting analyst. Compare the CANDIDATE background below against the JOB DESCRIPTION, and assess fit honestly — do not inflate the score, and call out real gaps where they exist.

CANDIDATE BACKGROUND:
"""
${CANDIDATE_CONTEXT}
"""

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

type FitResult = {
  score: number;
  verdict: string;
  breakdown: { requirement: string; status: string; note: string }[];
  pitch: string;
};

function validateFitResult(data: unknown): FitResult {
  if (!data || typeof data !== "object") throw new Error("Malformed model response.");
  const d = data as Record<string, unknown>;
  if (typeof d.score !== "number" || typeof d.verdict !== "string" || typeof d.pitch !== "string" || !Array.isArray(d.breakdown)) {
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

async function callGroq(env: Env, jobText: string): Promise<FitResult> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: buildPrompt(jobText) }],
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

async function checkRateLimit(env: Env, ip: string): Promise<boolean> {
  const key = `rl:${ip}`;
  const current = await env.RATE_LIMIT.get(key);
  const count = current ? parseInt(current, 10) : 0;
  if (count >= RATE_LIMIT_MAX) return false;
  await env.RATE_LIMIT.put(key, String(count + 1), {
    expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
  });
  return true;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405, origin);
    }

    const url = new URL(request.url);
    if (url.pathname !== "/analyze") {
      return json({ error: "Not found." }, 404, origin);
    }

    let body: { jobText?: string; jobUrl?: string };
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid request body." }, 400, origin);
    }

    const jobTextInput = (body.jobText || "").trim();
    const jobUrlInput = (body.jobUrl || "").trim();

    if (!jobTextInput && !jobUrlInput) {
      return json({ error: "Provide a job description or a URL." }, 400, origin);
    }

    let jobText = jobTextInput;
    if (!jobText && jobUrlInput) {
      try {
        jobText = await fetchJobTextFromUrl(jobUrlInput);
      } catch (e) {
        return json({ error: (e as Error).message }, 422, origin);
      }
    }

    if (jobText.length < 50) {
      return json(
        { error: "That job description looks too short to analyze meaningfully." },
        400,
        origin,
      );
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const allowed = await checkRateLimit(env, ip);
    if (!allowed) {
      return json(
        { error: "Too many requests. Please try again in a bit." },
        429,
        origin,
      );
    }

    try {
      const result = await callGroq(env, jobText);
      return json(result, 200, origin);
    } catch (e) {
      return json({ error: (e as Error).message || "Analysis failed." }, 502, origin);
    }
  },
};
