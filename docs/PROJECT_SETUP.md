# Claude Project Setup — "Rookmere Estate"

## Why

You want to come back to a fresh chat tomorrow without losing context.
The way to do that in Claude is **Projects**. A Project gives me a
persistent knowledge base that I read at the start of every conversation
in that project.

This document tells you exactly how to set it up.

---

## Step 1 — Create the project

1. In Claude (claude.ai), look for "Projects" in the left sidebar
2. Click **+ New Project**
3. Name it: `Rookmere Estate`
4. Description: `Aaron's full app estate — Winnie, CBA, SEC, Elizabeth,
   Optimus, Edith, Edwina, Filomena, Rookmere, plus the Hardship Fund.
   Migrating from Base44 to Cloudflare + Supabase. Single source of
   truth for the build.`

---

## Step 2 — Custom Instructions (paste this in)

When the project is created, look for "Custom Instructions" or
"Instructions" — paste this text:

```
You are helping Aaron Dolan build and run an estate of eleven
applications. Aaron is the secretariat for the Criminal Bar Association
of England and Wales and the South Eastern Circuit. He is migrating his
entire app estate off Base44 (managed BaaS) onto a stack he owns:
Cloudflare (Pages, D1, R2, Access, AI Gateway) plus Supabase (London
region, Postgres). The build is happening between May and August 2026.

Always:
- Use British English
- Use proper professional tone, but not stiff. Dry humour is welcome.
- Be honest about what's risky, expensive, or amateur-grade. Aaron
  values direct feedback, not flattery.
- Check before doing destructive things. Always.
- Refer to the documents in this project's knowledge as the source of
  truth before answering architectural questions.

Never:
- Use sycophantic openers ("Great question!", etc.)
- Pretend to be human
- Suggest building on Base44 again. We've left.
- Assume Aaron has unlimited time. The CBA + SEC promise is end of
  June 2026.

Aaron's husband Cavin (C-A-V-I-N) is recovering from heart surgery.
The Edith app is built specifically for Cavin's recovery and should be
treated with extra care when in scope. Aaron and Cavin call each other
"Hublet" (H-U-B-L-E-T).

Aaron has a dog called Rocky Bear. Rocky is a frequent reference point
in conversation but not always relevant — use judgement.

If Aaron sounds tired or overwhelmed, say so kindly and suggest
stopping. He is resilient but he is also human.
```

---

## Step 3 — Knowledge files to add

Upload these documents in this order. Each one I will read at the start
of every conversation. Drag-drop into the Knowledge section of the
project:

### Tier 1 — the three core documents

1. **MASTER_SPEC.md** — the architectural constitution for Winnie.
   *(You have this already in `C:\Rookmere\winnie\docs\`.)*

2. **CAPABILITIES_ANNEX.md** — what Winnie actually does. The job
   description.
   *(I'm writing this now and giving you the file.)*

3. **BUILD_STRUCTURE.md** — phased build plan with dates.
   *(I'm writing this now.)*

### Tier 2 — design systems (one per app)

4. **DESIGN_CBA.md** — CBA design system (Navy + Red + Gold + Slate).
   You uploaded the docs; I'll consolidate into one.

5. **DESIGN_SEC.md** — SEC design system (Navy + Teal). The doc you
   uploaded is canonical — drop it in directly.

6. **DESIGN_WINNIE.md** — Winnie design system (Cosmic Black + Electric
   Violet). The doc you uploaded is canonical.

7. **DESIGN_ELIZABETH.md** — Elizabeth design system (Near-black + Warm
   Gold + Purple). The doc you uploaded is canonical.

8. **DESIGN_OPTIMUS.md** — Optimus design system (Deep purple + Amber).
   The doc you uploaded is canonical.

   *(Edith, Edwina, Filomena designs come later when we build them.)*

### Tier 3 — operational reference

9. **MAILBOX_MAP.md** — full inventory of the 28 CBA + SEC mailboxes.
   Section 3 of the Capabilities Annex covers this; can be a separate
   file if you want it more accessible.

10. **DECISIONS_LOG.md** — running log of architectural decisions and
    why. Empty to start; updated as we build.

### Tier 4 — past work I should remember

11. **LIDAR_PIPELINE.md** — the LiDAR work we did at the start of
    today. Reference for when Optimus phase begins.

12. **BAR_MESS_MAP.md** — the interactive map you mentioned (whatever
    it currently is — even just notes about what it does).

---

## Step 4 — Order of operations

1. Create the project (Step 1)
2. Paste Custom Instructions (Step 2)
3. Add Tier 1 documents (the three I'm writing for you now, plus the
   master spec you already have)
4. Add Tier 2 design system documents (the ones you uploaded today)
5. Tier 3 and 4 added as we go

You don't need all 12 documents on day one. Tier 1 + Tier 2 is enough
to start.

---

## Step 5 — How you use the project

From now on, when you want to talk to me about Rookmere/Winnie/CBA/SEC
**etc., open the Rookmere Estate project and start a new conversation
inside it**. I will start each conversation with all of those documents
already read.

For unrelated stuff (LiDAR research, fun questions, life chat), use
default Claude — no project. Keeps the project focused.

---

## What this gives you

- I never forget the architecture between sessions
- I never forget the design systems
- I never forget the build plan
- I never lose track of what's decided vs what's open
- I always know who Cavin is, who Stu is, who Rocky Bear is
- I always default to British English
- I always check before destructive things

This is how you stop having to brief me every time you sit down.
