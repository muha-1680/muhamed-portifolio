import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to upload CV PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
