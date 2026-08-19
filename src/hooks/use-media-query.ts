"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query hook built on useSyncExternalStore rather than useEffect + setState.
 * The server snapshot is always `false`, so the first client render matches the
 * server HTML and React swaps to the real value without a hydration mismatch.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsTouch() {
  return useMediaQuery("(pointer: coarse)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}

const noopSubscribe = () => () => {};

/** True only after hydration. Useful for gating client-only UI without an effect. */
export function useIsHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
