import { callGroq, type FitResult } from "./groq";
import { getRecentCorrections, getStats, insertFeedback, insertSearch } from "./db";
import { renderAdminPage } from "./admin";

export interface Env {
  GROQ_API_KEY: string;
  ADMIN_KEY: string;
  RATE_LIMIT: KVNamespace;
  DB: D1Database;
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

function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
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

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function handleAnalyze(request: Request, env: Env, origin: string | null): Promise<Response> {
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
    return json({ error: "Too many requests. Please try again in a bit." }, 429, origin);
  }

  try {
    const corrections = await getRecentCorrections(env).catch(() => []);
    const result: FitResult = await callGroq(env, jobText, corrections);

    let searchId: number | null = null;
    try {
      const ipHash = await hashIp(ip);
      searchId = await insertSearch(env, {
        jobText,
        jobUrl: jobUrlInput || null,
        result,
        ipHash,
      });
    } catch {
      // Persistence is best-effort; don't fail the user's request if it breaks.
    }

    return json({ ...result, searchId }, 200, origin);
  } catch (e) {
    return json({ error: (e as Error).message || "Analysis failed." }, 502, origin);
  }
}

async function handleFeedback(request: Request, env: Env, origin: string | null): Promise<Response> {
  let body: { searchId?: number; rating?: string; comment?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400, origin);
  }

  if (
    typeof body.searchId !== "number" ||
    (body.rating !== "accurate" && body.rating !== "inaccurate")
  ) {
    return json({ error: "Invalid feedback payload." }, 400, origin);
  }

  try {
    await insertFeedback(env, {
      searchId: body.searchId,
      rating: body.rating,
      comment: (body.comment || "").trim().slice(0, 2000) || null,
    });
    return json({ ok: true }, 200, origin);
  } catch (e) {
    return json({ error: (e as Error).message || "Failed to save feedback." }, 500, origin);
  }
}

function isAdminAuthed(request: Request, env: Env): boolean {
  if (!env.ADMIN_KEY) return false;
  const key = request.headers.get("X-Admin-Key") || new URL(request.url).searchParams.get("key");
  return key === env.ADMIN_KEY;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (url.pathname === "/admin" && request.method === "GET") {
      return new Response(renderAdminPage(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (url.pathname === "/stats" && request.method === "GET") {
      if (!isAdminAuthed(request, env)) {
        return json({ error: "Unauthorized." }, 401, origin);
      }
      try {
        const stats = await getStats(env);
        return json(stats, 200, origin);
      } catch (e) {
        return json({ error: (e as Error).message || "Failed to load stats." }, 500, origin);
      }
    }

    if (url.pathname === "/analyze" && request.method === "POST") {
      return handleAnalyze(request, env, origin);
    }

    if (url.pathname === "/feedback" && request.method === "POST") {
      return handleFeedback(request, env, origin);
    }

    if (request.method !== "GET" && request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405, origin);
    }

    return json({ error: "Not found." }, 404, origin);
  },
};
