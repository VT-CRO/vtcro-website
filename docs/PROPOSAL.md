# VT CRO Website Rebuild: Proposal

Status: **draft for review.** Nothing below is final until you've answered the questions in §13.
Prepared 2026-09-26.

---

## Decisions log

**2026-09-26**

**Stack: Sanity + Next.js + Vercel.**
All accounts (Sanity, Vercel, GitHub, Resend, etc.) are to be created by the user on the shared VT CRO email.

**Accent color: monochrome graphite plus one blue** (not burnt orange).

| Token | Hex | Used for | Contrast |
|---|---|---|---|
| `--accent` | `#6A9BF4` | Text, links, focus rings, status dots | 7.1:1 on base |
| `--accent-strong` | `#2F5FC4` | Filled buttons | White text 5.9:1 |

**Migrate:** teams, awards and core principles only. Everything else starts as clearly labeled empty placeholders:
- mission and about copy
- members and headshots
- sponsors
- recruitment
- contact
- events
- photos

**Design teams (7):**
- Canopy
- VexU
- AutoNav
- CroDart
- SoutheastCon
- CroQuest
- CroLabs

**Support teams (5):**
- Operations
- Outreach
- Learning
- Business
- Executive

**Executive** is a support team record. On the Team (people) page it appears only as a leadership group, as it does on the current site.

**2026-09-26, build answers**

**Content**
- Rosters: placeholder people.
- Team images: reuse the old site's logos and covers until final ones arrive.
- Team codes:

  | Team | Code |
  |---|---|
  | Canopy | CAN |
  | VexU | VEX |
  | CroQuest | QST |
  | AutoNav | NAV |
  | CroLabs | LAB |
  | CroDart | DRT |
  | SoutheastCon | SEC |

**WorkCell** is a former team. It's shown as a homepage Project with its awards, "Exhibited at Open Sauce 2026", and "Open-source launch coming soon".

**Award mapping**

| Awards | Team / project |
|---|---|
| NRC, Open Sauce | WorkCell |
| SoutheastCon | SoutheastCon |
| VEX Worlds, Seagull Showdown (×2), VT Competition | VexU |
| Everything else (Giving Day, Mixxer, Royal Rumble) | CroDart |

All awards are shown on the homepage.

**Team (people) page**
- One grid, grouped by team, with filters.
- Each person appears once.
- Individual profile pages show name, major, graduation year, photo, team, and LinkedIn/website.
- No alumni section.

**Pages**
- Sponsors page: why-sponsor points, packet PDF, contact.
- Events page.
- No other old pages carry over.

**Links**
- No Wiki.
- Discord: CroLearning (discord.com/invite/CNRdwzXdSr).
- LinkedIn, YouTube and Instagram.

**Other**
- Footer: keep `while(true)`, drop the founder quote.
- Second font allowed: Geist Mono, for small labels.
- DNS: controlled by the user.
- All email goes to vtcro23@gmail.com for now.
- Analytics: Vercel.

**Hero headline drafts.** Option 1 is live; switch in CMS → Homepage.

1. Robotics, engineered to compete.
2. Student-built robots. Competition-proven engineering.
3. Where Virginia Tech engineers build to win.
4. Designed in Blacksburg. Tested in competition.

**2026-09-26, redesign feedback**

**Visual direction.** Innovative, funky student-maker vibe, still polished:
- A deeper blue accent, used in gradients, glows and buttons.
- Soft shadows throughout.
- Light and dark sections alternate, including photo bands with translucent strips.
- Blueprint grid, circuit-trace pulses, sticker team logos, taped polaroids and a team marquee.
- Cursor-tilt cards and pointer spotlights.

**Structure changes**
- **Hero:** a big centered logo, with design and support teams listed under it as logo stickers. No tagline, no stats.
- **Page headers:** removed from every page, along with all section numbering and counts.
- **Icons:** added to principles, awards and every list.
- **Team tiles:** a uniform size with equal gutters.

**Content changes**
- **About:** from the Constitution (mission, purpose, structure, member progression).
- **Apply:**
  - Who can apply: all VT students, undergraduate and graduate, passionate about and dedicated to robotics.
  - Process: Apply → Interview (if selected) → Offer letters.
  - CroLearning: open to everyone, and the gateway to the design teams.
  - Timeline, FAQ and the "questions about joining" section are removed.
