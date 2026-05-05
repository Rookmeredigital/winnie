# Mailbox Map — CBA + SEC

**Status:** Will be hosted on Microsoft 365 once domain transfers and
M365 setup are complete.
**Owner:** Aaron Dolan
**Last updated:** 5 May 2026

---

## How to read this document

Each mailbox has:
- **Address** — the email address
- **Type** — Personal / Shared / Role-based
- **Purpose** — why it exists
- **Routing** — what Winnie does when mail arrives
- **NAS folder** — where the email is filed
- **Auto-reply** — whether Winnie can send pre-approved replies without
  Aaron's per-message approval (only for whitelisted templates)

---

## CBA — criminalbar.com

### Core identity

#### aaron.dolan@criminalbar.com
- **Type:** Personal
- **Purpose:** Aaron's primary identity for CBA work
- **Routing:** Goes directly to Aaron's morning brief and inbox view.
  No auto-classification — Aaron sees everything raw.
- **NAS folder:** Z:\\2026\\09-Correspondence\\Aaron-Personal\\
- **Auto-reply:** Out-of-office only (Aaron-controlled)

### Operational (shared)

#### info@criminalbar.com
- **Type:** Shared
- **Purpose:** Public-facing intake. Anyone who finds the website and
  has a generic question lands here.
- **Routing:** Winnie classifies. Membership questions → membership
  workflow. Press questions → flagged for Aaron. Spam → discarded.
  Generic FAQ → drafted reply queued.
- **NAS folder:** Z:\\2026\\09-Correspondence\\Info\\
- **Auto-reply:** Confirmation receipt only ("Thanks, we'll come back
  to you within X working days").

#### admin@criminalbar.com
- **Type:** Shared
- **Purpose:** General correspondence, internal admin matters
- **Routing:** Same classification logic as info@
- **NAS folder:** Z:\\2026\\09-Correspondence\\Admin\\
- **Auto-reply:** None

#### enquiries@criminalbar.com
- **Type:** Shared
- **Purpose:** General enquiries (often from non-members)
- **Routing:** Same as info@
- **NAS folder:** Z:\\2026\\09-Correspondence\\Enquiries\\
- **Auto-reply:** Confirmation receipt only

### Leadership (role-based)

#### chair@criminalbar.com
- **Type:** Role-based, transfers annually
- **Purpose:** Whoever holds the Chair role uses this address. Allows
  continuity across leadership terms.
- **Routing:** Goes to current Chair + cc Aaron. Winnie classifies for
  the Chair's benefit (urgent / governance / external request /
  internal).
- **NAS folder:** Z:\\2026\\01-Leadership\\Chair\\
- **Auto-reply:** None
- **Annual handover:** When term ends, mailbox archives current year,
  outgoing Chair offered transfer of contacts to incoming Chair.

#### vicechair@criminalbar.com
- **Type:** Role-based, transfers annually
- **Same pattern as chair@**

### Finance & funding

#### finance@criminalbar.com
- **Type:** Shared
- **Purpose:** Invoices in, financial correspondence
- **Routing:** Invoice detection → flagged for Aaron's approval.
  Budget queries → flagged.
- **NAS folder:** Z:\\2026\\02-Finance\\Invoices\\ (with subfolder per
  vendor)
- **Auto-reply:** None

#### treasurer@criminalbar.com
- **Type:** Role-based
- **Purpose:** Whoever is Treasurer
- **NAS folder:** Z:\\2026\\02-Finance\\Treasurer\\

#### funding@criminalbar.com
- **Type:** Shared
- **Purpose:** Grant applications, funding bodies, sponsorship
- **NAS folder:** Z:\\2026\\02-Finance\\Funding\\

### Committees (each gets a NAS folder + restricted access via Cloudflare Tunnel)

#### remuneration@criminalbar.com
- **Type:** Shared, committee
- **Purpose:** Remuneration committee correspondence (legal aid rates,
  fee scales, etc.)
