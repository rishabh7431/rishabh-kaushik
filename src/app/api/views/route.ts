import { NextResponse } from "next/server";
import { z } from "zod";
import { bumpView, getView } from "@/lib/store";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const Schema = z.object({ path: z.string().min(1).max(160) });

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "views"), 60, 60_000);
  if (!limit.ok) return NextResponse.json({ count: null }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid path" }, { status: 422 });

  const { count, adapter } = await bumpView(parsed.data.path);
  return NextResponse.json({ count, storage: adapter });
}

export async function GET(req: Request) {
  const pathname = new URL(req.url).searchParams.get("path") ?? "/";
  return NextResponse.json({ count: await getView(pathname) });
}
