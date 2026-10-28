/**
 * Design tokens — single source of truth for brand colour & type.
 *
 * These values are the canonical hex references (Section 06 of the Abuja
 * Gentleman platform documentation). They are duplicated as CSS custom
 * properties in `src/app/globals.css` so Tailwind utilities, inline styles,
 * and non-DOM contexts (emails, PDFs, native apps) all read from the same
 * palette. If a colour changes, update BOTH this file and globals.css —
 * `pnpm run lint` will not catch a mismatch, so treat this file as the spec.
 *
 * Do not hardcode hex values in components. Import from here, or use the
 * matching Tailwind utility (e.g. `bg-forest`, `text-gold`).
 */

export const colors = {
  forest: '#1B4332', // primary — nav, buttons, primary actions
  gold: '#C89B3C', // accents, dividers, "new"/highlight state
  wine: '#6B1E23', // price emphasis, sale, destructive/alert state
  ivory: '#F4EFE2', // section backgrounds
  ink: '#211D1B', // body text
} as const;

export type ColorToken = keyof typeof colors;

/**
 * Semantic aliases. Components should reach for these, not raw palette
 * names, so a future rebrand only means remapping this block.
 */
export const semanticColors = {
  background: colors.ivory,
  foreground: colors.ink,
  primary: colors.forest,
  accent: colors.gold,
  destructive: colors.wine,
  border: '#DAD3C2',
  muted: '#E7E1D2',
} as const;

export const typography = {
  fonts: {
    // Display — headings, product names. Set with restraint; a serif with
    // real editorial weight (matches the platform's tailoring-house voice).
    display: 'var(--font-display)',
    // Body — descriptions, UI copy.
    body: 'var(--font-body)',
    // Utility — labels, price, all-caps micro-copy (ADD TO BAG, NEW IN).
    utility: 'var(--font-utility)',
  },
  trackingUtility: '0.08em',
} as const;

/** Accessibility floor (Section 06). Enforce, don't just document. */
export const a11y = {
  minBodyFontPx: 14,
} as const;
