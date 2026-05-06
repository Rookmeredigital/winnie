# Phase 0 — Build log

**Date:** 2026-05-06 (close-of-day)
**Scope:** Phase 0 scaffold for Winnie. See `MASTER_SPEC.md`, `BUILD_STRUCTURE.md` Phase A, `PHASE_0_BOOTSTRAP.md`.

## What landed

**Steps 1–7** (committed 5–6 May):

1. Next.js 15.5.15 — App Router, TypeScript, Tailwind v4, `src/`, no ESLint
2. Supporting deps — shadcn/ui, OpenNext for Cloudflare, framer-motion, lucide-react, jose, wrangler
3. Cosmic theme — palette, fonts (Space Grotesk / Orbitron / IBM Plex Mono), glass landing, "Welcome, Aaron"
4. Cloudflare D1 `winnie-db` (id `a41ddd4d-75a7-4af1-adbf-4143713d2bde`) with the spec schema — 5 tables, 7 indexes, CHECK constraints, FKs
5. Cloudflare Access JWT verification (jose), middleware that strips spoofed identity headers and verifies; mock identity in dev / `WINNIE_ALLOW_NO_ACCESS=1` window
6. PendingAction CRUD, users upsert, `/queue` page (empty)
7. Append-only audit log writer (one INSERT, zero UPDATE/DELETE); middleware writes `page_view` on every non-static request

**Step 8 partial — sub-steps A–D done:**

- **8A** OpenNext config + Workers + Static Assets deploy wiring (`open-next.config.ts`, `wrangler.jsonc` revisions, package scripts, `.gitignore`)
- **8B** `0001_initial_schema.sql` applied to remote D1 — 5 tables present, served from LHR
- **8C** First production deploy via `npm run deploy`
- **8D** Smoke test green after two fixes (below)

**Two fixes shipped during 8C/8D:**

- `fix(build): drop turbopack from production build` — `next build --turbopack` produces chunks OpenNext's Worker runtime can't resolve (`[root-of-the-server]__*._.js` naming). Webpack-only for production; dev stays on turbopack.
- `fix(audit): write null user_id in mock window (FK-safe)` — middleware was passing `'mock-aaron'` as `user_id`; FK constraint into `users` fired (silently caught, but breaks the audit trail). Now writes NULL during the `WINNIE_ALLOW_NO_ACCESS=1` window.

## Live state

| | |
|---|---|
| URL | `https://winnie.hisnameisaaron.workers.dev` |
| Worker version | `da7abae0-11b6-4876-a0d8-ce20f69b350a` |
| Worker startup | 27 ms |
| Bindings | `DB` (winnie-db), `ASSETS`, `CF_ACCESS_TEAM_DOMAIN="rookmere"`, `CF_ACCESS_AUD=""` (unset), `AI_GATEWAY_URL=""`, `WINNIE_ALLOW_NO_ACCESS="1"` |
| Audit log | live; `page_view` rows persisting on every request |
| Account | Rookmere Digital (`9421b3fac346a7e6b73cf7353e7f59d6`) |

## ⚠️ Spec §11.6 window currently OPEN

The deployed worker is publicly reachable. Mitigation:

- Subdomain (`hisnameisaaron.workers.dev`) is unguessable
- Page renders the cosmic landing only — no real data, no auth-protected endpoints exist yet
- `WINNIE_ALLOW_NO_ACCESS=1` accepts a mock identity but exposes no privileged data
- No external party has been told the URL

This window closes in tomorrow's first move (DNS + Entra Access on the custom domain), not via OTP on `*.workers.dev`.

## Deferred

- **Step 8E (revised)** — was "OTP on `*.workers.dev`". Superseded by the DNS-first plan below: cleaner to gate the custom domain with Entra than to OTP-gate the workers.dev URL and rebuild the gate tomorrow.
- **Step 9** — DNS + permanent Access policy. Folded into tomorrow's first move.
- **Step 10** — README close-out, `phase-0-complete` tag, final push. After 8E/9 verify green tomorrow.

## Tomorrow's first move

1. **DNS** — add `winnie.rookmeredigital.com` CNAME → `winnie.hisnameisaaron.workers.dev`, proxied. Add the route to the worker so it accepts the new hostname.
2. **Entra ID as IdP** — Cloudflare Zero Trust → Settings → Authentication → add Microsoft Entra ID against the Rookmere tenant. Test the login flow with `aaron@rookmeredigital.com`.
3. **Access application** — self-hosted, domain `winnie.rookmeredigital.com`, single Allow policy for `aaron@rookmeredigital.com` via the Entra IdP, session 24h.
4. **Repo updates** — paste the AUD tag into `CF_ACCESS_AUD`, flip `WINNIE_ALLOW_NO_ACCESS` to `"0"`, redeploy.
5. **Verify** — browser hit prompts Entra login; on success, lands on Welcome Aaron; D1 shows a `users` row for Aaron and a `page_view` row whose `user_id` is the real verified JWT `sub` (no longer NULL).
6. **Close out** — README update, tag `phase-0-complete`, final push. Phase 0 done.

## Decisions worth flagging

- **Workers + Static Assets** target (not legacy Pages) — captured in `MASTER_SPEC.md` §14 decision log.
- **Production build uses webpack** until OpenNext supports turbopack output. Worth re-checking each minor Next.js bump.
- **`jose` JWE deflate** path triggers an Edge Runtime build warning. We only use the JWS verify path; the deflate code is dead-imported and never executes. Not blocking, not fixing.
- **Audit log writes `user_id=NULL` during the mock window** rather than upserting `'mock-aaron'`. When the real Access JWT sub is in play tomorrow, `getCurrentUser()` upserts into `users` and middleware audit writes carry the real sub.
- **Identity provider pivot.** Bootstrap doc said Google SSO; we are using **Microsoft Entra ID** instead. Tomorrow's IdP setup; spec decision log to be updated then.
