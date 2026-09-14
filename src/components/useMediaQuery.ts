import { useCallback, useSyncExternalStore } from "react";

/**
 * Whether a media query matches, kept in sync as it changes. On the server
 * (and during hydration) it reports `false`, so anything gated on it renders
 * the plain version first and upgrades on the client.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
