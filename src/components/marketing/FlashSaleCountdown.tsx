'use client';

import * as React from 'react';

const pad = (value: number) => value.toString().padStart(2, '0');

/**
 * Counts down to the end of the current day (local time). Renders nothing on
 * the server / first paint so the client-only clock can't cause a hydration
 * mismatch; it fills in on mount.
 */
export function FlashSaleCountdown() {
  const [remaining, setRemaining] = React.useState<string | null>(null);

  React.useEffect(() => {
    function tick() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      const seconds = Math.floor((diff % 60_000) / 1000);

      setRemaining(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="font-utility text-[11px] font-semibold uppercase tracking-utility text-ink/80">
        Ends in
      </span>
      <span
        className="font-utility text-lg font-bold tabular-nums text-gold"
        aria-live="off"
      >
        {remaining ?? '--:--:--'}
      </span>
    </div>
  );
}
