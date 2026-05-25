# Tradition XI

Companion PWA for **Tradition XI** — the annual golf trip, Colorado Springs, **Aug 6–9, 2026**. One installable page: a countdown, the format and schedule, the courses, the 6v6 teams, a live scoreboard, the caddy poll, a quote wall, and a poster gallery.

## Stack

- **Next.js 16** (App Router) + **React 19**
- Hand-written CSS with design tokens in `app/globals.css` — **no Tailwind utilities / shadcn** (Tailwind v4 is present only for its reset)
- `next/image`, `next/font` (DM Serif Display + Hanken Grotesk)
- PWA: web app manifest, icons in `public/`, service worker registered via `components/sw-register`
- Icons: `lucide-react`

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

## Where things live

- **Static content** — schedule, courses, roster/teams, the "Up for Debate" list, toasts: `lib/data.ts`. Edit copy here, not in component markup.
- **Live shared state** — scoreboard scores, quote wall, caddy votes: seeded in `lib/store.ts` and served by the API routes under `app/api/` (`scores`, `quotes`, `caddy-vote`). On Vercel this persists in `/tmp` per warm instance; swap `STATE_FILE` for Vercel KV / Redis for durability.
- **Sections** (`components/`, composed in `app/page.tsx`): Hero → Schedule → Courses → Roster → Caddy Poll → Up for Debate → Scoreboard → Quote Wall → Gallery.
- **Design system** — CSS custom properties (`--emerald-900`, `--gold`, `--paper`, …) and semantic classes in `app/globals.css`.

## Deploy

Hosted on **Vercel**. Push to `main` → production deploy; feature branches get preview URLs.

> Heads up: this repo runs a newer Next.js than most tooling expects — see [`AGENTS.md`](./AGENTS.md) before writing code.
