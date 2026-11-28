export function renderAdminPage(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Fit Analyzer — Market Dashboard</title>
<style>
  :root { color-scheme: dark; }
  body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 24px; }
  .wrap { max-width: 760px; margin: 0 auto; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  .sub { color: #94a3b8; font-size: 13px; margin-bottom: 24px; }
  .card { background: #1e293b; border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; }
  .stats-row { display: flex; gap: 16px; flex-wrap: wrap; }
  .stat { flex: 1; min-width: 140px; }
  .stat .num { font-size: 28px; font-weight: 700; }
  .stat .label { color: #94a3b8; font-size: 12px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #334155; }
  th { color: #94a3b8; font-weight: 500; }
  .bar { background: #4f46e5; height: 6px; border-radius: 3px; }
  .correction { padding: 10px 0; border-bottom: 1px solid #334155; }
  .correction:last-child { border-bottom: none; }
  .correction .meta { color: #64748b; font-size: 11px; margin-top: 2px; }
  input[type=password] { padding: 8px 10px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; width: 220px; }
  button { padding: 8px 16px; border-radius: 8px; border: none; background: #4f46e5; color: white; font-weight: 600; cursor: pointer; }
  .error { color: #f87171; font-size: 13px; margin-top: 8px; }
  #loading { display: none; color: #94a3b8; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Fit Analyzer — Market Dashboard</h1>
  <p class="sub">Aggregate signal from every recruiter search, for your eyes only.</p>

  <div id="gate" class="card">
    <input id="key" type="password" placeholder="Admin key" />
    <button onclick="load()">Load</button>
    <div id="loading">Loading…</div>
    <div id="error" class="error"></div>
  </div>

  <div id="dashboard" style="display:none">
    <div class="card stats-row">
      <div class="stat"><div class="num" id="totalSearches">—</div><div class="label">Total searches</div></div>
      <div class="stat"><div class="num" id="avgScore">—</div><div class="label">Average score</div></div>
      <div class="stat"><div class="num" id="accurateCount">—</div><div class="label">Marked accurate</div></div>
      <div class="stat"><div class="num" id="inaccurateCount">—</div><div class="label">Marked inaccurate</div></div>
    </div>

    <div class="card">
      <h3 style="margin-top:0">Most requested skills you're missing</h3>
      <table id="gapsTable"><thead><tr><th>Requirement</th><th>Times flagged as a gap</th><th></th></tr></thead><tbody></tbody></table>
    </div>

    <div class="card">
      <h3 style="margin-top:0">Recent corrections</h3>
      <div id="corrections"></div>
    </div>
  </div>
</div>

<script>
async function load() {
  const key = document.getElementById('key').value;
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  error.textContent = '';
  loading.style.display = 'block';
  try {
    const res = await fetch('/stats', { headers: { 'X-Admin-Key': key } });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || ('HTTP ' + res.status));
    }
    const data = await res.json();
    localStorage.setItem('soma_admin_key', key);
    render(data);
  } catch (e) {
    error.textContent = e.message || 'Failed to load.';
  } finally {
    loading.style.display = 'none';
  }
}

function render(data) {
  document.getElementById('gate').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('totalSearches').textContent = data.totalSearches;
  document.getElementById('avgScore').textContent = data.averageScore ?? '—';
  document.getElementById('accurateCount').textContent = (data.feedback && data.feedback.accurate) || 0;
  document.getElementById('inaccurateCount').textContent = (data.feedback && data.feedback.inaccurate) || 0;

  const maxCount = Math.max(1, ...data.topGapRequirements.map(g => g.count));
  const tbody = document.querySelector('#gapsTable tbody');
  tbody.innerHTML = data.topGapRequirements.map(g => \`
    <tr>
      <td>\${escapeHtml(g.requirement)}</td>
      <td>\${g.count}</td>
      <td style="width:120px"><div class="bar" style="width:\${Math.round((g.count / maxCount) * 100)}%"></div></td>
    </tr>
  \`).join('') || '<tr><td colspan="3">No data yet.</td></tr>';

  const corrections = document.getElementById('corrections');
  corrections.innerHTML = data.recentCorrections.map(c => \`
    <div class="correction">
      <div>\${escapeHtml(c.comment)}</div>
      <div class="meta">\${new Date(c.createdAt).toLocaleString()} · re: "\${escapeHtml(c.jobExcerpt)}..."</div>
    </div>
  \`).join('') || '<p style="color:#64748b">No corrections yet.</p>';
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

const saved = localStorage.getItem('soma_admin_key');
if (saved) {
  document.getElementById('key').value = saved;
  load();
}
</script>
</body>
</html>`;
}
