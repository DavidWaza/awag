'use client';

import { useSyncExternalStore } from 'react';
import type { ClubSubscription } from '@/types/club';

// Simulated membership record, persisted client-side. Swap for a real
// subscription + billing service (Section 08) before launch.
const KEY = 'ag-club-membership';

let current: ClubSubscription | null = null;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) current = JSON.parse(raw) as ClubSubscription;
  } catch {
    /* corrupt record — start empty */
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Reactive membership (null when not a member). */
export function useMembership(): ClubSubscription | null {
  return useSyncExternalStore(subscribe, () => current, () => null);
}

export function joinClub(subscription: ClubSubscription): void {
  current = subscription;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(subscription));
    } catch {
      /* storage unavailable — keep the in-memory copy */
    }
  }
  notify();
}

export function cancelMembership(): void {
  current = null;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }
  notify();
}
