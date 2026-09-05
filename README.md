# Muhamed Ahmed · Portfolio

Personal portfolio built with **Next.js (App Router) + TypeScript**. Rebuilt from
the original static HTML site with the same visual design, plus a working
admin panel with server-side authentication and persistent content storage.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Plain CSS (ported 1:1 from the original site; no UI framework)
- Font Awesome via CDN
- Content persisted to `data/content.json` through API routes

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev                  # http://localhost:3000
```

Required env vars (see `.env.example`):

| Variable        | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `ADMIN_PASSWORD`| Password for `/admin` (change the default!)        |
| `AUTH_SECRET`   | Secret that signs the admin session cookie         |

Generate a secret with:
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint

## Pages

| Route      | Description                                              |
| ---------- | -------------------------------------------------------- |
| `/`        | Landing / welcome                                        |
| `/about`   | About (name, title, bio, location from content store)    |
| `/experience` | Experience entries (managed in admin)                 |
| `/projects`| Project cards (managed in admin)                         |
| `/skills`  | Categorized skill list (static)                          |
| `/cv`      | Resume summary + PDF download                            |
| `/contact` | Contact cards (email/phone/socials from content store)   |
| `/admin`   | Login-protected content editor                           |

## Admin panel

`/admin` logs in with `ADMIN_PASSWORD` (server-side check; the password never
lives in client code). A signed, httpOnly session cookie is set on login.
Edits to about, contact, skills, colors, projects, and experience are written
to `data/content.json` via `PUT /api/content` (auth required) and are picked up
by the public pages on their next load. The **Colors** section updates the
site-wide `--primary` / `--bg` CSS variables, so choosing a new theme color
restyles the whole public site.

## Notes

- **Storage is a JSON file**, so the app needs a persistent server (local
  machine, VPS, Railway, Fly, etc.). On read-only serverless hosts (Vercel,
  Netlify) admin edits will not persist. Storage is isolated in
  `lib/content.ts`, so swapping in a database is a one-file change.
- The original HTML pages are preserved under `legacy/` for reference.
- The categorized **Skills** page content is static (the admin "Skills" field
  edits a flat list that is stored and previewed in the admin panel).