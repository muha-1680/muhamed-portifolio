import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const DEV_SECRET = "dev-insecure-auth-secret-change-me";

/** Admin password from env, with a dev-only fallback + warning. */
export function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password === "admin123") {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[auth] ADMIN_PASSWORD is not set (or still the default) — using 'admin123'. Set ADMIN_PASSWORD in .env.local.",
      );
    }
  }
  return password || "admin123";
}

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret && process.env.NODE_ENV !== "production") {
    console.warn(
      "[auth] AUTH_SECRET is not set — using an insecure dev fallback. Set AUTH_SECRET in .env.local.",
    );
  }
  return secret || DEV_SECRET;
}

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_TTL_MS }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token: string): boolean {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length) return false;
  try {
    if (!timingSafeEqual(expected, actual)) return false;
  } catch {
    return false;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: unknown;
    };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

/** True when the request carries a valid admin session cookie. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : false;
}

/** Set the signed session cookie (after a successful login). */
export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

/** Clear the session cookie. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}