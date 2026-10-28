'use client';

import { useSyncExternalStore } from 'react';

// Stable empty reference so getServerSnapshot returns the same value each call.
const EMPTY: readonly string[] = [];

/**
 * A minimal reactive list persisted to localStorage — enough for the cart and
 * wishlist without pulling in a state library. Hydration happens inside
 * `subscribe` (post-mount) so the server snapshot and first client render both
 * see an empty list, avoiding a hydration mismatch.
 */
export function createPersistedList(key: string) {
  let ids: readonly string[] = EMPTY;
  let hydrated = false;
  const listeners = new Set<() => void>();

  function getSnapshot(): readonly string[] {
    return ids;
  }

  function write(next: readonly string[]) {
    ids = next;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(ids));
      } catch {
        /* storage full or unavailable — keep the in-memory copy */
      }
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    if (!hydrated && typeof window !== 'undefined') {
      hydrated = true;
      try {
        const raw = window.localStorage.getItem(key);
        if (raw) ids = JSON.parse(raw) as string[];
      } catch {
        /* corrupt value — start empty */
      }
    }
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function useList(): readonly string[] {
    return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  }

  return {
    useList,
    read: getSnapshot,
    write,
  };
}
