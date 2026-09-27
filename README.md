# vtcro.org

Website for the **Competitive Robotics Organization at Virginia Tech (VT CRO)**.

- **Site:** Next.js (App Router), TypeScript, hand-written CSS design system
- **CMS:** Sanity, embedded at `/studio`
- **Hosting:** Vercel

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

Until the Sanity project is connected, the site renders the built-in sample content in `seed/documents.ts`.

| Doc | For |
|---|---|
| [docs/MANAGER_GUIDE.md](docs/MANAGER_GUIDE.md) | The website manager: how to update everything in the CMS |
| [docs/SETUP.md](docs/SETUP.md) | Developers/admins: accounts, Sanity, deploy, DNS, webhook, backups, code map |
| [docs/PROPOSAL.md](docs/PROPOSAL.md) | Original proposal and the decisions log |
