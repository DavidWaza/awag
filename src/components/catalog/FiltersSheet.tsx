'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { Facets } from '@/lib/plp/query';
import { FilterGroups } from './FilterGroups';

/**
 * Mobile filters. A button next to Sort opens a bottom-sheet with the same
 * FilterGroups; selections apply live underneath, and "Show results" dismisses.
 */
export function FiltersSheet({ facets }: { facets: Facets }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 items-center gap-2 rounded border border-border px-3 font-utility text-xs font-semibold uppercase tracking-utility text-ink"
      >
        <SlidersHorizontal size={16} />
        Filters
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70"
          />
          <div className="relative max-h-[85vh] overflow-y-auto rounded-t-lg border-t border-gold/30 bg-surface p-6 animate-in slide-in-from-bottom duration-300">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">Filters</h2>
              <button type="button" aria-label="Close filters" onClick={() => setOpen(false)}>
                <X size={20} className="text-ink" />
              </button>
            </div>
            <FilterGroups facets={facets} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-8 h-11 w-full rounded bg-forest font-utility text-xs font-semibold uppercase tracking-utility text-ivory"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
