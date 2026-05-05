# Design System — Rookmere Estate

**Status:** v1.0 — consolidated reference
**Owner:** Aaron Dolan
**Last updated:** 5 May 2026

This document is the **cross-app design reference**. Each app has its
own detailed design tokens in source code, but this is the master view
showing how they relate as a family.

---

## The principle: family resemblance, distinct identity

The eight apps + websites in the estate should feel like products from
the same designer — disciplined, dark-anchored (mostly), considered
typography, accent colours used semantically not decoratively. But each
has its own clear identity and audience.

| App | Anchor | Primary | Secondary | Audience | Tone |
|---|---|---|---|---|---|
| CBA app + website | Parchment / Navy | CBA Navy `#0F2A44` | Red `#A51C30`, Gold `#C9A24A`, Slate `#5F6B77` | Members of the Bar | Formal, traditional |
| SEC app + website | Deep Navy `#0f1a2e` | Teal `#1ddba7` | Gold `#dba83b` | SEC barristers | Modern, distinctive |
| Winnie | Cosmic Black `#0e0820` | Electric Violet `#8b5cf6` | Aurora Blue, Nebula Pink | Aaron only | Cosmic, intelligent, Jarvis |
| Elizabeth | Near-Black `#0F0F0F` | Warm Gold `#B08030` | Deep Purple `#3D2E5A` | Leadership | Executive command desk |
| Edith | TBD (warm/soft) | TBD | TBD | Cavin | Calm, hospital-friendly |
| Optimus | Deep Purple `#1a1228` | Warm Amber `#f5a623` | Soft Violet `#9b59e8` | Aaron + Stu | Adventure, quirky |
| Edwina | TBD | TBD | TBD | TBD | TBD |
| Filomena | TBD | TBD | TBD | TBD | TBD |

---

## Cross-app design rules

These apply to every app in the estate:

### Typography pairing
- **One serif** for editorial gravitas (headings, titles)
- **One sans-serif** for everything else (body, UI, buttons)
- **Optional:** one monospace for data/code

### Accent colour discipline
- One brand accent per app
- Used for active states, primary actions, focus rings, brand moments
- Not used decoratively or "to add colour"

### Status colours (universal across the estate)
- **Green** = success, approved, active, paid, healthy
- **Amber/Yellow** = pending, warning, awaiting, attention needed
- **Red/Burnt-orange** = error, urgent, destructive, blocked
- **Blue/Teal** = informational, calm, in-progress

### Loading states
- All apps use *meaningful* loading messages, not generic spinners
- "Reading the consultation queue" not "Loading..."
- This is how the estate's apps feel "alive"

### Empty states
- Always handled gracefully with copy
- Never a blank screen
- The empty state explains what would normally be there

---

## CBA — full token reference

(Source: CBA_Web_Audit + CBA_App_Audit, consolidated)

### Brand palette

| Token | Hex | Tailwind class | Used for |
|---|---|---|---|
| CBA Navy | `#0F2A44` | `bg-cba-navy`, `text-cba-navy` | Sidebars, hero backgrounds, primary buttons, headings |
| CBA Red | `#A51C30` | `bg-cba-red`, `text-cba-red` | Active nav, CTAs, destructive actions, accent badges |
| CBA Gold | `#C9A24A` | `bg-cba-gold`, `text-cba-gold` | Decorative rules, "back to home" buttons, prestige accents |
| CBA Slate | `#5F6B77` | `text-cba-slate` | Secondary text, labels, metadata |
| Parchment | `#F7F5F2` | `bg-cba-parchment` | Light-mode page background |
| Muted | `#EEEBE6` | `bg-cba-muted` | Tag/badge backgrounds, low-contrast labels |

### Semantic mappings (Tailwind)
- `--background`: Parchment (light) / near-black navy (dark)
- `--foreground`: Near-black navy (light) / warm off-white (dark)
- `--primary`: CBA Navy
- `--accent`: CBA Red
- `--destructive`: CBA Red
- `--ring`: CBA Navy

### Typography
- **Headings:** Merriweather (400, 700)
- **Body:** Inter (400, 500, 600, 700)
- All headings tracking-tight (`-0.02em`)
- All headings 700 weight

### Sizing scale (Tailwind defaults)
- text-xs (12px) — labels, badges, metadata
- text-sm (14px) — body
- text-base (16px) — sub-headings (rarely)
- text-lg (18px) — card titles, section sub-titles
- text-xl (20px) — section headings
- text-2xl (24px) — major headings
- text-3xl (30px) — H1
- text-4xl (36px) — hero on wide screens

