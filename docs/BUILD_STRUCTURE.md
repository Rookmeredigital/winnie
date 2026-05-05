# Rookmere Estate — Build Structure & Sequence

**Date:** 5 May 2026
**Owner:** Aaron Dolan
**Constraint:** Visible CBA + SEC progress by end of June 2026

---

## The Ten Things Being Built

| # | App | Purpose | Audience | Domain |
|---|---|---|---|---|
| 1 | **Winnie** | Aaron's command centre | Aaron only | winnie.rookmeredigital.com |
| 2 | **CBA app** | Members area | CBA members (~3,000) | criminalbar.com (or app.criminalbar.com) |
| 3 | **CBA website** | Public site + apps | Public + applicants | criminalbar.com |
| 4 | **SEC app** | Members area | SEC members (~2,000) | southeastcircuit.org.uk |
| 5 | **SEC website** | Public site + apps | Public + applicants | southeastcircuit.org.uk |
| 6 | **Elizabeth** | Leadership dashboard | CBA Chair + Sec, SEC Leader + Recorder | leadership.criminalbar.com (TBD) |
| 7 | **Optimus** | Exploration / LiDAR | Aaron + Stu | optimus.rookmeredigital.com (TBD) |
| 8 | **Edith** | Recovery companion | Cavin | edith.rookmeredigital.com (TBD) |
| 9 | **Edwina** | TBD | TBD | TBD |
| 10 | **Filomena** | TBD | TBD | TBD |

(Rookmere itself stays as Aaron's personal site/vault — not on the active
build list.)

---

## Build Phases

### PHASE A — Foundation (Week 1, ending Sun 11 May)

**Objective:** Winnie and her empty siblings exist. Nothing public.

| Day | Task | Output |
|---|---|---|
| Today (Sun 5 May) | Winnie Phase 0 scaffold | `winnie.rookmeredigital.com` deploys, Cloudflare Access in front, "Welcome Aaron" renders |
| Mon 6 May | CBA app + website skeletons | Two empty Next.js projects on staging URLs |
| Tue 7 May | SEC app + website skeletons | Two more empty Next.js projects |
| Wed 8 May | Design tokens applied | Each app shows its branded login/landing page |
| Thu 9 May | Auth wired (Supabase) | You can register/log in to all four (test accounts) |
| Fri 10 May | Member entity + database | Member records can be created/read |

**End of Phase A:** Six empty rooms, all with the right wallpaper and
working front doors. Nothing real inside yet.

### PHASE B — CBA + SEC content (Weeks 2-3, ending Sun 25 May)

**Objective:** Real content on the websites; member portal real but
sparse.

- Public website pages (About, Committees, Events, Resources, etc.)
  rebuilt from existing Base44 content
- Application form on each website
- Member portal: dashboard, profile, member directory, basic resources
- Data migration from Base44 into Supabase
- Email integration (Microsoft 365 → Winnie → mailboxes)
- Tim Dutton tribute page on SEC site

**End of Phase B:** Both websites are live-ready. Both apps are
functional but skeletal.

### PHASE C — CBA + SEC depth (Weeks 4-5, ending Sun 8 June)

**Objective:** Members can do real things.

- CBA app: hardship application form, training hub, CPD tracker, news
- SEC app: Keble Hub, courses, mentoring, news
- Stripe integration for events / video purchases
- GoCardless integration for direct debit subscriptions
- Notifications, email digests
- Pupil/Student section on CBA

**End of Phase C:** CBA + SEC apps are usable. Real members can be
invited.

### PHASE D — Soft launch (Week 6, ending Sun 15 June)

**Objective:** Trusted members test the new apps. Aaron fixes whatever
breaks.

- Invite 20-50 members to test
- Bug list, fix list
- Performance pass
- Mobile pass

**End of Phase D:** Apps are production-ready.

### PHASE E — DNS cutover (Week 7, ending Sun 22 June)

**Objective:** criminalbar.com and southeastcircuit.org.uk officially
point to the new sites.

- Domain transfers complete (started week 1)
- DNS switched at Cloudflare
- Old Base44 sites deactivated
- Email migration verified

**End of Phase E:** *Public-facing CBA + SEC are running on the new
stack. Promise to Bar associations met.*

