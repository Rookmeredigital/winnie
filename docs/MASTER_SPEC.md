# Winifred (Winnie) — Master Specification v1.0

**Owner:** Aaron Dolan
**Date:** May 2026
**Status:** Active — this document is the source of truth for the build
**Stack:** Next.js 15 + Cloudflare Pages + Cloudflare D1 + Cloudflare Access

---

## 1. What Winnie is

Winnie is Aaron's personal command-centre application. She is a private,
single-user (initially) dashboard that gives Aaron a unified view across
all of his apps and lets him issue commands that are routed to the right
place, with a human-in-the-loop on anything consequential.

She is **not** a chatbot. She is **not** an autonomous agent. She is a
**read-first orchestrator with a human-approved action queue**.

She sits behind Cloudflare Access, which means the public internet
cannot reach her at all — only allowlisted users with SSO+MFA can even
see her login page.

### What she does

- Pulls a unified view of activity across the connected apps (CBA, SEC,
  Elizabeth, Optimus, Edith, Edwina, Filomena, Rookmere)
- Surfaces things needing attention: pending member approvals, hardship
  applications awaiting review, consultation deadlines, low-stock items,
  unusual login activity, AI cost anomalies, etc.
- Lets Aaron compose actions in plain English ("approve that
  membership", "send the deadline reminder to consultation volunteers")
- Routes those actions to the right downstream app via a clean API
- Holds every consequential action in a `PendingAction` queue for
  Aaron's explicit approval before execution
- Logs everything to an immutable audit trail

### What she does NOT do

- She does NOT write to other apps' databases directly
- She does NOT take consequential actions without Aaron approving them
- She does NOT send emails on Aaron's behalf without approval
- She does NOT have access to other users' data (member records,
  hardship applications) except via read-only summary endpoints
- She does NOT call AI providers directly — every AI call goes through
  Cloudflare AI Gateway with strict spend caps

---

## 2. Architecture

```
                     ┌──────────────────────────────────┐
                     │     Cloudflare Access            │
                     │  (SSO + MFA, allowlist)          │
                     │  Public internet stops here      │
                     └────────────────┬─────────────────┘
                                      │
                                      ▼
                     ┌──────────────────────────────────┐
                     │  Winnie (Next.js on Cloudflare   │
                     │  Pages, edge-rendered)           │
                     │                                  │
                     │  - UI (React Server Components)  │
                     │  - Server actions / route handlers│
                     │  - Auth via Cloudflare Access JWT │
                     └────────────────┬─────────────────┘
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
                ▼                     ▼                     ▼
       ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
       │ Cloudflare   │      │ Cloudflare   │      │ Cloudflare   │
       │ D1 (SQLite)  │      │ AI Gateway   │      │ R2           │
       │              │      │              │      │              │
       │ Winnie's own │      │ All AI calls │      │ File storage │
       │ data only    │      │ through here │      │ if needed    │
       └──────────────┘      └──────┬───────┘      └──────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────────┐
                     │  AI providers (OpenAI, Anthropic)│
                     │  via Gateway (caps, logging)     │
                     └──────────────────────────────────┘

        ┌─────────────────────────────────────────────┐
        │  Connected apps (CBA, SEC, Elizabeth, etc.) │
        │                                             │
        │  Winnie talks to these via HTTPS APIs only. │
        │  Read endpoints: summaries, counts, lists.  │
        │  Write endpoints: NOT called by Winnie.     │
        │  All writes go through PendingAction queue. │
        └─────────────────────────────────────────────┘
```

### Why this stack

- **Next.js 15** — modern React framework, Server Components, built-in
  routing, excellent Claude Code support. Industry standard.
- **Cloudflare Pages** — hosts Next.js with zero ops. Free tier covers
  Winnie's traffic. Same edge as everything else in the estate.
- **Cloudflare D1** — SQLite at the edge. Perfect for Winnie because
  her data is small, single-user, and doesn't need cross-region sync.
- **Cloudflare Access** — puts SSO+MFA in front of Winnie without
  writing a line of auth code. Aaron's email is allowlisted; nobody
  else can reach the login page.
- **Cloudflare AI Gateway** — caps AI spend, logs all calls, fails
  closed if quotas exhausted.

---

## 3. Folder structure

