# Soma Fit Analyzer — Cloudflare Worker

Backend for the portfolio's "For Recruiters" feature. Accepts a job description
(text or URL) and returns an AI-generated fit analysis (score, breakdown, pitch)
using Meta's open-source Llama 3.3 70B model, served free via Groq.

## One-time setup

1. **Get a free Groq API key**: sign up at https://console.groq.com, go to
   API Keys, and create one.

2. **Install dependencies**:
   ```bash
   cd worker
   npm install
   ```

3. **Log in to Cloudflare** (opens a browser to authorize):
   ```bash
   npx wrangler login
   ```

4. **Create the KV namespace** used for rate limiting:
   ```bash
   npx wrangler kv namespace create RATE_LIMIT
   ```
   This prints an `id`. Copy it into `wrangler.toml`, replacing
   `REPLACE_WITH_KV_NAMESPACE_ID`.

5. **Store the Groq API key as a secret** (never goes in the code or git):
   ```bash
   npx wrangler secret put GROQ_API_KEY
   ```
   Paste the key when prompted.

6. **Deploy**:
   ```bash
   npm run deploy
   ```
   This prints the Worker's URL, e.g. `https://soma-fit-analyzer.<your-subdomain>.workers.dev`.
   Copy that URL — it goes into the frontend's `VITE_FIT_ANALYZER_URL` config.

## Local development

```bash
cp .dev.vars.example .dev.vars   # fill in a real Groq key
npm run dev
```

## Endpoint

`POST /analyze`

Request body (one of):
```json
{ "jobText": "..." }
{ "jobUrl": "https://..." }
```

Response:
```json
{
  "score": 82,
  "verdict": "Strong Match",
  "breakdown": [
    { "requirement": "5+ years Python/SQL", "status": "match", "note": "..." }
  ],
  "pitch": "..."
}
```

Rate-limited to 6 requests/hour per IP, counted only on requests that actually
reach the model (invalid input doesn't consume quota).