- **Gallery:** no team filter.
- **Contact:** the socials heading is "Follow us".
- **New photos:** from `assets/pictures` (the former `Pictures` folder). The ECE, ME and ISE department logos are shown as Department Supporters.

**2026-09-26, refinement (supersedes the "funky/techy" pass)**

**Design direction**
- Premium, clean, elegant and minimal.
- Monochrome, with no accent color.
- Lighter heading weights and very subtle motion.
- Removed: circuits, blueprint grids, outlined text, marquee, stickers, tilt, glows and photo bands with gaps.

**Homepage**
- Opens with the big logo on the PCB photo (DSCF0257), with corporate and department sponsor logos in two columns underneath.
- No team roster in the hero, and no Photos section.
- **About:** mission, "what we are" (the premier design team at VT and its largest design team organization) and "what we believe in" (small, dedicated, tight-knit teams).
- **Awards:** one list, most recent first.
- **Core principles:** name and statement only.
- **Design Teams:** three wide tiles per row.

**Site-wide**
- Photos → **Gallery** (`/gallery`).
- Footer: "The place to do robotics at Virginia Tech."
- No team logos in the footer.

---

## 0. What I reviewed

**Your assets (saved to `brand/`)**

| File | Contents | Notes |
|---|---|---|
| `vtcro-icon-black.png` | Bird mark, black | 480×481 raster |
| `vtcro-icon-white.png` | Bird mark, white | 649×649 raster |
| `vtcro-logo-text-black.webp` | Mark + "VT CRO" wordmark, black | 2000×629 |
| `vtcro-logo-text-white.webp` | Mark + "VT CRO" wordmark, white | 2000×629 |

All four are rasters. They're fine for a first build, but vector (SVG/AI/PDF) versions will be needed for crisp rendering at every size. The bird's fine feather detail especially needs them.

**The current site (vtcro.org, Webflow, last published 2026-09-07).** I crawled every public page. Here's what's there and could be migrated (pending your confirmation):

- **Socials:** GitHub `github.com/VT-CRO`, Instagram `instagram.com/vt_cro`, LinkedIn `linkedin.com/company/vtcro`, YouTube `@VT-CRO`, a Discord invite, and the Wiki at `wiki.vtcro.org`.
- **Mission:** "Improve the presence of robotics at Virginia Tech and surrounding communities."
- **Core principles:** Reliability ("Engineering you can count on."), Simplicity ("Simplicity surpasses complexity."), Modularity ("The cornerstone of flexible design.").
- **Belief statement:** small, tight-knit teams of 8–12 engineers.
- **Design teams (7):** AutoNav, Canopy, CROLabs, CroQuest, Dart, SoutheastCon, VEX U. Each has a short description, and most list a department, a competition, a long description, a Chief Engineer, and members.
- **Support teams (5):** Business, Executive, Learning, Operations, Outreach.
- **Awards (12):** results from NRC 2025, SoutheastCon 2024, VEX U 2024, VT Giving Day 2025, Royal Rumble 2025, Mixxer 2026, and Open Sauce 2026.
- **Sponsors:** Corporate (Polymaker, Torc) and Department (ECE, ME, ISE). The footer also lists SEC @ VT and IEEE @ VT, and Boeing appears on the CRO-Down page.
- **Members:** about 180 member profile pages at `/team/<name>`, with headshots for current members.
- **Recruitment:** recruiting runs every September, seniors are excluded with exceptions, applications for 2026–27 are closed, and Learning workshops are open to everyone.
- **Other pages:** `/vex-competition` (CRO-Down), `/sponsor-us`, `/ceed`, `/lab-waiver`, `/book-interview`, `/stories/southeastcon-2023-seniors`, and Webflow login/membership pages.
- **Photos:** the Webflow CDN holds a few dozen usable ones (team covers, a PCB hero, competition shots).

**Problems worth noting** (the new CMS removes these by design):
- The site says "six design teams", "Seven Design Teams" and "eight specialized design teams" in different places. It says "Four Support Teams" but lists five. The new site will **compute these counts from the CMS**, so they can't drift again.
- The Events and Photos pages are empty.
- Dart's and CroQuest's member lists are empty. Business has no members.
- Team URLs are cryptic (`/design-teams/dog` is CROLabs, `/design-teams/nav` is AutoNav).
- Images have empty alt text.

---

## 1. Proposed sitemap