- **Routing:** Winnie classifies, all members of committee CC'd
- **NAS folder:** Z:\\2026\\03-Committees\\Remuneration\\
- **Tunnel access:** Committee members only

#### youngbar@criminalbar.com
- **Type:** Shared, committee
- **Purpose:** Young Bar committee — issues affecting junior practitioners
- **NAS folder:** Z:\\2026\\03-Committees\\YoungBar\\
- **Tunnel access:** Committee members only

#### equality@criminalbar.com
- **Type:** Shared, committee
- **Purpose:** Equality, diversity, inclusion matters
- **NAS folder:** Z:\\2026\\03-Committees\\Equality\\
- **Tunnel access:** Committee members only

#### wellbeing@criminalbar.com
- **Type:** Shared, committee
- **Purpose:** Wellbeing committee — mental health, work conditions,
  support
- **Routing:** Sensitive flag; if any individual disclosure, Winnie
  flags but does not draft auto-reply
- **NAS folder:** Z:\\2026\\03-Committees\\Wellbeing\\
- **Tunnel access:** Committee members only
- **Sensitivity:** High — handle with care

#### rasso@criminalbar.com
- **Type:** Shared, committee
- **Purpose:** Rape and Serious Sexual Offences working group
- **Routing:** Sensitive flag; high volume; specialist legal content
- **NAS folder:** Z:\\2026\\03-Committees\\RASSO\\
- **Tunnel access:** Committee members only
- **Sensitivity:** Very high — handle with care, no AI summarisation
  of victim/case details unless explicitly requested

### Events & education

#### events@criminalbar.com
- **Type:** Shared
- **Purpose:** Event bookings, conference correspondence, venue logistics
- **Routing:** Booking detection → calendar entry queued. Venue
  questions → flagged for Aaron.
- **NAS folder:** Z:\\2026\\04-Events\\
- **Auto-reply:** Booking confirmation template

#### training@criminalbar.com
- **Type:** Shared
- **Purpose:** Training course bookings, CPD enquiries, content
- **NAS folder:** Z:\\2026\\05-Training\\

### Specialist functions

#### bursaries@criminalbar.com
- **Type:** Shared
- **Purpose:** Bursary applications and queries
- **Routing:** Application detection → application workflow
- **NAS folder:** Z:\\2026\\06-Bursaries\\
- **Sensitivity:** Medium (financial info)

#### scholarships@criminalbar.com
- **Type:** Shared
- **Purpose:** Scholarship applications and queries
- **NAS folder:** Z:\\2026\\07-Scholarships\\
- **Sensitivity:** Medium

### CBA — total: **17 mailboxes**

---

## SEC — southeastcircuit.org.uk

### Core identity

#### aaron.dolan@southeastcircuit.org.uk
- **Type:** Personal
- **Same pattern as CBA Aaron mailbox**
- **NAS folder:** Y:\\2026\\09-Correspondence\\Aaron-Personal\\

### Operational (shared)

#### info@southeastcircuit.org.uk
- **Type:** Shared
- **NAS folder:** Y:\\2026\\09-Correspondence\\Info\\

#### admin@southeastcircuit.org.uk
- **Type:** Shared
- **NAS folder:** Y:\\2026\\09-Correspondence\\Admin\\

#### enquiries@southeastcircuit.org.uk
- **Type:** Shared
- **NAS folder:** Y:\\2026\\09-Correspondence\\Enquiries\\

### Leadership (role-based)

#### leader@southeastcircuit.org.uk
- **Type:** Role-based, transfers annually
- **Purpose:** Leader of the South Eastern Circuit
- **Annual handover:** Confirmed in Capabilities Annex section 11.

#### deputy.leader@southeastcircuit.org.uk
- **Type:** Role-based, transfers annually

#### recorder@southeastcircuit.org.uk
- **Type:** Role-based, transfers annually
- **Purpose:** SEC Recorder (secretary equivalent)

