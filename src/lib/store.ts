/**
 * Storage for the per-page view counter.
 *
 * Three adapters, resolved at call time:
 *
 *  1. Upstash Redis (REST)  — set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
 *     Correct choice for serverless deploys where the filesystem is ephemeral.
 *  2. SQLite (node:sqlite)  — used automatically when the filesystem is writable.
 *     Zero dependencies, no native build step. Requires Node 22.5+.
 *  3. In-memory             — last resort so the UI never breaks in a read-only
 *     sandbox or on an older Node.
 */

import path from "node:path";

export type Adapter = "redis" | "sqlite" | "memory";

const VIEW_KEY = (p: string) => `views:${p}`;

/* ────────────────────────────── memory ─────────────────────────────── */

const memoryViews = new Map<string, number>();

/* ────────────────────────────── redis ──────────────────────────────── */

function redisConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function redis(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (json.error) throw new Error(json.error);
  return json.result;
}

/* ────────────────────────────── sqlite ─────────────────────────────── */

type SqliteDb = {
  exec(sql: string): void;
  prepare(sql: string): {
    all(...params: unknown[]): unknown[];
    get(...params: unknown[]): unknown;
    run(...params: unknown[]): unknown;
  };
};

let sqliteDb: SqliteDb | null | undefined;
let sqliteInit: Promise<SqliteDb | null> | null = null;

async function getSqlite(): Promise<SqliteDb | null> {
  if (sqliteDb !== undefined) return sqliteDb;
  if (sqliteInit) return sqliteInit;

  sqliteInit = (async () => {
    if (process.env.DISABLE_SQLITE === "1") return null;
    try {
      // Dynamic import so the module never enters an edge or client bundle, and
      // so a runtime without node:sqlite (Node < 22.5) degrades instead of crashing.
      const mod = (await import("node:sqlite")) as unknown as {
        DatabaseSync: new (loc: string) => SqliteDb;
      };
      const fs = await import("node:fs");

      const file = process.env.SQLITE_PATH || path.join(process.cwd(), "data", "site.db");
      fs.mkdirSync(path.dirname(file), { recursive: true });

      const db = new mod.DatabaseSync(file);
      db.exec(`
        CREATE TABLE IF NOT EXISTS views (
          path TEXT PRIMARY KEY,
          count INTEGER NOT NULL DEFAULT 0
        );
      `);
      return db;
    } catch {
      return null;
    }
  })();

  sqliteDb = await sqliteInit;
  return sqliteDb;
}

/* ───────────────────────────── public API ──────────────────────────── */

export async function bumpView(pathname: string): Promise<{ count: number; adapter: Adapter }> {
  if (redisConfigured()) {
    try {
      const n = (await redis(["INCR", VIEW_KEY(pathname)])) as number;
      return { count: Number(n) || 1, adapter: "redis" };
    } catch {
      /* fall through */
    }
  }

  const db = await getSqlite();
  if (db) {
    try {
      db.prepare(
        "INSERT INTO views (path,count) VALUES (?,1) ON CONFLICT(path) DO UPDATE SET count = count + 1",
      ).run(pathname);
      const row = db.prepare("SELECT count FROM views WHERE path = ?").get(pathname) as
        | { count: number }
        | undefined;
      return { count: Number(row?.count ?? 1), adapter: "sqlite" };
    } catch {
      /* fall through */
    }
  }

  const next = (memoryViews.get(pathname) ?? 0) + 1;
  memoryViews.set(pathname, next);
  return { count: next, adapter: "memory" };
}

export async function getView(pathname: string): Promise<number> {
  if (redisConfigured()) {
    try {
      const n = (await redis(["GET", VIEW_KEY(pathname)])) as string | null;
      return Number(n ?? 0) || 0;
    } catch {
      /* fall through */
    }
  }
  const db = await getSqlite();
  if (db) {
    try {
      const row = db.prepare("SELECT count FROM views WHERE path = ?").get(pathname) as
        | { count: number }
        | undefined;
      return Number(row?.count ?? 0);
    } catch {
      /* fall through */
    }
  }
  return memoryViews.get(pathname) ?? 0;
}
