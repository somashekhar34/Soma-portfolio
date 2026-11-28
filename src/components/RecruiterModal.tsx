import { useEffect, useState } from "react";
import {
  X,
  Link2,
  FileText,
  Loader2,
  CheckCircle2,
  MinusCircle,
  XCircle,
  Sparkles,
} from "lucide-react";
import { FIT_ANALYZER_URL } from "../config";

type BreakdownItem = { requirement: string; status: string; note: string };
type FitResult = {
  score: number;
  verdict: string;
  breakdown: BreakdownItem[];
  pitch: string;
};

function scoreColor(score: number) {
  if (score >= 75) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-rose-500";
}

function StatusIcon({ status }: { status: string }) {
  if (status === "match") return <CheckCircle2 size={16} className="flex-none text-emerald-500" />;
  if (status === "gap") return <XCircle size={16} className="flex-none text-rose-500" />;
  return <MinusCircle size={16} className="flex-none text-amber-500" />;
}

export default function RecruiterModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"text" | "url">("text");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FitResult | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const canSubmit = value.trim().length > 0 && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(FIT_ANALYZER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "text" ? { jobText: value } : { jobUrl: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setResult(data as FitResult);
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      if (/fetch|network|failed to fetch/i.test(message) || !message) {
        setError("Couldn't reach the analysis service. Please try again in a moment.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setValue("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 px-4 py-10 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-accent-600 dark:text-accent-400">
              <Sparkles size={16} />
              <span className="text-xs font-semibold uppercase tracking-wide">For Recruiters</span>
            </div>
            <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              How well do I fit your role?
            </h3>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X size={18} />
          </button>
        </div>

        {!result && (
          <>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Paste a job description or a link to one, and get an AI-generated breakdown of how my
              background matches.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setMode("text")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  mode === "text"
                    ? "bg-accent-600 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <FileText size={13} /> Paste Description
              </button>
              <button
                onClick={() => setMode("url")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  mode === "url"
                    ? "bg-accent-600 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <Link2 size={13} /> Paste URL
              </button>
            </div>

            <div className="mt-3">
              {mode === "text" ? (
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={6}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none ring-accent-500/30 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              ) : (
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="https://company.com/careers/job-123"
                  type="url"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none ring-accent-500/30 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              )}
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Analyzing...
                </>
              ) : (
                "Analyze Fit"
              )}
            </button>
          </>
        )}

        {result && (
          <div className="mt-4">
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <div className={`text-4xl font-extrabold ${scoreColor(result.score)}`}>
                {result.score}
                <span className="text-lg text-slate-400 dark:text-slate-500">/100</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{result.verdict}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI-generated fit score</p>
              </div>
            </div>

            <ul className="mt-4 space-y-2.5">
              {result.breakdown.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <StatusIcon status={item.status} />
                  <div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {item.requirement}
                    </span>
                    <p className="text-slate-500 dark:text-slate-400">{item.note}</p>
                  </div>
                </li>
              ))}
            </ul>

            <blockquote className="mt-4 rounded-xl border-l-4 border-accent-500 bg-accent-50 p-4 text-sm italic text-slate-700 dark:bg-accent-500/10 dark:text-slate-300">
              "{result.pitch}"
            </blockquote>

            <button
              onClick={reset}
              className="mt-4 w-full rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-accent-400 hover:text-accent-600 dark:border-slate-700 dark:text-slate-200"
            >
              Analyze another role
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