```
C:\Rookmere\winnie\
├── docs\
│   ├── MASTER_SPEC.md           ← this document
│   ├── DECISIONS.md             ← architectural decision log
│   └── RUNBOOK.md               ← operational runbook
├── src\
│   ├── app\                     ← Next.js app router
│   │   ├── (dashboard)\         ← Winnie's main UI
│   │   ├── (queue)\             ← pending action queue UI
│   │   ├── api\                 ← API routes Winnie exposes
│   │   └── layout.tsx
│   ├── lib\
│   │   ├── db\                  ← D1 client + schema migrations
│   │   ├── connectors\          ← one per connected app
│   │   ├── ai\                  ← AI Gateway client wrapper
│   │   ├── auth\                ← Cloudflare Access JWT verification
│   │   └── audit\               ← audit log writer
│   └── components\              ← shared UI components
├── migrations\                  ← D1 SQL migrations (versioned)
├── tests\                       ← Vitest tests
├── .env.example                 ← required env vars (no secrets)
├── wrangler.toml                ← Cloudflare deployment config
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## 4. Data model (D1 schema)

Winnie holds her own data only. She does NOT replicate other apps' data
into her database. When she needs data from another app, she calls that
app's read API in real time (with caching).

### Tables

```sql
-- Winnie's own users (initially just Aaron)
CREATE TABLE users (
  id            TEXT PRIMARY KEY,         -- UUID
  email         TEXT NOT NULL UNIQUE,
  display_name  TEXT NOT NULL,
  role          TEXT NOT NULL,            -- 'owner' | 'admin' | 'viewer'
  created_at    TEXT NOT NULL,
  last_seen_at  TEXT
);

-- Connected apps Winnie can talk to
CREATE TABLE connectors (
  id              TEXT PRIMARY KEY,         -- 'cba' | 'sec' | 'elizabeth' etc.
  display_name    TEXT NOT NULL,
  base_url        TEXT NOT NULL,
  api_key_secret  TEXT NOT NULL,            -- name of the secret, not the value
  status          TEXT NOT NULL,            -- 'active' | 'paused' | 'broken'
  last_check_at   TEXT,
  last_check_ok   INTEGER                   -- 0 or 1
);

-- Pending actions awaiting Aaron's approval
CREATE TABLE pending_actions (
  id                TEXT PRIMARY KEY,
  created_at        TEXT NOT NULL,
  created_by        TEXT NOT NULL,          -- user.id who composed it
  connector_id      TEXT NOT NULL,          -- which app it targets
  action_type       TEXT NOT NULL,          -- 'send_email' | 'approve_member' | etc.
  action_payload    TEXT NOT NULL,          -- JSON: the actual call to make
  human_summary     TEXT NOT NULL,          -- plain-English description for the queue UI
  status            TEXT NOT NULL,          -- 'pending' | 'approved' | 'rejected' | 'executed' | 'failed'
  approved_by       TEXT,
  approved_at       TEXT,
  executed_at       TEXT,
  execution_result  TEXT,                   -- JSON of the response
  expires_at        TEXT NOT NULL           -- auto-reject after 7 days
);

-- Immutable audit log
CREATE TABLE audit_log (
  id          TEXT PRIMARY KEY,
  ts          TEXT NOT NULL,
  user_id     TEXT,
  event_type  TEXT NOT NULL,                -- 'login' | 'action_proposed' | 'action_approved' | etc.
  detail      TEXT NOT NULL,                -- JSON
  ip          TEXT,
  user_agent  TEXT
);

