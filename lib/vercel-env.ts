/**
 * Updates a project environment variable through the Vercel REST API.
 *
 * Requires VERCEL_TOKEN (a Vercel management token) plus the project scope
 * vars VERCEL_ORG_ID / VERCEL_PROJECT_ID (both present in .vercel/project.json
 * and injected automatically into Vercel deployments as VERCEL_ORG_ID and
 * VERCEL_PROJECT_ID).
 *
 * If VERCEL_TOKEN is not configured, returns ok:true with persisted:false so
 * the password change is acknowledged but clearly reported as non-persistent.
 */

interface VercelProjectConfig {
  orgId?: string;
  projectId?: string;
}

interface UpdateResult {
  ok: boolean;
  persisted: boolean;
  error?: string;
}

const API_BASE = "https://api.vercel.com";

function getProjectConfig(): VercelProjectConfig {
  return {
    orgId: process.env.VERCEL_ORG_ID,
    projectId: process.env.VERCEL_PROJECT_ID,
  };
}

export async function updateVercelEnvVar(
  name: string,
  value: string,
): Promise<UpdateResult> {
  const token = process.env.VERCEL_TOKEN;
  const { orgId, projectId } = getProjectConfig();

  if (!token || !projectId || !orgId) {
    return {
      ok: true,
      persisted: false,
      error:
        "VERCEL_TOKEN is not configured — the password change cannot be persisted. Add VERCEL_TOKEN, VERCEL_ORG_ID and VERCEL_PROJECT_ID to the project environment variables.",
    };
  }

  const base = `${API_BASE}/v10/projects/${projectId}/env?teamId=${orgId}&upsert=true`;

  try {
    // v10 upsert: POST creates the var or replaces all existing targets in one call.
    // (PATCH against a sensitive var 404s because its value is unreadable.)
    const res = await fetch(base, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: name,
        value,
        type: "encrypted",
        target: ["production", "preview", "development"],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        persisted: false,
        error: `Vercel API error ${res.status}: ${text.slice(0, 300)}`,
      };
    }

    return { ok: true, persisted: true };
  } catch (err) {
    return {
      ok: false,
      persisted: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}
