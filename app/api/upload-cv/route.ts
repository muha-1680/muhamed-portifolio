import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 },
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "PDF must be under 10 MB" },
        { status: 400 },
      );
    }

    const pathname = `/cv-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const blob = await put(pathname, file, {
      access: "public",
    });

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to upload CV PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
