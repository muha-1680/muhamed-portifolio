import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getContent, saveContent, type Content } from "@/lib/content";

export const dynamic = "force-dynamic";

/** Public: read the site content. */
export async function GET() {
  return NextResponse.json(await getContent());
}

/** Admin only: persist the site content. */
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
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}