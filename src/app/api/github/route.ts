import { NextResponse } from "next/server";
import { getGithubPayload } from "@/lib/github";

// Rendered per request, not at build time.
//
// With `revalidate` alone Next prerenders this route during the build, so the
// payload is whatever the *build container* could reach from GitHub — and that
// result is frozen into the deployment. A build that was rate-limited ships a
// page of zeros, and no amount of fixing the token afterwards changes it until
// something triggers a revalidation. Caching still happens, just at the edge:
// the Cache-Control header below gives the CDN the same 30 minutes, so GitHub
// is not hit per visitor.
export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getGithubPayload();
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
  });
}
