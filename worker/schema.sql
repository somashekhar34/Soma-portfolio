CREATE TABLE IF NOT EXISTS searches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  job_text TEXT NOT NULL,
  job_url TEXT,
  score INTEGER NOT NULL,
  verdict TEXT NOT NULL,
  breakdown_json TEXT NOT NULL,
  pitch TEXT NOT NULL,
  ip_hash TEXT
);

CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  search_id INTEGER NOT NULL REFERENCES searches(id),
  rating TEXT NOT NULL CHECK (rating IN ('accurate', 'inaccurate')),
  comment TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_feedback_search_id ON feedback(search_id);
CREATE INDEX IF NOT EXISTS idx_searches_created_at ON searches(created_at);
