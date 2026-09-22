# Muhamed Ahmed · Portfolio

Personal portfolio built with **Next.js 16 (App Router) + TypeScript + Prisma + Postgres**. Rebuilt from
the original static HTML site with the same visual design, plus a working
admin panel with server-side authentication and database-backed content storage.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- **Prisma ORM + Postgres** — all site content lives in the database
- Vercel Blob — file uploads only (profile photo, CV PDF); the DB stores the URLs
- Plain CSS (ported 1:1 from the original site; no UI framework)
- Font Awesome via CDN

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npx prisma migrate deploy    # create tables
npm run db:seed              # load starter content from data/content.json
npm run dev                  # http://localhost:3000
```

Required env vars (see `.env.example`):

| Variable                | Purpose                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| `ADMIN_PASSWORD`        | Password for `/admin` (change the default!)                             |
| `AUTH_SECRET`           | Secret that signs the admin session cookie                              |
| `DATABASE_URL`          | **Required.** Postgres connection string (Vercel Postgres pooled URL)   |
| `BLOB_READ_WRITE_TOKEN` | Only for file uploads (photo, CV PDF). Content lives in Postgres.       |

Generate a secret with:
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Database

All content sections are Postgres tables managed by Prisma:

- Single-row sections: `About`, `Contact`, `ColorTheme`, `Cv`
- List sections: `projects`, `experiences`, `skills`, `cv_stats`, `cv_education`, `cv_languages`

Common commands:

```bash
npx prisma migrate deploy   # apply migrations (production + local)
npm run db:seed             # (re)load starter content from data/content.json
npm run db:studio           # browse/edit data in Prisma Studio
npx prisma generate         # regenerate the client after schema changes
```

## Admin panel

- URL: `http://localhost:3000/admin`
- Password: value of `ADMIN_PASSWORD`
- Every Save button writes straight to Postgres — public pages read the DB on
  every request (`force-dynamic`), so changes appear immediately
- Photo and CV PDF uploads go to Vercel Blob; the returned URL is saved into
  the DB automatically as part of the upload request

## Deploying to Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Create the database: Project → **Storage → Postgres** → create/connect a store.
   Vercel exposes `DATABASE_URL` automatically (pooled connection).
4. Add these Environment Variables in Vercel project settings:
   - `ADMIN_PASSWORD`
   - `AUTH_SECRET`
   - `BLOB_READ_WRITE_TOKEN` (from Vercel Dashboard → Storage → Blob) — only needed for uploads
   - `DATABASE_URL` — usually auto-injected by the Postgres integration
5. Deploy, then run the migration + seed once against the production DB:
   ```bash
   # from your machine, with the production DATABASE_URL exported:
   npx prisma migrate deploy
   npm run db:seed
   ```
   (Or add `prisma migrate deploy && npm run db:seed` to the build command.)

The site will be available at `https://muhamed-ahmed-portfolio.vercel.app`

## Note on file uploads

Profile photo and CV PDF uploads use Vercel Blob and require
`BLOB_READ_WRITE_TOKEN` in the environment. Text content no longer depends on
Blob at all — it lives entirely in Postgres via Prisma.
