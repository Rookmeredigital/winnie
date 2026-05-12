# Phase 0 — Build log

**Last updated:** 2026-05-12 (close-of-day 3) — **Phase 0 complete**
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

### Day 3 (2026-05-12) — Step 8E + Step 10 close-out

1. **Entra app registration** — `Cloudflare Access — Rookmere`, single-tenant, Web redirect `https://rookmere.cloudflareaccess.com/cdn-cgi/access/callback`. Microsoft Graph delegated perms (`openid`, `profile`, `email`, `offline_access`, `User.Read`), admin consent, optional ID claims (`email`, `family_name`, `given_name`, `preferred_username`), 24-month client secret. Tenant + Client IDs + secret stashed.
2. **Cloudflare Zero Trust — Microsoft IdP** added, test green with `aaron@rookmeredigital.com` email claim.
3. **Access application** — self-hosted on `winnie.rookmeredigital.com`, single Allow policy for `aaron@rookmeredigital.com` via Entra IdP, 24h session. **AUD: `9f08001e3e2e44b6e5b6f7d1d04b63942e50bea4db9baf3032c0507456be84d2`**.
4. **Repo edits** — `wrangler.jsonc`: AUD pasted, `WINNIE_ALLOW_NO_ACCESS` flipped to `"0"`. Side-effect: `wrangler types` literalised the var to `"0"`, breaking the existing `=== '1'` comparison in `src/lib/auth/access.ts:98` at compile time. Widened to `String(process.env.WINNIE_ALLOW_NO_ACCESS) === '1'` — runtime semantics unchanged.
5. **Deploy** — version `8ef30610-dcb6-4e1f-aacc-046dc5162822`. Bindings confirm `CF_ACCESS_AUD` + `WINNIE_ALLOW_NO_ACCESS="0"` live. Wrangler also **disabled the `*.workers.dev` URL** on this deploy because `workers_dev` is not declared in `wrangler.jsonc` (opt-in default). One fewer ungated surface — net positive for §11.6.
6. **Smoke test (incognito)** — `winnie.rookmeredigital.com` → Cloudflare Access OTP → Entra login → "Welcome, Aaron". End-to-end auth chain verified. §11.6 mitigation closed.

## Live state (close of Day 3)

| | |
|---|---|
| Primary URL | `https://winnie.rookmeredigital.com` (Custom Domain, gated by Cloudflare Access + Entra IdP) |
| Workers.dev URL | **disabled** by Day 3 deploy (`workers_dev` not in `wrangler.jsonc`; opt-in default) |
| Worker version | `8ef30610-dcb6-4e1f-aacc-046dc5162822` |
| Bindings | `DB`, `ASSETS`, `CF_ACCESS_TEAM_DOMAIN="rookmere"`, `CF_ACCESS_AUD="9f08001e…6be84d2"`, `AI_GATEWAY_URL=""`, `WINNIE_ALLOW_NO_ACCESS="0"` |
| Audit log | live; real Entra `sub` written to `user_id` from Day 3 onward (mock-window NULLs preserved as historical) |
| Account | Rookmere Digital (`9421b3fac346a7e6b73cf7353e7f59d6`) |
| Tag | `phase-0-complete` (this commit) |

## ✅ Spec §11.6 window CLOSED (2026-05-12)

Cloudflare Access (Entra IdP) gates `winnie.rookmeredigital.com` at the edge — no request reaches the worker without a verified JWT. `WINNIE_ALLOW_NO_ACCESS=0` removes the mock fallback in middleware. The `*.workers.dev` URL is disabled by this deploy, so there is no ungated surface left.

End-to-end verified in incognito on Day 3: Access OTP challenge → Entra login → middleware verifies JWT against `https://rookmere.cloudflareaccess.com/cdn-cgi/access/certs` → "Welcome, Aaron" with real verified `sub`.

## Phase 0 done

All 10 steps from `PHASE_0_BOOTSTRAP.md` landed. Custom Domain gated by Entra-backed Cloudflare Access; D1 schema live; append-only audit log writing real verified `sub` values; cosmic landing rendering. Tagged `phase-0-complete` at the commit closing this log.

## Next

- Phase 1 — Decisions Inbox + Action Queue per `BUILD_STRUCTURE.md` Phase B.
- README close-out (if not already in this commit) — what Phase 0 produced + how to run it.
- **Secrets to rotate:** Entra client secret expires ~2028-05-12. Add to a rotation list when one exists.

## Decisions worth flagging

- **Workers + Static Assets** target (not legacy Pages) — captured in `MASTER_SPEC.md` §14.
- **Production build uses webpack** until OpenNext supports turbopack output. Re-check on each Next.js bump.
- **`jose` JWE deflate** triggers an Edge Runtime build warning. We only use the JWS verify path; deflate is dead-imported. Not blocking, not fixing.
- **Audit log writes `user_id=NULL`** during the mock window rather than upserting `mock-aaron`. Real Entra sub took over Day 3.
- **Identity provider pivot.** Bootstrap doc said Google SSO; using **Microsoft Entra ID** instead. Confirmed working Day 3. Spec decision-log entry due.
- **Custom Domains over Workers Routes** (Day 2 choice). Cleaner: Cloudflare manages DNS + cert + routing as one unit, and Access integration is tighter.
- **CT-log scanner noise observed** within minutes of cert issuance (Day 2). Expected for a fresh public hostname. Worth flagging for future first-deploys: don't be surprised by stranger IPs in `audit_log` right after cert issuance.
- **`wrangler types` literalises var values** (Day 3). Flipping `WINNIE_ALLOW_NO_ACCESS` from `"1"` to `"0"` and regenerating types narrowed the binding to literal `"0"`, which broke the existing `=== '1'` comparison at compile time. Widening with `String(...)` keeps runtime semantics and survives future var flips. Worth knowing before changing any other var.
- **`workers_dev` default is off.** Omitting it from `wrangler.jsonc` disables the `*.workers.dev` URL on deploy. Desired here (one less ungated surface); flag if a future deploy ever needs it as a fallback.
