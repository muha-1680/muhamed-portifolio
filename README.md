# Muhamed Ahmed · Portfolio

Personal portfolio built with **Next.js 16 (App Router) + TypeScript**. Rebuilt from
the original static HTML site with the same visual design, plus a working
admin panel with server-side authentication and persistent content storage.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Plain CSS (ported 1:1 from the original site; no UI framework)
- Font Awesome via CDN
- Content persisted to **Vercel Blob** (falls back to `data/content.json` locally when no blob token is configured)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev                  # http://localhost:3000
```

Required env vars (see `.env.example`):

| Variable               | Purpose                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `ADMIN_PASSWORD`       | Password for `/admin` (change the default!)                       |
| `AUTH_SECRET`          | Secret that signs the admin session cookie                        |
| `BLOB_READ_WRITE_TOKEN`| **Required on Vercel** for admin saves AND file uploads (photo, CV PDF). Get it from Vercel Dashboard → Project → Storage → Blob → "Generate API key". |

Generate a secret with:
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Local development without a blob token

If `BLOB_READ_WRITE_TOKEN` is not set, the app falls back to reading/writing
`data/content.json` on disk. This is fine for local development — the admin
panel works fully. On Vercel, the token is required (serverless functions
can't write to disk).

## Admin panel

- URL: `http://localhost:3000/admin`
- Default password: `admin123` (change `ADMIN_PASSWORD` in `.env.local`)
- Edits persist to Vercel Blob on production, or to `data/content.json` locally

## Deploying to Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add these Environment Variables in Vercel project settings:
   - `ADMIN_PASSWORD`
   - `AUTH_SECRET`
   - `BLOB_READ_WRITE_TOKEN` (from Vercel Dashboard → Storage → Blob)
4. Deploy

The site will be available at `https://muhamed-ahmed-portfolio.vercel.app`

## Note on file uploads

Profile photo and CV PDF uploads use Vercel Blob. They require
`BLOB_READ_WRITE_TOKEN` to be set in the Vercel project environment variables.
Without it, the upload buttons will show an error, but text edits via the admin
panel still work (they also use the blob store).
