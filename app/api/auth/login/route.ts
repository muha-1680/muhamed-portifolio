import { NextResponse } from "next/server";
import { createSession, getAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";

  if (password === getAdminPassword()) {
    await createSession();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 });
}