### Inconsistencies to clean up in the new build
- Profile and Onboarding pages currently use hardcoded `hsl(222,40%,...)`
  values that bypass tokens. All inline values to be migrated to the
  token system.
- Some files import `--cba-gold` while charts use a slightly different
  gold (HSL 38 47% 48%). Standardise to `--cba-gold`.

---

## SEC — full token reference

(Source: SEC_Web_Audit + SEC_App_Audit. The SEC palette is already
internally consistent across web and app.)

### Brand palette

| Token | Hex | Tailwind class | Used for |
|---|---|---|---|
| BG Primary | `#0f1a2e` | `bg-background` | Page background |
| BG Deep | `#0c1f3d` | `bg-background-deep` | Hero gradients, section overlays |
| Card | `#162033` | `bg-card` | All cards, panels, popovers |
| Text Primary | `#f5f2ee` | `text-foreground` | Body text and headings |
| Text Muted | `#8a96a8` | `text-muted-foreground` | Secondary text, labels |
| Teal Web | `#1ddba7` | `text-primary`, `bg-primary` | Brand accent — section labels, CTAs, icons, links, focus rings |
| Gold | `#dba83b` | `text-accent`, `bg-accent` | Notices, callout panels |
| Secondary | `#273348` | `bg-secondary` | Secondary buttons, badge backgrounds |
| Muted | `#232f42` | `bg-muted` | Muted section backgrounds, hover states |
| Border | `#2d3a4d` | `border-border` | All borders |
| Danger | `#f03a3a` | `bg-destructive` | Errors, warnings |

### Typography
- **Headings:** Merriweather (400, 700)
- **Body:** Inter (400, 500, 600, 700)

### Sizing scale
- text-xs through text-7xl, with font-weight tightly controlled per
  hierarchy level (see SEC web audit for exact mapping)

### Notable
- Letter-spacing 0.2em on uppercase section labels
- Tight leading (1.02-1.05) on hero h1s

### Migration note
- The SEC palette is excellent and ready to port to the new build
  with no changes.

---

## Winnie — full token reference

(Source: Winnie_Audit. Cosmic theme.)

### Brand palette

| Token | Hex | CSS Variable | Used for |
|---|---|---|---|
| Cosmic Black | `#120b28` | `--cosmic-black` | Deepest background layer |
| Cosmic Deep | `#0e0820` | `--cosmic-deep` | Primary page background |
| Cosmic Purple | `#1e1040` | `--cosmic-purple` | Mid-depth panel backgrounds |
| Cosmic Mid | `#2d1b4e` | `--cosmic-mid` | Elevated panel surfaces |
| Electric Violet | `#8b5cf6` | `--electric-violet` | Primary glow, borders, active nav, focus highlights |
| Deep Indigo | `#4f46e5` | `--deep-indigo` | Secondary accent, gradients |
| Aurora Blue | `#38bdf8` | `--aurora-blue` | Secondary glow sweeps, data pulse lines |
| Nebula Pink | `#c084fc` | `--nebula-pink` | Tertiary highlights, cosmic sweep effects |
| Star White | `#e2e8f0` | `--star-white` | Default body text colour |

### Glass surface overlays (for Aurora glass panels)
- `--glass-bg`: rgba(22, 12, 48, 0.55)
- `--glass-border`: rgba(167, 139, 250, 0.18)
- `--glass-glow`: rgba(139, 92, 246, 0.10)
- `.glass-panel-bright` border: rgba(167, 139, 250, 0.32)

### Typography
- **Body:** Space Grotesk (300, 400, 500, 600, 700)
- **Display/HUD accent:** Orbitron (400, 800) — used sparingly
- **Monospace:** IBM Plex Mono (300, 500) — for IDs, codes, timestamps
- (Inter loaded as fallback, can be removed in new build)

### Sizing
- Heavy use of `text-[10px]`, `text-[11px]` for HUD-style labels
- Standard Tailwind scale up to text-4xl for stats

### Discipline
- Glow effects only on active/important elements
- Bulk of screen is calm dark surfaces
- Avoid "gaming UI" aesthetic — keep it elegant

---

## Elizabeth — full token reference

(Source: Elizabeth_Audit. Permanent dark mode.)

### Brand palette

| Token | HSL | Hex Approx | Used for |
|---|---|---|---|
| Background | 0 0% 6% | `#0F0F0F` | Page background |
| Foreground | 40 12% 95% | `#F5F3F0` | Body text |
| Card | 220 20% 12% | `#1A1E2A` | Card and panel backgrounds |
| Primary | 220 18% 13% | `#1B1F28` | Primary buttons, active nav |
| Secondary | 265 35% 28% | `#3D2E5A` | Secondary buttons, hover states |
| Accent (BRAND) | 40 55% 45% | `#B08030` | The Elizabeth gold. Active states, badges, CTAs, focus rings |
| Destructive | 25 88% 50% | `#F06010` | Burnt orange — errors, urgent alerts |
| Border | 220 15% 18% | `#252B38` | All borders |

