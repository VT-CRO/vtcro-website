# VT CRO Website: Manager's Guide

You can keep the entire website up to date without touching code. Everything is edited in the **dashboard** at **vtcro.org/studio** (log in with the VT CRO account).

**The golden rules**
- **Edit once, it updates everywhere.** A person's headshot, a team's logo and a contact email each live in exactly one place.
- **Nothing goes live until you click _Publish_** (bottom right). The live site updates within seconds.
- **Every change can be undone.** Open a document, click the clock icon (top right) to see its history, and restore any earlier version.
- **Always fill in "Alt text"** on images. It describes the photo for visitors using screen readers.
- **Empty is fine.** Anything with no content yet (members, events, photos) shows "Coming soon" on the site and fills in by itself once you publish.

---

## The sidebar

| Section | What it controls |
|---|---|
| **Homepage** | Top photo, the line under the logo, About text, Core Principles, order of homepage sections |
| **Teams** | Design Teams and Support Teams: every team page is generated from here |
| **Members** | One entry per person: headshot, major, graduation year, teams, links. Also **Import from a spreadsheet** |
| **Events** | Events move from "Upcoming" to "Past" by themselves |
| **Gallery (albums)** | Photo albums for the gallery |
| **Awards** | Awards shown on the homepage and on team pages |
| **Projects** | Featured projects (e.g. WorkCell) |
| **Sponsors** | Sponsors (logos), sponsor categories, and the **Sponsor page** you share with companies (see below) |
| **Recruitment / Apply** | The applications open/closed switch, application period, messages, recruitment steps |
| **Contact & social links** | Emails, contact-form routing, GitHub, Instagram, LinkedIn, YouTube, Discord |
| **Site settings** | Organization name, footer text, link-preview image |

---

## People

### How the Team page is organized
The Team page (vtcro.org/team) has three groups, filled in automatically:

| Group | Who appears there | Where you set it |
|---|---|---|
| **Executive Team** | People in the **Executive** team's *Team leadership* list, with their titles, in the order you drag them | Teams → Support Teams → Executive → **People** tab |
| **Engineering Team** | Everyone on at least one **design team** (Canopy, VexU, AutoNav…) | The person's own form → **Teams** |
| **Support Team** | Everyone on only **support teams** (Operations, Outreach…) | The person's own form → **Teams** |

Each person appears once. An executive board member who is also on a design team shows under Executive Team.

### Add one person
1. **Members → Active members → +**.
2. Fill in **Full name** and click **Generate** next to the profile address. Everything else is optional: headshot, major, graduation year, LinkedIn, personal website, GitHub.
3. Under **Teams**, click **Add item** and pick each team they're on. The role is optional (e.g. *Software Lead*); if left empty the site shows "AutoNav Engineer" or "Outreach Member".
4. **Publish.**

### Team leads and the executive board
Open the team → **People** tab → **Team leadership** → add the person and their title (e.g. *President*, *Chief Engineer*). Drag to set the order. Leaders are shown first on the team page. For the Executive team, this list is the Executive Team on the Team page.

To see everyone on a team, open the team and click its **Members** tab (top of the form). To see every team a person is on, open the person and click **Appears on**.

### Add many people at once (spreadsheet import)
**Members → Import from a spreadsheet.**

1. Click **Download a blank template**, or use your own Google Sheet, Excel file or Google Form responses. Only a **Name** column is required. Other recognized columns are *Teams, Role, Major, Graduation year, LinkedIn, Website, GitHub, Email, Status*. Column headers can be worded freely, so Google Form questions work as they are.
2. **Teams**: team names or codes separated by commas, e.g. `AutoNav, Outreach` or `NAV; VEX`.

   Example (the template has these columns; any column except Name can be left out or left blank):

   | Name | Teams | Role | Major | Graduation year | LinkedIn | Website | GitHub | Email | Status |
   |---|---|---|---|---|---|---|---|---|---|
   | Jane Doe | AutoNav, Outreach | | Computer Engineering | 2028 | linkedin.com/in/janedoe | | github.com/janedoe | jdoe@vt.edu | Active |
   | Sam Lee | VEX | Software Lead | Mechanical Engineering | 2027 | | | | | |

   - **Role** applies to every team in that row. It is optional; empty shows "AutoNav Engineer", "Outreach Member" and so on.
   - **Status** is Active, Alumni or Inactive. Empty means Active for new people and "no change" for existing ones.
   - Web addresses can be written with or without `https://`. **Email** is never shown on the website.
   - Executive titles and team leads are not set by the import. Add those on the team's **People** tab.
3. Choose the **.csv** file (Google Sheets: File → Download → Comma-separated values), **or** copy the cells straight from the sheet, including the header row, and paste them into the box.
4. Optional **headshots**: select all the photo files at once. A photo is matched when its file name contains the person's full name, e.g. `Jane Doe.jpg`. Photos collected with a Google Form file-upload question are named that way automatically.
5. Check the preview. Each row says **New**, **Update** (already in the dashboard, matched by name) or what's wrong. Then click **Import**.

Imported people go live straight away. Re-importing is safe: nothing is deleted, empty cells never erase existing details, and teams are added, not replaced.

