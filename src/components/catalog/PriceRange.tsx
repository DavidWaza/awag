'use client';

import { useState } from 'react';
import { formatNaira } from '@/lib/utils';

/**
 * Dual-thumb range that commits only on release (`onCommit`), so we navigate
 * once per drag rather than on every pixel.
 */
export function PriceRange({
  bounds,
  value,
  onCommit,
}: {
  bounds: { min: number; max: number };
  value: { min?: number; max?: number };
  onCommit: (min: number, max: number) => void;
}) {
  const [lo, setLo] = useState(value.min ?? bounds.min);
  const [hi, setHi] = useState(value.max ?? bounds.max);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-ink">
        <span>{formatNaira(lo)}</span>
        <span>{formatNaira(hi)}</span>
      </div>
      <input
        type="range"
        min={bounds.min}
        max={bounds.max}
        value={lo}
        onChange={(event) => setLo(Math.min(Number(event.target.value), hi))}
        onMouseUp={() => onCommit(lo, hi)}
        onTouchEnd={() => onCommit(lo, hi)}
        className="w-full accent-forest"
        aria-label="Minimum price"
      />
      <input
        type="range"
        min={bounds.min}
        max={bounds.max}
        value={hi}
        onChange={(event) => setHi(Math.max(Number(event.target.value), lo))}
        onMouseUp={() => onCommit(lo, hi)}
        onTouchEnd={() => onCommit(lo, hi)}
        className="w-full accent-forest"
        aria-label="Maximum price"
      />
    </div>
  );
}
