import { NextResponse } from "next/server";

import { getAdminPassword, isAuthenticated } from "@/lib/auth";
import { updateVercelEnvVar } from "@/lib/vercel-env";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Change the admin password.
 *
 * Verifies the current password, then updates ADMIN_PASSWORD. On Vercel this
 * writes to the project's environment variable via the Vercel REST API (using
 * a management token if provided), so the change persists across deployments.
 */
export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    currentPassword?: unknown;
    newPassword?: unknown;
  } | null;

  const currentPassword =
    typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword =
    typeof body?.newPassword === "string" ? body.newPassword : "";

  if (currentPassword !== getAdminPassword()) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 },
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 },
    );
  }

  const result = await updateVercelEnvVar("ADMIN_PASSWORD", newPassword);

  if (!result.ok) {
    console.error("[api/auth/password] failed:", result.error);
    return NextResponse.json(
      { error: result.error ?? "Failed to update password" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, persisted: result.persisted });
}