### Signal/priority colours
- Urgent: `#F06010` (burnt orange)
- High: `#B08030` (gold)
- Medium: `#7B40CC` (purple)
- Low: `#40A89A` (teal)

### Layer architecture colours (Elizabeth core visualisation)
- Diary: HSL 265 65% 64% (purple)
- Email: HSL 185 58% 52% (teal-cyan)
- Meetings: HSL 210 72% 60% (sky blue)
- Actions: HSL 42 88% 58% (bright gold)
- Decisions: HSL 48 92% 55% (yellow-gold)
- System: HSL 0 0% 70% (light grey)

### Typography
- **All UI:** Inter (300, 400, 500, 600, 700)
- **Data / technical:** JetBrains Mono (400, 500)
- Uppercase + wide tracking on small mono labels

---

## Optimus — full token reference

(Source: Optimus_Audit. Field-tool aesthetic.)

### Brand palette

| Token | HSL | Hex Approx | Used for |
|---|---|---|---|
| Background | 260 35% 10% | `#1a1228` | Page background (deep purple) |
| Foreground | 210 28% 92% | `#e0e8f0` | Body text |
| Card | 20 12% 16% | `#2a2420` | Card backgrounds (warm dark) |
| Primary | 44 95% 55% | `#f5a623` | Warm amber — buttons, rings, active nav |
| Secondary | 260 20% 22% | `#302844` | Secondary panels |
| Accent | 270 65% 55% | `#9b59e8` | Soft violet — accent highlights |
| Sky | 190 70% 50% | `#26c5d9` | Bright cyan — neon hover effects, map UI |
| Destructive | 0 65% 48% | `#c73333` | Errors |

### Voice orb colours (hardcoded in components)
- Amber glow `#f59e0b`
- Violet `#a78bfa`
- Cyan `#38bdf8`
- Rose/pink `#f472b6`
- Emerald `#34d399`
- Indigo `#818cf8`
- Gold highlight `#fcd34d` (arc reactor inner core when listening)

### Typography
- **All UI:** Space Grotesk (300, 400, 500, 600, 700)
- **Mono / data:** JetBrains Mono (400, 500)
- Crimson Text and Dancing Script available as decorative options

### Important: text-size override
- Tailwind default scale is bumped one level up globally
- Why: Field Mode readability (outdoor / glance use)
- `text-xs` → renders as `text-sm`, etc.

---

## Edith / Edwina / Filomena — designs to be created

These three apps will need their own design tokens written when we
build them. Recommendations:

### Edith
- **Audience:** Cavin, recovering from heart surgery, possibly tired,
  possibly medicated, in bed for long periods
- **Recommended palette:** Soft warm pastels — dusky blues, warm
  off-whites, gentle rose accents. NOT clinical white (avoid hospital
  feel), NOT dark-cosmic (Winnie's territory)
- **Key principle:** Calm, low-stimulation, large optional text mode,
  one-handed friendly
- **Typography:** Soft humanist serif for headings (e.g. Lora, Playfair
  Display), clean sans for body (Inter)

### Edwina
- TBD when scope is defined

### Filomena
- TBD when scope is defined

---

## Asset library

### Fonts (all on Google Fonts, free)
- Merriweather — CBA + SEC (headings)
- Inter — universal body
- Space Grotesk — Winnie + Optimus
- Orbitron — Winnie HUD
- JetBrains Mono — Winnie + Elizabeth + Optimus (data)
- IBM Plex Mono — Winnie alternative
- Lora / Playfair — Edith candidates

### Icon set
- **Lucide** (open source, comprehensive, consistent stroke widths)
- Used across all apps for UI consistency

### Animation library
- **Framer Motion** for React Server Components / Client Components
- Used for ambient pulses, page transitions, voice-reactive elements
- Discipline: motion serves communication, not decoration

---

## Open decisions

To be resolved during the build:

1. **Light-mode for the public CBA / SEC websites?** — Probably yes,
   parchment-based for CBA, dark for SEC web (matches member-facing app).
2. **Edith's full design system** — to be created when Cavin's surgery
   date is confirmed (so we don't build months ahead of need).
3. **Edwina + Filomena scopes** — TBD.
4. **Logo / wordmark for Winnie** — does she need a visible identity
   beyond the cosmic theme? Probably not — she IS the interface.

---

## End of Design System v1.0
