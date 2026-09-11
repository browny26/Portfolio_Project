import { useSyncExternalStore } from "react";

/**
 * One fact — "the intro is out of the way" — published by `Intro` and read by
 * everything whose entrance has to wait for it.
 *
 * It used to be a hard-coded delay repeated in every such component, which
 * silently went wrong the moment the intro was skipped or its length changed.
 * A module-level value rather than context because `Header` is rendered by the
 * layout and `Hero` by the page, so the two have no common provider below the
 * root — and because a late subscriber still needs the answer: anything that
 * mounts after the intro has finished reads `true` immediately instead of
 * waiting for an event that has already been sent.
 *
 * It resets on a full page load, which is exactly the lifetime of one intro.
 */

let done = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** On the server the intro has always still to run, so nothing animates early. */
function getServerSnapshot() {
  return false;
}

export function useIntroDone(): boolean {
  return useSyncExternalStore(subscribe, () => done, getServerSnapshot);
}