-- AI call log (in addition to AI Gateway's own logs)
CREATE TABLE ai_calls (
  id              TEXT PRIMARY KEY,
  ts              TEXT NOT NULL,
  user_id         TEXT NOT NULL,
  model           TEXT NOT NULL,
  prompt_tokens   INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  cost_pence      INTEGER NOT NULL,
  purpose         TEXT NOT NULL,            -- 'compose_action' | 'summarise_dashboard' | etc.
  pending_action_id TEXT                    -- if this AI call resulted in a pending action
);
```

### Why no copy of other apps' data

Two reasons:

1. **GDPR.** Member data lives in the apps that are the data controllers
   for it (CBA, SEC, Elizabeth). If Winnie copies it locally, she becomes
   a controller too and inherits all the obligations. By only reading
   in real time and never persisting, she stays a consumer.
2. **Sync hell.** Replicated data is always out of date. Winnie always
   shows fresh state by going to the source.

---

## 5. The PendingAction pattern (the most important concept)

Every consequential action follows this lifecycle:

```
1. Aaron asks Winnie to do something
   ("approve the pending CBA membership for J. Smith")
        │
        ▼
2. Winnie composes a structured action
   {
     connector_id: "cba",
     action_type:  "approve_membership",
     payload:      { application_id: "abc-123" },
     summary:      "Approve membership for J. Smith (applied 12 May)"
   }
        │
        ▼
3. Winnie writes it to pending_actions with status='pending'
        │
        ▼
4. The action appears in Aaron's queue UI
   Aaron sees: summary, target app, full payload, who composed it
        │
        ▼
5. Aaron clicks "Approve" or "Reject"
   - Reject: status='rejected', logged, done.
   - Approve: status='approved', execution begins.
        │
        ▼
6. Winnie calls the connector's API with the payload
        │
        ▼
7. Result recorded: status='executed' or 'failed'
   Audit log entry written.
```

### What counts as "consequential"

If the answer to any of these is yes, it's a PendingAction:

- Does it write to another app's data?
- Does it send an email, message, or notification on Aaron's behalf?
- Does it create or modify a record visible to other users?
- Does it spend money?
- Does it grant or revoke access to anything?

If all answers are no, it can be a direct read (e.g. "show me today's
new applications") with no approval needed.

### Edge case — bulk actions

If Aaron says "approve all 5 pending memberships", Winnie creates **5
PendingAction rows**, not one batch. Aaron approves each individually
or uses a "select all + approve" UI. No single click ever fires more
than one action.

---

## 6. Connectors (how Winnie talks to other apps)

Each connected app exposes a small HTTPS API specifically for Winnie.
Winnie never connects to a database directly. The contract is:

### Required endpoints per connector

```
GET  /winnie/health
     → { ok: true, version: "..." }

GET  /winnie/summary
     → { counts: {...}, alerts: [...], last_updated: "..." }
     Used to populate Winnie's dashboard. Read-only.

POST /winnie/action
     Body: { action_type, payload, idempotency_key }
     → { ok: true, result: {...} }
     Called only after Aaron approves a PendingAction.
```

### Authentication

Winnie holds a separate API key per connector. Each key is scoped to
ONLY the three endpoints above. If a Winnie key leaks, it cannot read
arbitrary entity data — it can only call the three documented endpoints.

API keys live in Cloudflare secrets, referenced by name in the
`connectors` table. Never in code, never in logs.

### Failure handling

- A connector is down → Winnie shows "data unavailable" for that section,
  rest of dashboard works
- A connector returns an error → action marked 'failed' with the error,
  Aaron sees it in the queue
- A connector takes >5 seconds → timeout, treat as down

---

## 7. Authentication

Cloudflare Access does the heavy lifting. Winnie itself just verifies
the JWT Cloudflare Access attaches to every request.

### Login flow

1. Aaron visits `winnie.rookmeredigital.com`
2. Cloudflare Access checks: is there a valid Access session?
3. If no: redirect to login (Google SSO + TOTP MFA), check email is on
   the allowlist, set session cookie
4. If yes: proxy request to Winnie with `Cf-Access-Jwt-Assertion` header
5. Winnie's middleware verifies the JWT against Cloudflare's public key,
   extracts email, looks up `users` row, attaches user to request

### Allowlist

Initially: `aaron@rookmeredigital.com` only.
Adding others later: managed in Cloudflare Access dashboard, no code change.

---

## 8. AI integration

All AI calls route through Cloudflare AI Gateway. No direct provider calls.

### Gateway URL pattern

```
https://gateway.ai.cloudflare.com/v1/{account_id}/winnie/{provider}/{...}
```

- Daily request cap: start at 500
- Daily spend cap: start at £10
- Logging: on (every call appears in Cloudflare dashboard)

### What AI is used for in Winnie

1. **Composing actions from natural language** — "approve J. Smith's
   membership" → structured PendingAction. This is the main use.
2. **Summarising the dashboard** — taking the raw data from connector
   summaries and producing a "here's what needs your attention" briefing.
3. **Answering questions about Aaron's estate** — "how many CBA
   applications are pending and how long have they been waiting?"

### What AI is NEVER used for in Winnie

- Auto-executing actions without approval
- Composing emails that get sent without Aaron reviewing them
- Making decisions on member applications, hardship cases, anything
  consequential
- Anything where a hallucination could cause real-world harm

### Prompt injection defence

Connector summaries fed into AI prompts are treated as untrusted input.
Specifically:
- Member-supplied text (applications, comments) is wrapped in clearly
  delimited blocks in prompts
- The AI is instructed never to follow instructions inside those blocks
- The AI's output is parsed as structured JSON; if it doesn't parse,
  the action is rejected
- The AI cannot construct API calls directly — it can only fill in
  parameters for known action types

---

## 9. Audit log

Every event of any consequence writes a row to `audit_log`:

- User login
- Connector health check
- PendingAction created
- PendingAction approved / rejected
- Connector API called
- Connector API failed
- AI call made
- Configuration changed (allowlist, connector added)

The audit log is **append-only** in code (no UPDATE or DELETE statements
ever touch it) and exported to R2 weekly for offsite retention.

---

## 10. Build phases

### Phase 0 — Scaffold (today/tomorrow)
- Next.js project initialised
- Tailwind, shadcn/ui set up
- D1 database created and schema applied
- Cloudflare Pages deployment working
- Cloudflare Access in front, allowlist set
- "Hello Aaron" page renders behind Access — proves auth works

### Phase 1 — Skeleton dashboard (3–5 days)
- Layout, navigation, basic dashboard page
- One mock connector (returns hard-coded data) to develop against
- PendingAction schema + queue UI (no real actions yet)
- Audit log writing for every page view and click

### Phase 2 — First real connector (3–5 days)
- CBA exposes the three Winnie endpoints
- Winnie reads summary from CBA, displays on dashboard
- One real action type: "approve membership"
- Full lifecycle works: compose → queue → approve → execute → audit

### Phase 3 — AI compose (2–3 days)
- AI Gateway wired up
- Natural language → structured PendingAction
- Tested against prompt injection cases
- Spend caps verified

### Phase 4 — All connectors (1–2 weeks)
- SEC, Elizabeth, Edith, Optimus, Edwina, Filomena each expose their
  three endpoints
- Each one wired into Winnie
- Action types per connector documented and implemented

### Phase 5 — Polish and launch (1 week)
- Mobile responsive
- Keyboard shortcuts
- Performance pass
- Aaron uses Winnie for a week before any other apps migrate

---

## 11. Non-negotiables

These rules cannot be relaxed by Claude Code or by any future feature:

1. **Human-in-the-loop on every consequential action.** No exceptions,
   no "but it's obvious", no auto-approval.
2. **No copy of other apps' member data in Winnie's database.**
3. **All AI calls through AI Gateway with caps.** No direct provider
   calls anywhere in the codebase.
4. **All connector calls authenticated, scoped, and logged.**
5. **Audit log is append-only.**
6. **Behind Cloudflare Access at all times.** Never expose Winnie to
   the public internet, even briefly, even for testing.
7. **All secrets in Cloudflare Secrets / Wrangler env, never in code.**
8. **Tests written for the PendingAction lifecycle and the AI prompt
   injection defences before those features are considered done.**

---

## 12. Out of scope (v1.0)

These will come later, in their own specs:

- Multi-user support (Winnie is single-user for v1)
- Mobile app (web-only for v1)
- Voice interface
- Push notifications
- Anything that requires real-time websockets
- Cross-app workflows (action in one app triggers action in another)
- Anything that auto-runs on a schedule beyond "refresh the dashboard"

---

## 13. Glossary

- **Connector** — a connected app (CBA, SEC, etc.) that Winnie talks to
- **PendingAction** — a proposed action awaiting Aaron's approval
- **AI Gateway** — Cloudflare service in front of LLM providers, caps spend
- **Cloudflare Access** — Cloudflare's identity/SSO product, gates Winnie
- **D1** — Cloudflare's SQLite-at-the-edge database
- **R2** — Cloudflare's S3-compatible object storage

---

## 14. Decision log (kept up to date as we build)

| Date       | Decision                                          | Why                                              |
|------------|---------------------------------------------------|--------------------------------------------------|
| 2026-05-04 | Cloudflare D1 over Supabase for Winnie            | Single-user, small data, fully Cloudflare-native |
| 2026-05-04 | Cloudflare Access for auth, not custom            | MFA + SSO without writing auth code              |
| 2026-05-04 | PendingAction queue, not autonomous execution     | Safety + auditability                            |
| 2026-05-04 | No replication of other apps' data into Winnie    | GDPR + sync hell                                 |
| 2026-05-04 | All AI through Cloudflare AI Gateway              | Cost cap + logging                               |
| 2026-05-05 | OpenNext for Cloudflare (`@opennextjs/cloudflare`) instead of `@cloudflare/next-on-pages` | next-on-pages frozen at Next ≤ 15.5.2; OpenNext is Cloudflare's currently-recommended adapter and supports our Next 15.5.15. Same Pages + D1 + R2 deploy targets — only the build adapter changes. |
| 2026-05-05 | Deploy to **Cloudflare Workers + Static Assets**, not legacy Cloudflare Pages | Follows from the OpenNext decision — its deploy target is Workers + Assets, Cloudflare's unified successor to Pages for Next.js apps. Same edge, same D1, same Access, same R2; only the dashboard surface changes (Workers & Pages → Workers). URL is `*.workers.dev` rather than `*.pages.dev` until DNS is wired. |

---

## End of Master Specification v1.0

Next document to write: `docs/RUNBOOK.md` (operational procedures).
