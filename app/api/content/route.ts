import { NextResponse } from "next/server";

import { getContent, saveContent } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import type { Content } from "@/lib/content";

export const dynamic = "force-dynamic";

/** Public: read the site content. */
export async function GET() {
  try {
    return NextResponse.json(await getContent());
  } catch (err) {
    console.error("[api/content] read failed:", err);
    return NextResponse.json(
      { error: "Failed to read content" },
      { status: 500 },
    );
  }
}

/** Admin only: persist the site content (patch semantics — omitted sections stay intact). */
export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Partial<Content> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const saved = await saveContent(body);
    return NextResponse.json(saved);
  } catch (err) {
    console.error("[api/content] save failed:", err);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
