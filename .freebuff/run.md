# Run doc — Muhamed-Ahmed-Portfolio (Next.js 16 + Prisma/Postgres)

## Reproduce artifacts (fresh checkout)
1. `npm install` (Prisma is pinned to 5.22 — latest major stalls on slow networks)
2. Copy `.env.local` from the main checkout (contains `ADMIN_PASSWORD`, `AUTH_SECRET`, commented `BLOB_READ_WRITE_TOKEN`; `DATABASE_URL` points at the local Postgres below)
3. `npx prisma generate`

## Local Postgres (no Docker needed)
Binaries: `node_modules/@embedded-postgres/windows-x64/native/bin`
- Data dir: `.freebuff/pgdata` (already initdb'd, user `postgres`/`postgres`, db `portfolio`)
- Start (PowerShell, detached — pg_ctl hangs Git Bash console handles but does start):
  `powershell -NoProfile -Command "(Start-Process -FilePath '<abs>\node_modules\@embedded-postgres\windows-x64\native\bin\pg_ctl.exe' -ArgumentList '-D','\"<abs>\.freebuff\pgdata\"','-l','\"<abs>\.freebuff\pglog\pg.log\"','start' -WindowStyle Hidden -PassThru).Id"`
  Wait ~8s, confirm: `netstat -ano | grep 5432`
- NOTE: Postgres 18 Windows does NOT support `shared_memory_type = mmap` — leave the default (`windows`). The earlier crash loop (`error 487`) was from an interrupted npm install corrupting binaries, not from shm type.
- Migrate + seed (Prisma CLI doesn't read .env.local; export inline):
  `DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/portfolio?schema=public" npx prisma migrate deploy`
  `DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/portfolio?schema=public" node prisma/seed.mjs`
- DB creation helper (`scripts/db-create.mjs`) requires `pg` which is not installed; use `echo "CREATE DATABASE portfolio;" | npx prisma db execute --url "postgresql://postgres:postgres@127.0.0.1:5432/postgres" --stdin`

## Run dev server
Detached (PowerShell):
`powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -WorkingDirectory '<abs>' -RedirectStandardOutput '<abs>\.freebuff\preview-d53c0575-634d-4b57-a1a8-3875f978168f.log' -RedirectStandardError '<abs>\.freebuff\preview.log.err' -WindowStyle Hidden -PassThru).Id"`
(The Start-Process call itself may time out the shell but the server still starts — check the log for "Local: http://localhost:PORT". Port is auto-picked; this run used **52146**.)
Public site falls back to seeded defaults if the DB is down (30s circuit breaker in `lib/db.ts`); admin saves need the DB reachable.

## Current preview state
- URL: http://localhost:52146 (Next dev PID — see `.freebuff/preview-d53c0575-634d-4b57-a1a8-3875f978168f.log`)
- Postgres: 127.0.0.1:5432, db `portfolio`, migrated + seeded, log at `.freebuff/pglog/pg.log`
- Admin round-trip verified live: login → PUT /api/contact → row changed in Postgres → GET reflects it.
