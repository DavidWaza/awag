'use client';

import { createPersistedList } from './persisted';

const store = createPersistedList('ag-wishlist');

/** Reactive: is this product saved? */
export function useIsWishlisted(id: string): boolean {
  return store.useList().includes(id);
}

/** Reactive list of saved product ids, in the order they were added. */
export function useWishlistIds(): readonly string[] {
  return store.useList();
}

/** Optimistic toggle — the `.is-liked` class drives the heart pop. */
export function toggleWishlist(id: string): void {
  const ids = store.read();
  store.write(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
}
