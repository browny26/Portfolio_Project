import { useSyncExternalStore } from "react";

/**
 * One fact — "the page-transition curtain is not covering the screen" —
 * published by `PageTransition` and read by pages whose entrance would
 * otherwise play, unseen, behind it.
 *
 * Same shape as `introSignal`: a module-level value, so a page that mounts
 * while the curtain is still down reads `false` and waits, and a page loaded
 * directly (no curtain at all) reads `true` straight away.
 */

let open = true;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function closeCurtain() {
  if (!open) return;
  open = false;
  emit();
}

export function openCurtain() {
  if (open) return;
  open = true;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useCurtainOpen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => true,
  );
}
