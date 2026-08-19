"use client";

import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import { Counter } from "@/components/ui/counter";

/** Increments and displays the view count for a path. Fails silently if storage is unavailable. */
export function ViewCounter({ path }: { path: string }) {
  const [count, setCount] = useState<number | null>(null);
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path }),
        });
        if (!res.ok) return;
        const json = (await res.json()) as { count: number | null };
        if (!cancelled && typeof json.count === "number") setCount(json.count);
      } catch {
        /* view counting is best-effort */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [path]);

  if (count === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-dim">
      <Eye className="size-3" />
      <Counter to={count} /> views
    </span>
  );
}
