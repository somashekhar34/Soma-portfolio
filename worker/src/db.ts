import type { Env } from "./index";
import type { FitResult } from "./groq";

export async function insertSearch(
  env: Env,
  args: { jobText: string; jobUrl: string | null; result: FitResult; ipHash: string },
): Promise<number> {
  const res = await env.DB.prepare(
    `INSERT INTO searches (job_text, job_url, score, verdict, breakdown_json, pitch, ip_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      args.jobText.slice(0, 20000),
      args.jobUrl,
      args.result.score,
      args.result.verdict,
      JSON.stringify(args.result.breakdown),
      args.result.pitch,
      args.ipHash,
    )
    .run();
  return res.meta.last_row_id as number;
}

export async function insertFeedback(
  env: Env,
  args: { searchId: number; rating: "accurate" | "inaccurate"; comment: string | null },
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO feedback (search_id, rating, comment) VALUES (?, ?, ?)`,
  )
    .bind(args.searchId, args.rating, args.comment)
    .run();
}

export async function getRecentCorrections(env: Env, limit = 8): Promise<string[]> {
  const res = await env.DB.prepare(
    `SELECT comment FROM feedback
     WHERE rating = 'inaccurate' AND comment IS NOT NULL AND trim(comment) != ''
     ORDER BY created_at DESC
     LIMIT ?`,
  )
    .bind(limit)
    .all<{ comment: string }>();
  return (res.results || []).map((r) => r.comment);
}

type GapTally = { requirement: string; count: number };

export async function getStats(env: Env) {
  const totalsRow = await env.DB.prepare(
    `SELECT COUNT(*) as total, AVG(score) as avg_score FROM searches`,
  ).first<{ total: number; avg_score: number | null }>();

  const feedbackRows = await env.DB.prepare(
    `SELECT rating, COUNT(*) as count FROM feedback GROUP BY rating`,
  ).all<{ rating: string; count: number }>();

  const recentBreakdowns = await env.DB.prepare(
    `SELECT breakdown_json FROM searches ORDER BY created_at DESC LIMIT 300`,
  ).all<{ breakdown_json: string }>();

  const gapTally = new Map<string, number>();
  for (const row of recentBreakdowns.results || []) {
    try {
      const items = JSON.parse(row.breakdown_json) as { requirement: string; status: string }[];
      for (const item of items) {
        if (item.status !== "gap") continue;
        const key = item.requirement.trim().toLowerCase();
        if (!key) continue;
        gapTally.set(key, (gapTally.get(key) || 0) + 1);
      }
    } catch {
      // skip malformed rows
    }
  }
  const topGaps: GapTally[] = [...gapTally.entries()]
    .map(([requirement, count]) => ({ requirement, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const corrections = await env.DB.prepare(
    `SELECT f.comment, f.created_at, s.job_text
     FROM feedback f JOIN searches s ON s.id = f.search_id
     WHERE f.rating = 'inaccurate' AND f.comment IS NOT NULL AND trim(f.comment) != ''
     ORDER BY f.created_at DESC
     LIMIT 30`,
  ).all<{ comment: string; created_at: string; job_text: string }>();

  return {
    totalSearches: totalsRow?.total ?? 0,
    averageScore: totalsRow?.avg_score ? Math.round(totalsRow.avg_score * 10) / 10 : null,
    feedback: Object.fromEntries((feedbackRows.results || []).map((r) => [r.rating, r.count])),
    topGapRequirements: topGaps,
    recentCorrections: (corrections.results || []).map((r) => ({
      comment: r.comment,
      createdAt: r.created_at,
      jobExcerpt: r.job_text.slice(0, 160),
    })),
  };
}
