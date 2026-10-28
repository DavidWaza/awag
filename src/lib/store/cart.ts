'use client';

import { useSyncExternalStore } from 'react';
import type { Measurements } from '@/lib/catalog/measurements';

export interface CartLineItem {
  /** SKU id + a measurement signature, so custom and standard lines stay apart. */
  id: string;
  skuId: string;
  qty: number;
  measurements?: Measurements;
}

const KEY = 'ag-cart';
const EMPTY: readonly CartLineItem[] = [];

let lines: readonly CartLineItem[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed)) {
      lines = parsed.filter(
        (line): line is CartLineItem =>
          !!line &&
          typeof line === 'object' &&
          typeof line.skuId === 'string' &&
          typeof line.qty === 'number',
      );
    }
  } catch {
    /* corrupt / legacy value — start empty */
  }
}

function commit(next: readonly CartLineItem[]) {
  lines = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable — keep the in-memory copy */
    }
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const signature = (measurements?: Measurements) =>
  measurements ? JSON.stringify(measurements) : 'std';

export function useCart(): readonly CartLineItem[] {
  return useSyncExternalStore(subscribe, () => lines, () => EMPTY);
}

/** Reactive count for the header bag badge. */
export function useCartCount(): number {
  return useCart().reduce((sum, line) => sum + line.qty, 0);
}

/**
 * Add one unit of a SKU, optionally with a measurements snapshot. Same SKU +
 * same measurements merges into one line; a different measurement set (or
 * standard vs made-to-measure) becomes its own line.
 */
export function addToCart(skuId: string, measurements?: Measurements): void {
  hydrate();
  const id = `${skuId}#${signature(measurements)}`;
  const existing = lines.find((line) => line.id === id);
  if (existing) {
    commit(lines.map((line) => (line.id === id ? { ...line, qty: line.qty + 1 } : line)));
  } else {
    commit([...lines, { id, skuId, qty: 1, measurements }]);
  }
}

export function incrementLine(id: string): void {
  hydrate();
  commit(lines.map((line) => (line.id === id ? { ...line, qty: line.qty + 1 } : line)));
}

export function decrementLine(id: string): void {
  hydrate();
  commit(
    lines
      .map((line) => (line.id === id ? { ...line, qty: line.qty - 1 } : line))
      .filter((line) => line.qty > 0),
  );
}

export function removeLine(id: string): void {
  hydrate();
  commit(lines.filter((line) => line.id !== id));
}
