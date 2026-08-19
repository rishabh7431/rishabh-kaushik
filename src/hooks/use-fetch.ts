"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type State<T> = { data: T | null; error: Error | null; loading: boolean };

/**
 * Minimal fetch hook with abort handling, optional polling and manual refetch.
 * Keeps the dependency footprint down — we do not need a full data library for
 * three read-only endpoints.
 */
export default function useFetch<T>(
  url: string | null,
  options?: { refreshMs?: number; skip?: boolean },
) {
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: Boolean(url) });
  const controller = useRef<AbortController | null>(null);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    if (!url || options?.skip) return;
    controller.current?.abort();
    const ac = new AbortController();
    controller.current = ac;

    try {
      const res = await fetch(url, { signal: ac.signal });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      const json = (await res.json()) as T;
      if (mounted.current) setState({ data: json, error: null, loading: false });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      if (mounted.current) {
        setState((prev) => ({ data: prev.data, error: err as Error, loading: false }));
      }
    }
  }, [url, options?.skip]);

  useEffect(() => {
    mounted.current = true;
    void load();
    let id: ReturnType<typeof setInterval> | null = null;
    if (options?.refreshMs) id = setInterval(() => void load(), options.refreshMs);
    return () => {
      mounted.current = false;
      controller.current?.abort();
      if (id) clearInterval(id);
    };
  }, [load, options?.refreshMs]);

  return { ...state, refetch: load };
}
