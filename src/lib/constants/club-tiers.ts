import type { ClubAddon, ClubBenefit, ClubTierDefinition } from '@/types/club';

/**
 * Indicative pricing per Section 08 — flagged in the source doc as
 * "commercial team to confirm." Treat as a default, not a hardcoded price;
 * swap for a CMS/DB read before launch.
 */
export const CLUB_TIERS: ClubTierDefinition[] = [
  {
    tier: 'essentials',
    name: 'Essentials',
    tagline: 'The monthly upkeep box.',
    indicativePriceNaira: 12_000,
    whatsInside: ['Socks', 'One grooming item', 'One skincare essential'],
  },
  {
    tier: 'signature',
    name: 'Signature',
    tagline: 'Our most popular membership.',
    indicativePriceNaira: 22_000,
    featured: true,
    whatsInside: [
      'Everything in Essentials',
      'A tie or pocket square',
      'A premium grooming item',
      'Members-only pricing on the store',
    ],
  },
  {
    tier: 'bespoke',
    name: 'Bespoke',
    tagline: 'The full concierge experience.',
    indicativePriceNaira: 40_000,
    whatsInside: [
      'Everything in Signature',
      'A rotating native-wear accessory',
      'Early access to new drops',
      'One styling session each quarter',
    ],
  },
];

/** Perks that come with any membership. */
export const CLUB_BENEFITS: ClubBenefit[] = [
  {
    title: 'Free nationwide delivery',
    description: 'Every box and every store order ships to your door at no cost.',
  },
  {
    title: 'Members-only pricing',
    description: 'A standing discount on the full catalogue, not just the box.',
  },
  {
    title: 'Early access to drops',
    description: 'Shop new native and English collections before general release.',
  },
  {
    title: 'Skip, pause or cancel anytime',
    description: 'No minimum commitment — manage your box month to month.',
  },
];

/** À-la-carte services members can add, priced individually. */
export const CLUB_ADDONS: ClubAddon[] = [
  {
    name: 'Personal styling session',
    description: 'A one-on-one video consult with an Abuja Gentleman stylist.',
    priceNaira: 15_000,
  },
  {
    name: 'Express made-to-measure',
    description: 'Your next tailored piece cut and finished within 72 hours.',
    priceNaira: 20_000,
  },
  {
    name: 'Home fitting visit',
    description: 'A tailor comes to you for measurements (Abuja only).',
    priceNaira: 10_000,
  },
  {
    name: 'Luxury gift wrapping',
    description: 'Hand-wrapped box with a personalised note for any order.',
    priceNaira: 3_500,
  },
];
