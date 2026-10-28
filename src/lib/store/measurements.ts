'use client';

import { useSyncExternalStore } from 'react';
import type { Measurements } from '@/lib/catalog/measurements';

// The gentleman's reusable measurement profile — one set, reused across
// garments (a real tailoring service keeps this on file).
const KEY = 'ag-measurements';

let current: Measurements | null = null;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) current = JSON.parse(raw) as Measurements;
  } catch {
    /* corrupt profile — start empty */
  }
}

function getSnapshot(): Measurements | null {
  return current;
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Reactive profile (null until saved). Safe against hydration mismatch. */
export function useMeasurements(): Measurements | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

/** Imperative read for event handlers (hydrates on demand). */
export function readMeasurements(): Measurements | null {
  hydrate();
  return current;
}

export function saveMeasurements(measurements: Measurements): void {
  current = measurements;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(measurements));
    } catch {
      /* storage unavailable — keep the in-memory copy */
    }
  }
  listeners.forEach((listener) => listener());
}
