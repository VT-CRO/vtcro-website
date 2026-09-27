# Setup, deployment & handoff (for developers / the VT CRO admin)

The website is a **Next.js** app with **Sanity** as the CMS, hosted on **Vercel**.
Every account below should be created with the **shared VT CRO email** so the site never depends on one student.

The site is connected to the Sanity project `prrl41cn` (dataset `production`). Local settings live in `.env.local` (not committed). Without those settings the site falls back to the sample content in `seed/documents.ts`.

---

## 1. Run it locally

```bash
npm install
npm run dev          # http://localhost:3000   (CMS at /studio once connected)
```

Requirements: Node 20.19+ (22+ recommended).

## 2. Create the accounts (one time, with the VT CRO email)

| Service | Why | Cost |
|---|---|---|
| **GitHub** — repo under the `VT-CRO` organization | Source code | Free |
| **Sanity** — sanity.io | CMS (content, images, logins) | Free tier |
| **Vercel** — vercel.com | Hosting + deploys + analytics | Free (Hobby) |
| **Resend** — resend.com | Sends contact-form emails | Free tier |

## 3. Connect Sanity

1. At **sanity.io/manage**, create a project (e.g. "VT CRO Website") with a dataset named `production` (public read).
2. Copy the **Project ID** into `.env.local` (copy `.env.example` first):
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
3. In the project's **API → CORS origins**, add (with credentials allowed):
   - `http://localhost:3000`
   - `https://www.vtcro.org` (and your `*.vercel.app` preview URL)
4. **Done 2026-09-27:** the starting content (teams, awards, principles, department sponsors, photos) was imported into the `production` dataset, and all sample/placeholder entries were then removed. **The CMS is now the source of truth.** Don't re-import `seed/`; it still contains the old sample entries. (`seed/documents.ts` is only used when the site runs without Sanity configured.)
5. Open `http://localhost:3000/studio`. The website manager logs in here.
6. Invite people under **sanity.io/manage → Members**:
   - **Administrator**: the website manager / president
   - **Editor**: anyone who only updates content

## 4. Deploy on Vercel

1. Import the GitHub repo in Vercel. The framework (Next.js) is auto-detected.
2. Add these **Environment Variables** (Production + Preview):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | from Sanity |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` |
   | `SANITY_REVALIDATE_SECRET` | any long random string |
   | `RESEND_API_KEY` | from Resend |
   | `CONTACT_FROM_EMAIL` | an address on a domain verified in Resend, e.g. `website@vtcro.org` |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.vtcro.org` |

3. In the Vercel project, enable **Analytics** (the tracking script is already installed).

## 5. Make "Publish" update the live site instantly

Pages are pre-built and cached (fast), then refreshed when content changes:

1. Go to **Sanity → API → Webhooks → Create webhook**.
2. Set these fields:

   | Field | Value |
   |---|---|
   | URL | `https://www.vtcro.org/api/revalidate` |
   | Dataset | `production` |
   | Trigger on | Create, Update, Delete |
   | Filter | *(leave empty)* |
   | Projection | `{_type}` |
   | Secret | the same value as `SANITY_REVALIDATE_SECRET` |
   | HTTP method | POST |

Without the webhook, changes still appear automatically within about an hour.

## 6. Contact form email

1. In Resend, verify the domain `vtcro.org` by adding the DNS records it gives you.
2. Set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` in Vercel.

The inbox each topic goes to is edited in the CMS (**Contact & social links → Contact form topics**). Until email is set up, the form politely tells visitors to email the general address instead.

## 7. Point vtcro.org at the new site (cutover)

1. In Vercel, go to **Settings → Domains** and add `vtcro.org` and `www.vtcro.org`.
2. At the domain registrar, replace the Webflow DNS records with the records Vercel shows:
   - `A` record for the apex domain
   - `CNAME` for `www`
3. Old Webflow URLs are redirected automatically (see `next.config.ts`). For example, `/design-teams/nav` goes to `/teams/autonav`, and `/gallery` goes to `/photos`.
4. After verifying the new site, cancel the Webflow hosting plan.

## 8. Backups

```bash
npm run cms:backup   # exports all content + images to backups/vtcro-YYYY-MM-DD.tar.gz
```

Do this at least at every leadership transition. Sanity also keeps revision history for every document.

---

## How the code is organized

```
app/(site)/            Pages. One file per route; team/event/member/album pages are dynamic templates
  teams/[slug]         ← every team page, generated from the CMS
  team/[slug]          ← every member profile
  events/[slug]        ← every event (+ calendar.ics download)
  photos/[album]       ← every album
app/studio             The CMS dashboard at /studio
app/api/revalidate     Webhook that refreshes the site after Publish
components/            Reusable UI (TeamCard, MemberCard, AwardLedger, PhotoGrid, Lightbox, …)
lib/content/           The data layer. Pages only call functions from lib/content/index.ts
  source.ts            Loads all published content (Sanity, or the sample seed when not connected)
  index.ts             Resolves relationships (team ↔ members ↔ awards ↔ photos ↔ events)
sanity/                CMS schema (the forms) and dashboard layout (structure.ts)
seed/                  Starting content + image sizes; scripts/build-seed.ts turns it into an import file
app/globals.css        Design tokens: colors, type scale, spacing, buttons, motion
```

**Adding a new kind of content** means:

1. Add a schema in `sanity/schemaTypes/`.
2. Add the type name to `TYPES` in `lib/content/source.ts`.
3. Add a resolver in `lib/content/index.ts`.
4. Render it in a component.

**Design system:**
- Colors, type and spacing are CSS variables at the top of `app/globals.css`.
- The accent blue is `--accent`, with `--accent-strong` used for filled buttons.
- Fonts: Montserrat, plus Geist Mono for small technical labels.
