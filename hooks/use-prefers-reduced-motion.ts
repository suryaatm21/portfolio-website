"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function readPrefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}

/**
 * Tracks the user's `prefers-reduced-motion` setting.
 *
 * By default it starts as `false` so the first client render matches the
 * server-rendered HTML, then updates after mount and whenever the setting
 * changes. Components that never server-render (for example ones loaded with
 * `next/dynamic` and `ssr: false`) can pass `clientOnly: true` to read the
 * setting on their first render instead.
 */
export function usePrefersReducedMotion({
  clientOnly = false,
}: { clientOnly?: boolean } = {}): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    clientOnly ? readPrefersReducedMotion() : false,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
