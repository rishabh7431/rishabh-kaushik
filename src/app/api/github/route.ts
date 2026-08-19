import { NextResponse } from "next/server";
import { getGithubPayload } from "@/lib/github";

export const revalidate = 1800;

export async function GET() {
  const payload = await getGithubPayload();
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
  });
}
