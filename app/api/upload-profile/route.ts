import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File too large (max 5MB)" },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (!["jpg", "jpeg", "png", "webp"].includes(ext)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, and WebP are allowed" },
      { status: 400 },
    );
  }

  try {
    const blob = await put(
      `profile-${Date.now()}.${ext}`,
      file,
      {
        access: "public",
        contentType: file.type || `image/${ext === "jpeg" ? "jpeg" : ext}`,
      },
    );
    return NextResponse.json({
      ok: true,
      url: blob.url,
      name: blob.pathname,
    });
  } catch (err) {
    console.error("Blob upload failed:", err);
    return NextResponse.json(
      { error: "Upload failed — check VERCEL_BLOB_* env vars" },
      { status: 500 },
    );
  }
}