```
/                         Home
/teams                    All teams (design + support), also reachable from Home
/teams/[slug]             One template renders every team page
/team                     People: the member directory ("Team" in the nav)
/team/[slug]              Member profile  ← only if you want these (Q-B3)
/events                   Upcoming + past, auto-sorted
/events/[slug]            Event detail
/photos                   Gallery: featured grid + album browser + filters
/gallery/[album]           Album view
/apply                    Recruitment: open/closed state driven by the CMS
/contact                  Contact routes, socials, form
/sponsors                 Sponsor page / "Support VT CRO"  ← optional (Q-C4)
/studio                   The CMS dashboard (login required)
/sitemap.xml, /robots.txt, custom 404
```

**Redirects from the old URLs** keep existing links and search rankings working:

- `/design-teams/nav` → `/teams/autonav`, and the same for every other team.
- `/support-teams/*` → `/teams/*`.
- `/gallery` → `/photos`.
- `/vex-competition` → the CRO-Down event page.
- `/team/<name>` is kept as-is if profile pages stay.

Redirects are stored in the CMS, so the manager can add more.

## 2. Technical architecture

| Layer | Recommendation | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Static pages that refresh when content changes, dynamic routes (`/teams/[slug]`), built-in image optimization, metadata/sitemap APIs, and the largest ecosystem, so future student developers will know it |
| Styling | **Hand-written CSS with design tokens** (CSS custom properties + CSS Modules) | A small, custom design system instead of utility-class soup. It's what keeps the site from looking like a Tailwind demo, and it's easy to read later |
| Motion | CSS transitions + a very small IntersectionObserver reveal utility; View Transitions API for page changes | No heavy animation library. Motion is off automatically under `prefers-reduced-motion` |
| CMS | **Sanity** (see §3) | Hosted, free tier, strong relationships and image pipeline |
| Images | Sanity image CDN (auto WebP/AVIF, responsive sizes, crop hotspot) | The manager uploads originals and never resizes anything |
| Hosting | **Vercel** (free Hobby tier) | Zero-config Next.js, preview deploys, global CDN. Netlify or Cloudflare Pages also work |
| Content refresh | Sanity webhook → Next.js on-demand revalidation | Hit "Publish" and the live site updates within seconds while pages stay statically fast |
| Contact form | Next.js server action → **Resend** (free tier) email, routed by topic to addresses set in the CMS; honeypot + rate limit for spam | No third-party form widget, and routing can be edited in the CMS |
| Fonts | Montserrat, self-hosted via `next/font` (variable, subset) | No layout shift and no Google Fonts request |
| Analytics | Optional: Vercel Web Analytics, or keep your existing GA4 ID | Q-D5 |

**Ownership (important for handoff):** every account (GitHub repo, Vercel, Sanity, Resend, domain) should be owned by a **shared VT CRO account or organization**, not by one student. The CMS gets role-based users: an Administrator (you or the web manager) and Editors (people who can update content but not settings).

## 3. CMS recommendation: Sanity

**Why Sanity**

- **Hosted and free for an organization your size.** There's no server or database for students to maintain, which is the biggest handoff risk with self-hosted CMSs. Confirm current quotas when we set it up; the free tier has comfortably covered orgs this size.
- **Real relationships.** A team *references* member documents, an award *references* a team, and so on. Change something once and it updates everywhere. Deleting a member who's still referenced is blocked with a warning.
- **The best image handling of the options.** The manager uploads a full-resolution photo, and the site serves correctly sized WebP/AVIF automatically. A **hotspot/crop tool** lets them mark the important part (e.g. a face), so every crop stays correct across card and hero sizes. Every image field has an **alt text** input.
- **A fully customizable dashboard.** I can arrange the sidebar exactly as you described (Homepage / Teams / Members / Events / Photos / Awards / Sponsors / Recruitment / Contact & Social / Site Settings). Fields can have plain-English help text, and anything technical can be hidden.
- **Drag-and-drop ordering** for teams, sponsors, awards and principles, so there's no "display order = 7" number juggling.
- **Bulk photo upload:** drag 200 photos into an album at once.
- **Built-in revision history:** any edit can be rolled back.
- **Login** with Google, GitHub or email. Authentication is managed by Sanity, and you don't run any auth code.

**Drawbacks**

- **Content is hosted by Sanity (a vendor).** Mitigation: it's fully exportable (`sanity dataset export`), and I'll add a documented backup command.
- **Free-tier limits could change in future.** Mitigation: the paid tier is the fallback, and the export path above still applies.
- **Developers need to learn GROQ,** Sanity's query language. The manager never sees it, and all queries live in one file.
- **The dashboard is a React app.** Customizing it later requires a developer, but day-to-day editing doesn't.

