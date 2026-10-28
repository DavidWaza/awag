import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely (last conflicting utility wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Naira, thousands-separated, no kobo — per Section 06 price-display spec.
 * Pass `showKobo: true` only for Club billing contexts that need it.
 */
export function formatNaira(amount: number, options?: { showKobo?: boolean }) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: options?.showKobo ? 2 : 0,
    maximumFractionDigits: options?.showKobo ? 2 : 0,
  }).format(amount);
}
