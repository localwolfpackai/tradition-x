<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Tradition XI — project notes

Single-page companion app for the Tradition XI golf trip (Next.js 16 App Router, React 19). Sections live in `components/` and are composed in `app/page.tsx`.

- **Copy / content** is data-driven in `lib/data.ts` (schedule, courses, roster + teams, the "Up for Debate" list, toasts). Change copy there, not in component markup.
- **Live state** (scoreboard, quote wall, caddy poll) is seeded in `lib/store.ts` and served by `app/api/{scores,quotes,caddy-vote}`. Persistence is auto-detected: if Upstash Redis env vars (`UPSTASH_REDIS_REST_URL`+`UPSTASH_REDIS_REST_TOKEN`, or Vercel KV's `KV_REST_API_URL`+`KV_REST_API_TOKEN`) are set on the project, state goes there. Otherwise it falls back to `/tmp` — **not durable in production** (every cold start wipes it). **To enable durable storage in prod:** create a free Upstash Redis (upstash.com), drop the two REST env vars into the Vercel project, redeploy. No code change required.
- **Styling** is hand-written CSS in `app/globals.css`: semantic classes (`.score-row`, `.bet-grid`) plus design tokens (`--emerald-900`, `--gold`, `--paper`). No Tailwind utilities or shadcn — match the existing tokens and classes, don't introduce a second styling system.
- **Deploy**: push to `main` for production on Vercel; branches get previews. **Deploy policy:** small, low-risk changes (copy, styling, content, docs, minor UI) may be committed and pushed straight to `main` and reported. Preview on a branch and confirm with the user first for anything riskier — API/data-model changes, dependency bumps, structural refactors, or anything that could break live behavior.