**Recommended yearly routine:** send new members a Google Form (name, teams, major, graduation year, optional links, headshot upload). Then open the responses in Sheets, download them as CSV, download the headshot folder from Google Drive, and import everything in one go.

### Someone graduates
Open the member and set **Status → Alumni**, then Publish. They disappear from every team and the Team page, but their record is kept. (Don't delete people; changing their status is enough.) You can also mark many people Alumni at once by importing a sheet with *Name* and *Status* columns.

---

## Other common tasks

### Add a new team
1. **Teams → Design Teams** (or Support Teams) → **+**.
2. Fill in **Team name** and click **Generate** next to Web address.
3. Choose **Design Team** or **Support Team**, and write the **Short description**.
4. Upload the **Team logo** and **Cover photo**. Drag the crop circle onto the important part of the photo.
5. Fill in the other tabs as needed. **Empty fields simply don't show on the site.**
6. **Publish.** Drag teams in the list to change their order everywhere.

### Open or close applications
**Recruitment / Apply**:
- **To open:** switch **Applications open?** on, paste the **Application form link**, set **Applications open on / close on**, then **Publish**. The Apply page shows the application period and an Apply button, and an **Apply** button appears at the top of the homepage.
- **To close:** switch it off and **Publish**. The Apply page shows the closed message, no dates appear, and the homepage Apply button disappears.

### Add an event
**Events → Upcoming → +**: name, **Generate** address, start and end date/time, location, image, description → Publish.
- Turn on **Featured** to show it large on the Events page.
- After it ends, it moves to **Past events** on its own.

### Upload photos
1. **Gallery (albums) → +**: album title, **Generate** address, date.
2. Drag many photos into **Photos** at once. You don't need to resize them.
3. Optionally tag the album's **Event**, so the photos also appear on that event page.
4. Click a photo to add a caption, the photographer's name, or turn on **Show first in the gallery**. Other photos appear in a shuffled order that changes whenever something is published (or hourly).
5. Publish.

### Add an award
**Awards → +**: award name, placement (e.g. *1st*), competition, year, location, **Team** (or **Project**, e.g. WorkCell) → Publish. It appears on the homepage and on that team's page.

The homepage shows the most recent awards (six on computers, four on phones) with a **Show all awards** button for the rest, so the section stays short as the list grows. Each award is labeled with its team's code, or the project's code (WorkCell is *MWC*, set in **Projects → WorkCell → Code**).

### Add or hide a sponsor
**Sponsors → Sponsors → +**: name, logo, **Category** (Corporate or Department Supporters), website → Publish.
- Logos are shown in their own colors. Use a PNG with a transparent background.
- Only if a logo is dark (e.g. black text) and would disappear on the dark website, also upload a white version in *White logo for dark backgrounds*. It is then used instead.
- To hide a sponsor temporarily, switch off **Show on website**.
- Drag sponsors in the list to change their order.

### The Sponsor page
vtcro.org/sponsor is the page to share with companies. Every word and figure on it is edited in **Sponsors → Sponsor page**, one tab per section:

| Tab | What it controls |
|---|---|
| **Top** | The big heading (put `*asterisks*` around a word for italics), the intro, and **Key figures**. The number of design teams, support teams and awards is counted automatically; add others here, e.g. *~$65K · Yearly spend* |
| **Talent** | Heading, text, the majors shown as tags, and figures such as acceptance rate and average GPA |
| **Events** | The events VT CRO hosts (CRO-Down, CRO Expo), each with a short description and its figures |
| **What sponsors get** | The benefits list |
| **Tiers** | Each tier's name, amount and benefits. Highest tier first; the first one is highlighted |
| **Closing & pitch deck** | The closing heading and text, and the **Pitch deck (PDF)** |

**Pitch deck:** upload the PDF in *Closing & pitch deck*. A "Pitch deck" download button then appears at the top and bottom of the page; with no file uploaded, there is no button.

The current sponsor logos near the bottom come from the Sponsors list. The "Become a sponsor" and email buttons use the sponsorship email in **Contact & social links** (or the general email if that's empty). Keep the figures current; update them at least once a year.

### Change the homepage
- **Top of page:** the background photo and the line under the logo. Sponsor logos show under the buttons, one column per sponsor category.
- **About & principles:** *Our mission*, *What we are*, *What we believe in*, and the Core Principles (name, short statement, icon).
- **Section order & headings:** drag sections to reorder them or switch any off, and choose a **Light** or **Dark** background for each.

### Icons
Anywhere you see an **Icon** dropdown (About, recruitment steps, sponsor reasons, other ways to get involved), pick from the built-in set: trophy, users, rocket, book, and so on.

### Change an email or social link
**Contact & social links** is the only place they're stored. **Contact form topics** controls where each kind of message is emailed.

### Link previews
When someone shares a vtcro.org link (iMessage, Discord, LinkedIn…), the preview shows the VT CRO logo. Team, event, album and member pages use their own photo when they have one. To use a different site-wide image, upload it in **Site settings → Default link-preview image**.

---

## Images: quick tips
- Use **large originals**; the site resizes and optimizes them automatically.
- Use the **crop/hotspot tool** (click the image, then the crop icon) to keep faces and robots in frame on every screen size.
- **Headshots**: a similar style for everyone looks best (same background, shoulders-up).
- **Team logos**: square PNG with a transparent background, or SVG.
