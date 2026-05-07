# Phase 0 — Build log

**Last updated:** 2026-05-07 (close-of-day 2)
**Scope:** Phase 0 scaffold for Winnie. See `MASTER_SPEC.md`, `BUILD_STRUCTURE.md` Phase A, `PHASE_0_BOOTSTRAP.md`.

## What landed

### Day 1 (2026-05-05/06) — Steps 1–7 + Step 8 sub-steps A–D

1. Next.js 15.5.15 — App Router, TypeScript, Tailwind v4, `src/`, no ESLint
2. Supporting deps — shadcn/ui, OpenNext for Cloudflare, framer-motion, lucide-react, jose, wrangler
3. Cosmic theme — palette, fonts (Space Grotesk / Orbitron / IBM Plex Mono), glass landing, "Welcome, Aaron"
4. Cloudflare D1 `winnie-db` (id `a41ddd4d-75a7-4af1-adbf-4143713d2bde`) with the spec schema — 5 tables, 7 indexes, CHECK constraints, FKs
5. Cloudflare Access JWT verification (jose), middleware that strips spoofed identity headers and verifies; mock identity in dev / `WINNIE_ALLOW_NO_ACCESS=1` window
6. PendingAction CRUD, users upsert, `/queue` page (empty)
7. Append-only audit log writer (one INSERT, zero UPDATE/DELETE); middleware writes `page_view` on every non-static request
8. **8A** OpenNext config + Workers + Static Assets deploy wiring · **8B** schema applied to remote D1 (LHR) · **8C** first deploy · **8D** smoke test green after two fixes (turbopack out of prod build; mock-mode audit `user_id=NULL` to avoid FK)

### Day 2 (2026-05-07) — Custom Domain wired

- **Custom Domain** `winnie.rookmeredigital.com` attached to the worker via the Cloudflare dashboard. Chose **Custom Domains** over the older Workers Routes approach for cleaner DNS + cert + routing managed as one unit.
- **Verified:** DNS resolves to Cloudflare anycast (`104.21.66.99` / `172.67.158.196` v4, `2606:4700:303{0,1}::…` v6), HTTP 200, cosmic landing rendered, audit log writing `page_view` rows from custom-domain hits.
- **Old Base44 CNAME** on the `winnie` subdomain was deleted by Aaron at the same time.
- **`wrangler.jsonc` updated** to mirror the Custom Domain in code (`routes` array with `custom_domain: true`) — config-as-code parity with dashboard state. Commit `57967d6`. Not yet pushed; not yet redeployed (batched with the AUD/flag-flip below).
- **Entra ID walkthrough** was prepared (Azure app registration + Cloudflare Zero Trust IdP setup, both halves) but execution deferred to Day 3.

## Live state (close of Day 2)

| | |
|---|---|
| Primary URL | `https://winnie.rookmeredigital.com` (Custom Domain) |
| Workers.dev URL | `https://winnie.hisnameisaaron.workers.dev` (still active alongside) |
| Worker version | `da7abae0-11b6-4876-a0d8-ce20f69b350a` (no redeploy today) |
| Bindings | `DB`, `ASSETS`, `CF_ACCESS_TEAM_DOMAIN="rookmere"`, `CF_ACCESS_AUD=""` (empty until Day 3), `AI_GATEWAY_URL=""`, `WINNIE_ALLOW_NO_ACCESS="1"` |
| Audit log | live; `page_view` rows persisting from both hostnames; `user_id=NULL` during mock window |
| Account | Rookmere Digital (`9421b3fac346a7e6b73cf7353e7f59d6`) |
| Local commits ahead of `origin/main` | 2 (`57967d6`, plus this log update) |

## ⚠️ Spec §11.6 window still OPEN — and now CT-listed

The deployed worker is publicly reachable on a real domain. Cloudflare's edge cert issuance for `winnie.rookmeredigital.com` was logged in public Certificate Transparency logs at the moment of Custom Domain attachment, and CT-watching scanners hit the URL within minutes — three unrelated probes appeared in the audit log within ~5 min of activation, including one open-proxy-style malformed path (`/https:/.../cdn-cgi/content?id=…`).

