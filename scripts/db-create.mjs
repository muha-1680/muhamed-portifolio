// One-off helper: create the 'portfolio' database if it doesn't exist.
// Uses @prisma/client's underlying engine via a raw connection.
import pg from "pg";
import { readFileSync } from "node:fs";

// parse DATABASE_URL from .env.local
const env = readFileSync(".env.local", "utf8");
const url = env.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!url) {
  console.error("DATABASE_URL not found in .env.local");
  process.exit(1);
}

const u = new URL(url);
const dbName = u.pathname.replace(/^\//, "");
u.pathname = "/postgres"; // connect to maintenance DB

const client = new pg.Client({ connectionString: u.toString() });
await client.connect();

const exists = await client.query(
  "SELECT 1 FROM pg_database WHERE datname = $1",
  [dbName],
);
if (exists.rowCount === 0) {
  await client.query(`CREATE DATABASE "${dbName}"`);
  console.log(`Created database: ${dbName}`);
} else {
  console.log(`Database already exists: ${dbName}`);
}

await client.end();
