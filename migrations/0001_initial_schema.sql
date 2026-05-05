-- Winnie initial schema. Mirrors docs/MASTER_SPEC.md section 4.
-- All timestamps are ISO 8601 strings (UTC).

-- Winnie's own users (initially just Aaron).
CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  display_name  TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'viewer')),
  created_at    TEXT NOT NULL,
  last_seen_at  TEXT
);

-- Connected apps Winnie can talk to.
CREATE TABLE connectors (
  id              TEXT PRIMARY KEY,
  display_name    TEXT NOT NULL,
  base_url        TEXT NOT NULL,
  api_key_secret  TEXT NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('active', 'paused', 'broken')),
  last_check_at   TEXT,
  last_check_ok   INTEGER CHECK (last_check_ok IN (0, 1))
);

-- Pending actions awaiting Aaron's approval. The heart of the
-- human-in-the-loop pattern (spec section 5).
CREATE TABLE pending_actions (
  id                TEXT PRIMARY KEY,
  created_at        TEXT NOT NULL,
  created_by        TEXT NOT NULL REFERENCES users(id),
  connector_id      TEXT NOT NULL REFERENCES connectors(id),
  action_type       TEXT NOT NULL,
  action_payload    TEXT NOT NULL,
  human_summary     TEXT NOT NULL,
  status            TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'executed', 'failed')),
  approved_by       TEXT REFERENCES users(id),
  approved_at       TEXT,
  executed_at       TEXT,
  execution_result  TEXT,
  expires_at        TEXT NOT NULL
);

CREATE INDEX idx_pending_actions_status_created
  ON pending_actions(status, created_at DESC);

CREATE INDEX idx_pending_actions_expires
  ON pending_actions(expires_at);

-- Immutable audit log. Append-only by code (spec section 9, §11.5).
CREATE TABLE audit_log (
  id          TEXT PRIMARY KEY,
  ts          TEXT NOT NULL,
  user_id     TEXT REFERENCES users(id),
  event_type  TEXT NOT NULL,
  detail      TEXT NOT NULL,
  ip          TEXT,
  user_agent  TEXT
);

CREATE INDEX idx_audit_log_ts        ON audit_log(ts DESC);
CREATE INDEX idx_audit_log_user_ts   ON audit_log(user_id, ts DESC);
CREATE INDEX idx_audit_log_event_ts  ON audit_log(event_type, ts DESC);

-- AI call log (in addition to AI Gateway's own logs). Spec section 8.
CREATE TABLE ai_calls (
  id                 TEXT PRIMARY KEY,
  ts                 TEXT NOT NULL,
  user_id            TEXT NOT NULL REFERENCES users(id),
  model              TEXT NOT NULL,
  prompt_tokens      INTEGER NOT NULL,
  completion_tokens  INTEGER NOT NULL,
  cost_pence         INTEGER NOT NULL,
  purpose            TEXT NOT NULL,
  pending_action_id  TEXT REFERENCES pending_actions(id)
);

CREATE INDEX idx_ai_calls_ts       ON ai_calls(ts DESC);
CREATE INDEX idx_ai_calls_user_ts  ON ai_calls(user_id, ts DESC);
