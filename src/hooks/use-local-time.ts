"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Live clock for a given IANA timezone. Modelled as an external store — a shared
 * interval is the "subscription" — so no setState-in-effect and no hydration
 * mismatch (the server snapshot is null and the UI just omits the time).
 */

let listeners: (() => void)[] = [];
let timer: ReturnType<typeof setInterval> | null = null;
let tick = 0;

function subscribe(onChange: () => void) {
  listeners.push(onChange);
  if (!timer) {
    timer = setInterval(() => {
      tick += 1;
      for (const l of listeners) l();
    }, 10_000);
  }
  return () => {
    listeners = listeners.filter((l) => l !== onChange);
    if (listeners.length === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const cache = new Map<string, { tick: number; value: string }>();

export function useLocalTime(timeZone: string): string | null {
  const getSnapshot = useCallback(() => {
    const hit = cache.get(timeZone);
    if (hit && hit.tick === tick) return hit.value;
    const value = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
    }).format(new Date());
    cache.set(timeZone, { tick, value });
    return value;
  }, [timeZone]);

  const getServerSnapshot = useCallback(() => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