### PHASE F — Elizabeth (Weeks 8-9, ending Sun 6 July)

- Leadership dashboard for CBA Chair + Secretary, SEC Leader + Recorder
- Voice command interface (pulsing nebula icon)
- Meeting booking, agenda prep, minutes
- Annual handover automation

### PHASE G — Optimus (Weeks 10-11, ending Sun 20 July)

- Exploration app for Aaron + Stu
- LiDAR pipeline integration (we already built this!)
- Field log voice interface
- Map UI

### PHASE H — Edith (Weeks 12-13, ending Sun 3 Aug)

**Timing-critical: depends on Cavin's surgery date. If sooner, Edith
jumps the queue.**

- Cavin's recovery companion
- Streaming integration (Netflix, Disney+, Prime)
- Pre-populated content (Marvel, PlayStation, Spider-Man)
- Photo / memory library
- Hublet voice interface (Irish, sassy)
- Recovery suggestions, walking routes for Rocky

### PHASE I — Edwina + Filomena (Weeks 14-15, ending Sun 17 Aug)

- Built together based on what we've learned
- Scope to be defined when we get there

### PHASE X — The Big Ingestion (ongoing, starts Week 16)

- 20 years of email history
- File system scan + reorganisation
- AirPort + Samsung stick ingestion
- Video processing queue

---

## Critical Path

The promise is **CBA + SEC visible by June**. Everything else is downstream.

```
Phase A (Foundation) — week 1
   │
   ├── Winnie Phase 0 (today)
   │
   └── CBA + SEC scaffolding (mon-fri)
       │
       ▼
Phase B (Content) — weeks 2-3
       │
       ▼
Phase C (Depth) — weeks 4-5
       │
       ▼
Phase D (Soft launch) — week 6 ← members invited
       │
       ▼
Phase E (DNS cutover) — week 7 ← PROMISE MET
       │
       ▼
Phase F (Elizabeth) — weeks 8-9
       │
       ▼
Phase G (Optimus) — weeks 10-11
       │
       ▼
Phase H (Edith) — weeks 12-13 ← unless surgery moves it earlier
       │
       ▼
Phase I (Edwina + Filomena) — weeks 14-15
```

---

## Parallel work streams

While Phase A-E (the build) is happening:

**Domain transfers:**
- criminalbar.com → Cloudflare (started now, takes 5-7 days)
- southeastcircuit.org.uk → Cloudflare (started now, takes 5-7 days)

**Email migration:**
- Microsoft 365 setup for both domains (done in parallel, weeks 2-4)
- 28 mailboxes provisioned
- Data migration from current providers (Gmail) to M365 (week 5)

**Third-party services:**
- GoCardless account setup + verification (weeks 3-4)
- Stripe account setup + verification (weeks 3-4)
- Resend account for transactional email (week 1)
- Sentry for error tracking (week 2)

---

## Today's deliverable (Sun 5 May)

**Winnie Phase 0 scaffold.**

- Next.js 15 project initialised in `C:\Rookmere\winnie`
- Tailwind, shadcn/ui, dark cosmic theme applied
- Supabase project created (London region)
- D1 schema created (Winnie's own database)
- Cloudflare Pages deployment connected to GitHub
- Cloudflare Access in front of `winnie.rookmeredigital.com`
- DNS pointed at the deployment
- "Welcome, Aaron" renders behind Access on the live URL
- Audit log table active (writes on every page view)

**At the end of today, you can log into Winnie from any device, behind
SSO + MFA, and see her empty room. That's a real, deployed application
with proper auth, hosted entirely on infrastructure you own.**

That's the win.

---

## Things outside the critical path that still need doing

These don't block the build but Aaron should action them when he can:

- [ ] Domain transfer for criminalbar.com initiated
- [ ] Domain transfer for southeastcircuit.org.uk initiated
- [ ] Microsoft 365 business account verified for both domains
- [ ] GoCardless account application submitted
- [ ] Stripe account application submitted
- [ ] Resend account created
- [ ] Wild Apricot decision finalised (recommend: don't sign up)
- [ ] YubiKeys configured (can happen any weekend)
- [ ] Existing 1,800 barristers' direct debit data exported from Sage
      to a CSV (for migration to GoCardless later)
