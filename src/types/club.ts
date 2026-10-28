/** Section 08 — The Abuja Gentleman Club. */

export type ClubTier = 'essentials' | 'signature' | 'bespoke';

export interface ClubTierDefinition {
  tier: ClubTier;
  name: string;
  tagline: string;
  indicativePriceNaira: number;
  whatsInside: string[];
  /** The recommended, most-popular tier. */
  featured?: boolean;
}

/** A membership-wide perk, included with every tier. */
export interface ClubBenefit {
  title: string;
  description: string;
}

/** An à-la-carte service members can add, priced individually. */
export interface ClubAddon {
  name: string;
  description: string;
  priceNaira: number;
}

export interface ClubPreferenceProfile {
  size: string;
  scentPreference: string;
  skinType: string;
  stylePalette: string[];
}

export type ClubSubscriptionStatus = 'active' | 'paused' | 'cancelled';

export interface ClubSubscription {
  id: string;
  userId: string;
  tier: ClubTier;
  status: ClubSubscriptionStatus;
  preferences: ClubPreferenceProfile;
  nextBillingDate: string; // ISO date
  /** Set when this membership was purchased as a gift for someone else. */
  giftRecipientEmail?: string;
}
