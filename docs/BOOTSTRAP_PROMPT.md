# Bootstrap Prompt for Claude Code — Day One of Winnie Build

**How to use this:**
1. Open Windows Terminal
2. `cd C:\Rookmere\winnie`
3. Make sure `MASTER_SPEC.md` is saved in `C:\Rookmere\winnie\docs\MASTER_SPEC.md`
4. Run: `claude`
5. Paste the prompt below as your first message

---

## The prompt

```
You are helping me build Winnie, my personal command-centre application.

Before doing anything else, read the master specification at
docs/MASTER_SPEC.md. That document is the source of truth for this
build. Treat its non-negotiables (section 11) as inviolable rules,
not suggestions. If anything I ask you to do later contradicts the
spec, push back and ask before proceeding.

Your job today is Phase 0 — Scaffold. Do these in order, asking my
permission before each significant step:

1. Read the entire MASTER_SPEC.md and confirm you've understood the
   architecture, the PendingAction pattern, the non-negotiables, and
   the build phases. Tell me in your own words what Winnie is and
   what she explicitly does NOT do.

2. Tell me what Node and npm versions are on this machine, and what
   the current working directory contains.

3. Propose the exact commands you'd run to:
   a. Create a Next.js 15 project in this folder (using the App
      Router, TypeScript, Tailwind, ESLint)
   b. Install shadcn/ui
   c. Set up Wrangler (Cloudflare CLI) for Pages deployment
   d. Initialise the D1 database with the schema in section 4 of
      the spec
   But do NOT run them yet. Show me the plan first.

4. Once I approve the plan, execute it step by step, showing me
   the output of each command and waiting for my OK before moving
   to the next.

5. After scaffolding, create the docs/DECISIONS.md file with the
   decision log from the spec, plus a placeholder for future
   decisions.

6. Commit each meaningful step to git separately with clear commit
   messages.

7. At the end of the session, write a short summary of what got
   done, what didn't, and what the next session should start with.

Rules for this entire build:
- Do not deviate from the spec without explicit approval from me
- Do not install dependencies I haven't agreed to
- Do not run destructive commands without confirmation
- Always show me the diff before changing more than 20 lines of code
- If you're unsure about anything, ask rather than guess
- Use British English in all written content (UI copy, comments, docs)
- Use 2-space indentation, semicolons, single quotes in all code

Begin by reading the spec.
```

---

## What to expect

Claude Code will:
1. Read the spec (will probably take a minute, it's long)
2. Confirm understanding in its own words — read what it says back to make sure it actually got it
3. Check Node/npm versions (you already know these but it's good practice)
4. Propose the scaffolding commands
5. Wait for your approval

Approve carefully. The first decision points are:
- Next.js project name (use `winnie` not the default)
- TypeScript: Yes
- ESLint: Yes
- Tailwind: Yes
- src/ directory: Yes
- App Router: Yes
- Customise import alias: No (defaults are fine)

Phase 0 should take 30–90 minutes depending on how much you're double-checking
each step. By the end you'll have a deployable Next.js app, behind nothing
yet (we'll add Access in Phase 0.5), but it'll be a real working scaffold.

## Your job during the session

1. Read everything Claude Code shows you before approving
2. If something feels off, stop and tell me
3. Take a break every 30–45 minutes
4. Save the session transcript somewhere if Claude Code lets you