#### junior@southeastcircuit.org.uk
- **Type:** Role-based, transfers annually
- **Purpose:** Junior of the Circuit

#### Arabella's existing mailbox
- **Status:** Existing PA mailbox for the Leader's private office
- **Action:** Migrate to M365 alongside the others; preserve the
  address she currently uses

### Finance

#### finance@southeastcircuit.org.uk
- **Type:** Shared
- **NAS folder:** Y:\\2026\\02-Finance\\

#### treasurer@southeastcircuit.org.uk
- **Type:** Role-based

### Committees

#### exec@southeastcircuit.org.uk
- **Type:** Shared, committee
- **Purpose:** SEC Executive Committee
- **NAS folder:** Y:\\2026\\03-Committees\\Exec\\
- **Tunnel access:** Committee members only

#### education@southeastcircuit.org.uk
- **Type:** Shared, committee
- **NAS folder:** Y:\\2026\\03-Committees\\Education\\

#### mentoring@southeastcircuit.org.uk
- **Type:** Shared, committee
- **NAS folder:** Y:\\2026\\03-Committees\\Mentoring\\

#### equality@southeastcircuit.org.uk
- **Type:** Shared, committee
- **NAS folder:** Y:\\2026\\03-Committees\\Equality\\

### Courses & events

#### keble@southeastcircuit.org.uk
- **Type:** Shared
- **Purpose:** The flagship Keble residential course
- **Routing:** All Keble correspondence here. International attendees
  (Hong Kong, Malaysia, South Africa) get course-attendee accounts on
  the SEC app, NOT full SEC membership.
- **NAS folder:** Y:\\2026\\04-Events\\Keble-2026\\
- **Volume:** Very high in lead-up to course week

#### events@southeastcircuit.org.uk
- **Type:** Shared
- **NAS folder:** Y:\\2026\\04-Events\\

### Membership

#### membership@southeastcircuit.org.uk
- **Type:** Shared
- **Purpose:** Membership applications, renewals, queries
- **Routing:** Application detection → membership workflow → Aaron's
  approval queue
- **NAS folder:** Y:\\2026\\10-Membership\\

### SEC — total: **17 mailboxes**

---

## Combined total: **28 + (Arabella's) = 29 mailboxes**

(Earlier I'd said 28; Arabella's existing PA address adds one. Future
roles or committees will be added to this document as they're created.)

---

## Microsoft 365 setup notes

**Plan required:** Microsoft 365 Business Standard (or Business Premium
for advanced security). Each *user* mailbox needs a licence; *shared*
mailboxes are free up to 50 each, which is more than enough.

**Identity strategy:**
- Aaron has **one Microsoft 365 user account** licensed for both
  domains
- Aaron has access to all shared mailboxes via delegation
- Other users (Chair, Leader, Treasurer etc.) each have their own
  user accounts when needed
- Shared mailboxes used for role-based addresses

**SPF / DKIM / DMARC:**
- Records configured on Cloudflare DNS once domains are transferred
- Microsoft provides exact values in the M365 admin centre
- DMARC starts at p=none for monitoring, moves to p=quarantine then
  p=reject after 30 days of clean reports

**Send-as permissions:**
- Aaron has send-as permission on every shared mailbox
- Winnie uses Aaron's account to send on his behalf via Microsoft Graph
  API (with user consent / admin grant)

**Audit logging:**
- M365 auditing turned on for all mailboxes
- Logs retained 90 days minimum (longer with appropriate licence)
- Winnie's own audit log is a *separate* layer that records what
  Winnie did, in addition to M365's own logs

---

## Future additions

- Hardship fund mailbox (TBD whether hardship@criminalbar.com or a
  separate domain)
- Pupil/Student section may need its own mailbox (e.g. students@)
- Press / media enquiries (currently going to info@; may need press@
  if volume warrants)
