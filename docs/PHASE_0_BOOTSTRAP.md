# Phase 0 Bootstrap Prompt — Winnie

**Use this prompt to start Winnie's Phase 0 build in Claude Code.**

---

## How to use this document

1. Save this file to `C:\Rookmere\winnie\docs\PHASE_0_BOOTSTRAP.md`
2. Open Windows Terminal or VS Code's terminal
3. `cd C:\Rookmere\winnie`
4. Run: `claude`
5. Once Claude Code is open, paste **the prompt below** as your first message
6. Approve commands as Claude Code asks for them — read each one before
   approving

---

## What Phase 0 produces

By the end of this session you'll have:

- A real Next.js 15 app deployed live at `winnie.rookmeredigital.com`
- Cosmic theme already applied (electric violet, glass panels, dark
  background) — not generic Next.js wallpaper
- Cloudflare Pages hosting, automatically redeploying from GitHub
- Cloudflare D1 database with Winnie's full schema
- Cloudflare Access in front (you'll log in via Google + 2FA)
- The PendingAction queue table active and writeable
- The Audit log writing on every page view
- A "Welcome, Aaron" landing page that proves the whole stack works

That's a real, deployed, secured application. **End of today.**

---

## What's NOT in Phase 0

To keep today focused, these are explicitly out of scope:

- Real connectors to other apps (mock data only for now)
- AI integration (the Gateway is created, just not used yet)
- Voice interface (Phase 2)
- Email integration (Phase 3)
- Microsoft 365 setup (separate workstream)

We're building the empty room with proper walls, locks, plumbing, and
electrics. Furniture comes later.

---

## THE PROMPT — paste everything below this line into Claude Code

```
You are helping me build Winnie, my personal command-centre application.

Before doing anything else, read these documents in this order:

1. docs/MASTER_SPEC.md — the architectural constitution
2. docs/CAPABILITIES_ANNEX.md — what Winnie does day-to-day
3. docs/BUILD_STRUCTURE.md — phased build plan (we're doing Phase A
   Phase 0 today)
4. docs/DESIGN_SYSTEM.md — Winnie's cosmic theme tokens
5. docs/MAILBOX_MAP.md — for context on the eventual email integration

Treat the master spec's section 11 (non-negotiables) as inviolable
rules, not suggestions. If anything I ask you to do contradicts the
spec, push back and ask before proceeding.

Once you've read them, summarise back to me in your own words:
- What Winnie is, and what she explicitly does NOT do
- The architectural stack we're using (Cloudflare Pages, D1, Access,
  AI Gateway — Supabase is reserved for CBA/SEC, NOT Winnie)
- The PendingAction pattern and why it matters
- Today's specific scope (Phase 0)

Then check the environment:
- Confirm Node, npm, git versions
- Confirm we're in C:\Rookmere\winnie
- Confirm git status is clean
- Confirm the GitHub remote is configured

THEN propose a step-by-step plan for Phase 0. Do not execute yet.
Show me the plan, the commands you'd run, and what each step
produces. Wait for my explicit approval before running anything.

The Phase 0 plan should produce, in this order:

STEP 1 — Initialise Next.js 15
- Create a Next.js 15 project in this folder using:
  npx create-next-app@latest . --typescript --tailwind --app
  --src-dir --import-alias "@/*" --no-eslint
  (No git init — we already have a repo. Use the current folder.)
- Verify it builds and runs locally
- Commit

STEP 2 — Install supporting dependencies
- shadcn/ui CLI initialised with the New York style
- Framer Motion for animations
- lucide-react for icons
- @cloudflare/next-on-pages adapter for deploying to Cloudflare Pages
- wrangler CLI (for D1 management and deployment)
- Verify all installs cleanly
- Commit

STEP 3 — Apply Winnie's cosmic theme
- Configure Tailwind with the design tokens from docs/DESIGN_SYSTEM.md
  (cosmic-black, cosmic-deep, cosmic-purple, cosmic-mid, electric-violet,
  deep-indigo, aurora-blue, nebula-pink, star-white)
- Set up CSS variables in globals.css matching the spec
- Add Space Grotesk, Orbitron, IBM Plex Mono via next/font
- Style the default page with a glass panel, cosmic background,
  electric-violet accent, "Welcome, Aaron" heading
- This proves the theme works before we build any real UI
- Commit

STEP 4 — Set up Cloudflare D1 database
- Use wrangler to create a D1 database named "winnie-db"
- Add the binding to wrangler.toml
- Write SQL migrations matching docs/MASTER_SPEC.md section 4:
  users, connectors, pending_actions, audit_log, ai_calls
- Apply migrations to the local D1 instance
- Verify with a quick query
- Commit migrations to migrations/

STEP 5 — Auth via Cloudflare Access JWT verification
- Build src/lib/auth/access.ts that verifies the
  Cf-Access-Jwt-Assertion header on every request
- Middleware that rejects requests without a valid Access JWT
  (in dev mode, accept a mock identity)
- A "current user" helper that reads from the verified JWT
- Commit

STEP 6 — The PendingAction queue scaffold
- src/lib/db/pending-actions.ts — typed CRUD operations
- A simple list page at /queue showing all pending actions
  (will be empty initially)
- Style it cosmic — a glass panel listing rows
- Commit

STEP 7 — Audit log writer
- src/lib/audit/log.ts — writes a row on every page view
- Append-only by code (no UPDATE / DELETE in audit code path)
- Commit

STEP 8 — Deploy to Cloudflare Pages
- Set up Cloudflare Pages project pointed at the winnie GitHub repo
- Connect the D1 database binding
- Configure environment variables (Access team domain, AI Gateway URL
  placeholder)
- Push and verify the deployment succeeds
- The deployment should be on a *.pages.dev URL initially
- Commit

STEP 9 — DNS + Cloudflare Access wiring
- Add the winnie.rookmeredigital.com DNS record (CNAME to the
  pages.dev URL, proxied)
- In Cloudflare Access, create an Application:
  Name: Winnie
  URL: winnie.rookmeredigital.com
  Session: 24 hours
  Identity provider: Google (using aaron@rookmeredigital.com)
- Create a Policy: Email is aaron@rookmeredigital.com (allow)
- Test that visiting winnie.rookmeredigital.com prompts Google
  login + 2FA, then renders "Welcome, Aaron"
- Commit any final config

STEP 10 — Final commit and push
- Update README.md with Phase 0 completion notes
- Tag the commit as "phase-0-complete"
- Push everything

For every step, show me the diff before applying changes that touch
more than 20 lines. Always ask before running destructive commands.
Use British English in all UI copy and documentation. Use 2-space
indentation, semicolons, single quotes throughout the codebase.

If at any step something doesn't work, stop and tell me — don't try
to brute-force it. We'd rather pause and think than push broken code.

Begin by reading the docs.
```

---

## What to do during the session

1. **Read what Claude Code says back.** When it summarises the spec,
   make sure it actually got it — particularly the "Winnie does NOT
   write to other apps' databases" and the "all consequential actions
   go through the queue" parts. If it's hallucinated those bits, push
   back before proceeding.

2. **Approve commands carefully.** When Claude Code asks "run
   npx create-next-app@latest..." read it. Approve. When it asks to
   install something you haven't heard of, ask why before approving.

3. **Take breaks every 30-45 minutes.** Phase 0 is 2-3 hours; you
   don't have to do it in one sitting. Pause when Claude Code is
   between major steps.

4. **If something goes wrong** (an error, an unexpected behaviour,
   something feels off), stop and bring it back to this conversation.
   Don't try to debug with Claude Code while exhausted — that's how
   small mistakes become big ones. I'll help you reason through it.

5. **At the end of the session,** ask Claude Code to:
   - Write a "what we did today" summary in `docs/PHASE_0_LOG.md`
   - List any deferred items (things we noticed but didn't fix today)
   - Commit and push everything

---

## After Phase 0

When Phase 0 is complete and `winnie.rookmeredigital.com` is live
behind Access, come back here. We'll plan Phase A's remaining days
(Mon-Fri this week — CBA and SEC scaffolds in parallel) and the
subsequent phases.

You'll have a working, deployed, secured application by end of
today. That's the win.