**Alternatives considered**

| Option | Verdict |
|---|---|
| **Stay on Webflow** | Paid, CMS item caps, weak relationships (the reason for today's count drift), and it limits design. No |
| **Payload CMS** (self-hosted) | Excellent, but needs a database + file storage + hosting to maintain. That's more that can break after handoff |
| **Strapi** | Same self-hosting burden as Payload, plus a less polished editor |
| **Decap / TinaCMS** (git-based) | Free, but relationships are weak, hundreds of photos bloat the Git repo, and editor auth is awkward |
| **Contentful** | Capable, but free-tier limits are tight and the editor is less friendly for this use |

## 4. CMS content model

Legend: ⟶ is a reference (a relationship, not a copy). "Singleton" means there's exactly one of it.

**Site Settings** (singleton)
- Organization name
- Short description (footer + SEO)
- Logos (icon + wordmark, light/dark)
- Default social share image
- Emails:
  - General
  - Sponsorship
  - Outreach
  - (extensible list)
- Social links: GitHub, Instagram, LinkedIn, YouTube, Discord, Wiki, plus more
- Location/address (optional)
- Contact-form routing: for each topic, a label and the email it goes to
- Footer quote/tagline (optional)
- Redirects list

**Homepage** (singleton)
- Hero:
  - Eyebrow
  - Headline
  - Description
  - Background image *or* video (with poster image)
  - Primary and secondary CTAs (label + link)
- About:
  - Who we are
  - What we do
  - Mission
  - What we believe
- Core principles, a drag-orderable list of:
  - Name
  - Short statement
  - Description
  - Icon (optional)
- Section order + show/hide toggles (drag to reorder sections)
- Section headings/intros for Design Teams, Support Teams, Awards, Sponsors, Photos, Apply banner

**Team**
- Identity:
  - Name
  - Slug (auto from name)
  - Team code (optional, e.g. `NAV`)
  - Type: Design / Support
  - Active
  - Featured
- Media:
  - Logo
  - Cover image
  - Gallery
  - Video URL (optional)
- Short description
- Full description (rich text)
- Mission
- Objectives (list)
- Current project:
  - Name
  - Summary
  - Images
  - Specs table, as optional key/value rows
- Department affiliation
- Competition:
  - Name
  - URL
  - Rules URL
  - Location
  - Logo
- **Leadership:** a list of { ⟶ Member, title } (e.g. "Chief Engineer")
- **Roster:** a list of { ⟶ Member, role on this team (optional) }
- Links:
  - GitHub repo(s)
  - Application URL
  - External site
  - Technical documentation
- Additional sections: a flexible list of blocks:
  - Rich text
  - Image grid
  - Video
  - Specs
  - Callout
- SEO overrides (optional)

**Member**
- Name
- Slug
- Photo (+ alt)
- Major
- Graduation year
- Biography
- Email
- LinkedIn
- GitHub
- Website
- Status: Active / Alumni / Inactive
- Executive role (optional title + order, for the Executive group)
- Sidebar panel **"Appears on"**: a read-only list of the teams and leadership roles that reference this person

**Event**
- Name
- Slug
- Image
- Start date/time
- End date/time
- All-day toggle
- Location:
  - Name
  - Address
  - Map link
- Short description
- Full description
- Registration link
- External link
- Category
- ⟶ Teams
- Featured
- Active

Upcoming/Past is **computed from the date.** There's no field for it.

**Album**
- Title
- Slug
- Date
- Cover
- Category
- ⟶ Team(s)
- ⟶ Event
- Photos: a bulk-upload list. Each photo has:
  - Image
  - Alt text
  - Caption
  - Date
  - Photographer credit
  - Featured
  - Tag overrides (team/event), for the rare photo that differs from its album

**Award**
- Title
- Placement (e.g. "1st", "Design Award")
- Rank (1/2/3/other, drives styling)
- Competition/event
- Year
- Location
- ⟶ Team
- Description
- Image
- External URL
- Featured
- Order

**Sponsor**
- Name
- Logo
- "Logo for dark backgrounds" (optional)
- ⟶ Sponsor Category
- ⟶ Tier (optional)
- URL
- Description
- Active
- Order

**Sponsor Category** and **Sponsor Tier**
- Name
- Description
- Order

**Recruitment** (singleton)
- Applications open (Yes/No)
- Application URL
- Button label
- Application period (start/end)
- Open message
- Closed message + "get notified" link
- Eligibility (rich text)
- Process steps
- Timeline (date + label rows)
- FAQ (question/answer rows)
- Opportunities: ⟶ Teams with a note each
- Alternative ways to get involved

**Event Category** and **Photo Category**
- Small editable lists, so the manager never types free text that drifts

### Why roster lives on Team (a decision for you)

Your example (§16 of your brief) creates a team with "Members: A, B, C", so I put the roster **on the Team**, with a per-team role. Here's how that behaves:

- **Jane on AutoNav and Outreach:** she's one Member document, referenced by two teams. She has one headshot and one bio.
- **Jane graduates:** set Status = Alumni. She disappears from every current roster automatically, and her record and history stay.
- **Jane's profile:** her Member page and the main Team page find her teams automatically. The manager never lists teams twice.

The alternative is putting "Teams" on the Member instead. Both work. This way matches how rosters usually arrive (each Chief Engineer sends a list).

## 5. How everything relates

```
                 ┌──────────────┐
      leadership │              │ roster
   ┌─────────────┤     TEAM     ├──────────────┐
   ▼             │ design/support│             ▼
 MEMBER ◀────────┴──────┬───────┴────────── MEMBER
 (one record,           │ ▲  ▲  ▲
  many teams)           │ │  │  └──── EVENT ⟶ teams
                        │ │  └─────── ALBUM ⟶ teams, event ──▶ photos
                        │ └────────── AWARD ⟶ team
                        ▼
              Homepage sections, /teams, /team, footer, nav: all derived

 SPONSOR ⟶ SPONSOR CATEGORY, SPONSOR TIER
 RECRUITMENT ⟶ teams (opportunities)
 SITE SETTINGS ──▶ nav, footer, contact page, form routing, SEO defaults
```

Where each piece of data shows up:

- **A team page** pulls its own fields, plus:
  - leaders and roster (resolved Member records),
  - awards that reference it,
  - albums that reference it,
  - upcoming events that reference it.
- **A member page** shows every team that references that member.
- **An event page** shows albums tagged to that event.

## 6. How a website manager updates the site

They log in at **vtcro.org/studio** and use forms. Common jobs:

| Task | Steps |
|---|---|
| New team next year | Teams → **+ Create** → fill the form, upload logo + cover → pick members from a searchable list → Publish. It appears on Home, /teams, the footer and its own page automatically |
| 30 graduate, 30 join | Mark graduates **Alumni**. Create new Members (drag in headshot, type name/major/year) → add them to their team rosters. Every page updates |
| Change the Chief Engineer | Open the team → change who's referenced in Leadership → Publish |
| New sponsor | Sponsors → + Create → logo, category, URL → drag into position |
| Won an award | Awards → + Create → pick the team → toggle **Featured** to show it on Home |
| Photos from a competition | Photos → + New album → drag in 150 photos → tag team/event → Publish. Resizing is automatic |
| Open applications | Recruitment → Applications open **Yes** → paste form URL → Publish. The Apply page, nav button and CTAs switch state |
| Change a contact email | Contact & Social → edit once. It updates everywhere |

Other things built in:

- **Preview:** an "Open preview" button shows unpublished changes before they go live.
- **Undo:** the revision history on every document.
- **Handoff guide:** I'll write a short manager guide (screenshots + checklist) as part of delivery.

## 7. Navigation structure

**Primary:** Home · Team · Events · Apply · Photos · Contact
**Utilities:** GitHub icon + label (visible at all sizes, not hidden in the menu), Instagram icon.
**Apply** gets a button style with a live status dot ("Applications open" / "Closed"), driven by the CMS.

- **Desktop:**
  - A slim sticky bar, transparent over the hero, turning into a solid dark surface after scrolling.
  - The logo on the left, links in the center, and GitHub · Instagram · Apply on the right.
  - The "Team" link has an optional flyout listing Design and Support teams, pulled from the CMS.
- **Mobile:**
  - The bar hides while scrolling down and returns on scroll-up.
  - "Menu" opens a **full-height sheet**, not a hamburger dropdown:
    - Large numbered links (01 Home … 06 Contact), set low in the screen for thumb reach.
    - A horizontally scrollable strip of team logos.
    - A pinned Apply button with status.
    - GitHub/Instagram at the bottom.
  - Focus is trapped while open, Esc/back closes it, and the scroll position is restored.

**Footer:**
- Logo + one-line description
- Nav
- Design teams
- Support teams
- Contact emails
- Socials (GitHub first)
- Copyright

The footer stays clean with four columns on desktop and stacked accordions on mobile.

## 8. Homepage structure (default order; manager can reorder/hide)

1. **Hero:**
   - A full-bleed photo or muted loop video, with a dark gradient for legibility (no glows).
   - Logo mark, headline, description, and two CTAs.
   - A thin **data rail** along the bottom: "7 Design Teams · 5 Support Teams · N Engineers", *computed live from the CMS* (no hand-typed statistics).
2. **About:** an editorial layout: a large mission statement in light-weight Montserrat, then Who we are / What we do / What we believe in a measured-width column.
3. **Design Teams:** the flagship section. Each team gets a large photographic card with its logo, team code, department and competition tags, and a Learn More link.
4. **Awards:** a trophy ledger with large placement numerals ("1ST"), competition, year and location in small caps, and the team tag. Featured awards get image-backed tiles. Presented like a record, not a list of pills.
5. **Core Principles:** three (or N) principles as numbered columns with thin rules and short statements. Calm and typographic.
6. **Support Teams:** a more compact, secondary treatment, so it's clearly different from Design Teams.
7. **Upcoming Events:** the next 1–3 events. The section hides itself if there are none.
8. **Photo strip:** featured photos in an edge-to-edge horizontal reel linking to /photos.
9. **Sponsors:** grouped by CMS category with uniform logo sizing. Tiers, if used, control logo scale.
10. **Apply banner:** its state follows the Recruitment settings.

## 9. Mobile design direction

- **Composition:**
  - Single column with a 20px gutter.
  - A strong vertical rhythm on a 4px baseline; sections separated by surface-tone shifts and hairline rules, not boxes.
- **Hero:**
  - Nearly full viewport height (`svh` units, so the mobile browser bar doesn't clip it).
  - The image is cropped via the CMS hotspot.
  - The headline sits in the lower third; CTAs are full-width and stacked, 52px tall.
- **Design Teams:** a vertical stack of tall 4:5 photo cards, one per screen height, with the logo and name over the image, so it's quick to flick through. Each card is one large tap target.
- **Support Teams:** compact rows (logo · name · arrow).
- **Awards:**
  - A horizontal swipe row of featured award tiles (scroll-snap).
  - The full ledger below as a clean two-line list.
- **Members:**
  - A two-column grid of portrait headshots with name and role underneath.
  - Tap to open a bottom-sheet profile, or go to the profile page if enabled.
  - Filter chips (All / Executive / by team) stick below the header.
- **Events:** date-block cards (a large day number plus month), with upcoming first and past collapsed into a "Past events" list.
- **Gallery:**
  - A two-column masonry grid.
  - Album chips scroll horizontally.
  - The lightbox supports swipe, pinch-zoom and swipe-down to close.
- **Forms:** 16px inputs (no iOS zoom), large targets, and inline validation.
- **Touch:** nothing relies on hover. No horizontal overflow anywhere, checked at 320px.

## 10. Desktop design direction

- **Grid and width:**
  - A 12-column grid with a max content width around 1320px.
  - Text columns capped at about 68 characters.
  - At 1440–2560px, images extend to the bleed while text stays on the grid.
- **Hero:**
  - An asymmetric editorial composition: the headline left over columns 1–7, with the description and CTAs aligned to a lower baseline.
  - The data rail runs along the bottom edge.
  - Very subtle parallax on the image (disabled under reduced motion).
- **Design Teams:**
  - An asymmetric grid: the first or featured team large, the others in a rhythm of 2 and 3.
  - Hover reveals the description, slightly scales the image (1.03), and slides the arrow.
  - Or an indexed list: team names in large type, with a hovered name revealing its photo in a fixed frame. I'll mock both and you pick (Q-E4).
- **Awards:** a full-width ledger table with year, placement numeral, award, competition, location and team, plus featured tiles above.
- **Team pages:**
  - A cinematic cover.
  - A sticky left rail (team code, department, competition, links, GitHub).
  - A long-form narrative on the right.
  - Leadership and roster in a larger portrait grid.
  - Awards and gallery inline.
  - Any section without content doesn't render.
- **Gallery:** a justified-row layout that preserves aspect ratios, plus a full-screen lightbox with keyboard ←/→/Esc, captions and credits.
- **Depth:** achieved with 2–3 surface tones, 1px borders at around 8% white, and soft shadows only on overlays. No glassmorphism beyond the nav bar's subtle blur.

### Visual identity (both sizes)

- **Palette:** refined graphite, *not* pure black.

  | Token | Value | Use |
  |---|---|---|
  | Base | ≈ `#0B0C0E` | Page background |
  | Surface 1 | ≈ `#121417` | Sections |
  | Surface 2 | ≈ `#1A1D21` | Cards |
  | Hairline | ≈ `rgba(255,255,255,.08)` | Borders, rules |
  | Text | ≈ `#F2F2F0` | Primary text |
  | Muted text | ≈ `#9A9EA5` | Secondary text |

  **The accent color is your decision** (Q-A1). The logo is monochrome, so options range from strict monochrome to a single restrained accent.
- **Typography (Montserrat):**

  | Style | Size | Weight | Tracking | Notes |
  |---|---|---|---|---|
  | Hero | clamp 44→112px | 600 | −0.035em | |
  | Page title | 40→72px | 600 | | |
  | Section heading | 30→48px | 600 | | |
  | Subheading | 20→24px | 500 | | |
  | Body | 16→18px | 400 | | 1.6 line-height |
  | Caption | 13–14px | 400 | | |
  | Labels / nav / metadata | 11–13px | 600 | +0.14em | Uppercase |
  | Buttons | 14–15px | 600 | +0.02em | |

  Tabular numerals for dates and placements. Optional: a monospace companion for technical metadata (Q-A3).
- **Motif:** the language of engineering drawings.
  - Hairline rules, index numbers (01 / 02), team codes, small uppercase annotations.
  - Section headers laid out like a drawing's title block (label · index · title).
  - The feather-stripe rhythm of the bird mark may inspire a divider pattern, with your approval.
- **Motion:**
  - 250–500ms ease-out reveals (fade + 12px rise), triggered once.
  - Image zoom on hover.
  - Cross-fade page transitions.
  - Nothing loops except an optional hero video.
  - Everything is static under reduced motion.

## 11. Assets still needed

**Brand**
- **Vector logos** (SVG/AI/PDF) for the mark and the wordmark
- A favicon source, if different from the mark
- A social share image, or approval for me to compose one from the logo + a photo
- Official color values, if any exist

**Teams**
- A logo for every team (the current site has some team logo PNGs I can use temporarily)
- A cover photo per team (at least 2400px wide)
- 3–10 project photos per team
- Team robot renders, CAD, or diagrams, if you want technical imagery

**People**
- Headshots in a consistent style (ideally the same backdrop and crop). Current headshots vary in format; some are PNG cut-outs with names in the filename.

**Other**
- Sponsor logos, ideally white/monochrome versions for a dark site plus the originals
- Hero photography or video: 1–3 strong wide shots, or a 10–20s silent B-roll clip
- Award photos (trophies, podiums)
- Gallery photos, organized in folders by event, if possible
- Event images

## 12. Information still needed

**Organization**
- Headline and short description
- Who we are / what we do / what we believe
- Confirmation that the mission and three principles are current
- The founding year, *only* if you want it shown

**Teams**
- The confirmed current design and support team lists
- Whether WorkCell/Manufacturing Cell is a team, a product, or part of Canopy
- Preferred team slugs and codes
- Descriptions for each team
- Departments for each team
- Competitions for each team
- Leadership for each team
- Rosters for each team
- GitHub repos for each team

**People**
- Current members, with majors and graduation years (not shown on the current site)
- Executive roles
- Who counts as alumni

**Sponsors and awards**
- The confirmed sponsor list, categories, tiers and URLs
- Whether IEEE @ VT, SEC @ VT and Boeing are current sponsors
- The confirmed award list, plus any that are missing

**Contact**
- General email
- Sponsorship email
- Outreach email
- Where contact-form messages should go

**Recruitment**
- Eligibility rules
- Process
- Timeline
- FAQ
- The next cycle's dates and application URL

**Events and photos**
- Events to seed (e.g. CRO-Down 2027, the Expo). The current events page only has an Expo banner
- Photos

**Hosting**
- Who controls vtcro.org DNS
- Whether the Webflow plan must stay active until cutover
- Whether you have Webflow CMS CSV export access. That would be much cleaner than scraping

## 13. Questions

### Blocking: needed before I start building

**Q-D1. Is Sanity approved as the CMS, with Next.js on Vercel?**
Also: does VT CRO have a shared account that should own Sanity, Vercel and GitHub? The `VT-CRO` GitHub org exists.

**Q-A1. Which accent color should the site use?**

| Option | Notes |
|---|---|
| (a) Strict monochrome | White/graphite only; the photography carries color |
| (b) Monochrome + VT Burnt Orange `#E5751F` | Used sparingly: CTAs, status, focus rings |
| (c) Monochrome + a lightened Chicago Maroon | Pure `#861F41` is too dark to read on a dark background |
| (d) An official CRO color | Only if one exists; please send it |

My recommendation is **(b)**, because it ties the site to Virginia Tech without competing with the logo. It's your call.

**Q-C2. May I seed the CMS with content migrated from the current site?**
This covers team descriptions, departments, competitions, leaders/rosters with current headshots, the 12 awards, sponsors, mission, principles, socials and recruitment text. Every migrated record would be flagged "Migrated — verify" in the CMS so nothing is silently treated as final. The alternative is starting empty with placeholders.

**Q-B1. Is the current team list correct?**
- Design: AutoNav, Canopy, CROLabs, CroQuest, Dart, SoutheastCon, VEX U.
- Support: Business, Executive, Learning, Operations, Outreach.
- Is WorkCell a team, a product, or part of Canopy?
- Should "Executive" be a support team, or only a leadership group on the Team page?

### Structure

**Q-B2. How should the Team (people) page be organized?**
My proposal: Executive Leadership first, then one section per team (Design, then Support), with filter chips. A person on two teams appears under both.

**Q-B3. Do you want individual member profile pages?**
The current site has about 180 at `/team/<name>`, including many past members. If yes, should alumni keep public profiles?

**Q-B4. Should there be an Alumni section, or should alumni simply be hidden?**

**Q-B5. Should rosters be edited on the Team (recommended, see §4) or on the Member?**

### Content

**Q-C1. Who writes the hero headline and short description?**
You can write them, or I can draft 3–4 options, clearly marked as drafts, for you to choose or edit.

**Q-C3. Which old pages should carry over?**
- CRO-Down (`/vex-competition`)
- `/sponsor-us`
- `/ceed`
- `/lab-waiver`
- `/book-interview`
- The SoutheastCon 2023 story
- The Webflow login/member pages

**Q-C4. Do you want a dedicated /sponsors page?**
For example, "Why sponsor us" plus a sponsorship packet PDF and a contact button.

**Q-C5. Beyond GitHub and Instagram, which links go where?**
- Should the Wiki stay in the nav?
- Should Discord, LinkedIn and YouTube go in the footer and contact page?

**Q-C6. Should the Awards section on Home show featured awards only, or everything?**

**Q-A4. Should these details from the current site stay?**
- The `while(true) { simplify(); }` footer detail.
- The founder quote.

### Design

**Q-A2. Do vector logo files exist?**

**Q-A3. May I use a small monospace companion font for technical metadata?**
It would cover dates, codes and specs. Or should the site be Montserrat only?

**Q-E4.** I'll mock two Design Teams layouts (photo grid vs. indexed list) for you to pick.

### Infrastructure

**Q-D3. Who controls vtcro.org DNS, and when can the Webflow site be retired?**

**Q-D4. Do you want a contact form (routed by topic), or just listed emails?**
If a form, which address gets each topic?

**Q-D5. Should the existing Google Analytics (GA4) be kept, or replaced with privacy-friendly Vercel Analytics?**

## 14. Proposed build phases (after your answers)

1. **Foundation**
   - Next.js + Sanity project.
   - The complete content model and dashboard layout.
   - Design tokens and typography.
   - Core components.
   - Migration script (if approved).
2. **Homepage + team page template:** mobile first, then desktop. I'll send screenshots at 375 / 430 / 768 / 1280 / 1440 / 1920px for review.
3. **The other pages:** Team, Events, Photos (lightbox), Apply, Contact.
4. **Finish:**
   - SEO, sitemap and redirects.
   - Accessibility and performance passes (Lighthouse/axe).
   - A full responsive review at every size.
5. **Handoff:** the manager guide, backup procedure, and DNS cutover checklist.

**Placeholders:** any missing image renders as a clearly labeled graphite frame (e.g. "PLACEHOLDER — AutoNav cover photo"). They're CMS-driven, so replacing one is an upload, not a code change.