Mitigation still holds:
- Page renders the cosmic landing only — no real data, no auth-protected endpoints exist
- `WINNIE_ALLOW_NO_ACCESS=1` accepts a mock identity but exposes no privileged data
- No external party has been told the URL

But it's now load-bearing rather than theoretical: the URL is no longer unguessable. **Closing this window — attaching Cloudflare Access via Entra ID — is Day 3's first job.**

## Deferred (resume point)

- **Step 8E (revised)** — Entra app registration → Cloudflare IdP setup → Access application on `winnie.rookmeredigital.com` → grab AUD tag → paste + flip flag → redeploy.
- **Step 9** — folded into above (DNS done; only Access policy remains).
- **Step 10** — README close-out, `phase-0-complete` tag, final push.

Estimated time: ~30 min if Entra setup goes cleanly, longer if AADSTS errors appear.

## Day 3 first move (in order)

1. **Azure — Entra app registration.** App name `Cloudflare Access — Rookmere`, single-tenant, Web redirect URI `https://rookmeredigital.cloudflareaccess.com/cdn-cgi/access/callback` *(actually `https://rookmere.cloudflareaccess.com/cdn-cgi/access/callback` — `CF_ACCESS_TEAM_DOMAIN=rookmere`)*. Microsoft Graph delegated permissions: `openid`, `profile`, `email`, `offline_access`, `User.Read`. Admin consent. Optional ID claims: `email`, `family_name`, `given_name`, `preferred_username`. Generate 24-month client secret. Stash Tenant ID, Client ID, Client Secret VALUE.
2. **Cloudflare Zero Trust — add Microsoft IdP.** Paste Client ID, Tenant ID, Client Secret. Test → expect green "connection works" with email claim showing `aaron@rookmeredigital.com`.
3. **Access application.** Self-hosted, domain `winnie.rookmeredigital.com`, single Allow policy for `aaron@rookmeredigital.com` via Entra IdP, session 24h. Grab the **AUD tag** from the application overview.
4. **Repo — paste AUD + flip flag.** `wrangler.jsonc`: `CF_ACCESS_AUD=<tag>`, `WINNIE_ALLOW_NO_ACCESS="0"`. Commit `feat(access): attach Entra OIDC, close mock window`.
5. **Redeploy.** `npm run deploy`. Both `winnie.rookmeredigital.com` and `*.workers.dev` now require the verified JWT — middleware will 401 anything without it (and Cloudflare Access will gate the custom domain at the edge before the request even reaches the worker).
6. **Verify.** Browser → `winnie.rookmeredigital.com` → Entra login → "Welcome, Aaron". D1 query: a `users` row for Aaron (created by `getCurrentUser()` upsert), and recent `page_view` rows where `user_id` is the real verified Entra `sub` (no longer NULL).
7. **Close out Step 10.** README update with what Phase 0 produced + how to run it. Tag `phase-0-complete`. Final push. **Done.**

Walkthroughs for Day 3 sub-steps 1 and 2 are in the conversation transcript from end of Day 2 — they don't need to be re-derived. Sub-step 3 (Access application + AUD tag) walkthrough hasn't been written yet; will be the first thing tomorrow.

## Decisions worth flagging

- **Workers + Static Assets** target (not legacy Pages) — captured in `MASTER_SPEC.md` §14.
- **Production build uses webpack** until OpenNext supports turbopack output. Re-check on each Next.js bump.
- **`jose` JWE deflate** triggers an Edge Runtime build warning. We only use the JWS verify path; deflate is dead-imported. Not blocking, not fixing.
- **Audit log writes `user_id=NULL`** during the mock window rather than upserting `mock-aaron`. Real Entra sub takes over Day 3.
- **Identity provider pivot.** Bootstrap doc said Google SSO; using **Microsoft Entra ID** instead. Spec decision log entry to be added when Day 3 lands.
- **Custom Domains over Workers Routes** (Day 2 choice). Cleaner: Cloudflare manages DNS + cert + routing as one unit, and Access integration is tighter.
- **CT-log scanner noise observed** within minutes of cert issuance (Day 2). Expected for a fresh public hostname. Worth flagging for future first-deploys: don't be surprised by stranger IPs in audit_log right after cert issuance.
- **Client secret expiry to track.** Day 3's Entra client secret will expire ~2028-05-07. Add to a "secrets to rotate" list once created.
