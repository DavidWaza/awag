/**
 * Mirrors the site's information architecture (Section 03 of the platform
 * documentation) — seven top-level destinations, each with sub-categories.
 */

export type CategorySlug =
  | 'native-wears'
  | 'english-wears'
  | 'shoes-and-sandals'
  | 'perfumery'
  | 'socks-and-essentials'
  | 'partner-brands'
  | 'the-club';

export interface SubCategory {
  slug: string;
  name: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  /** True for the two non-catalogue destinations (Partner Brands, The Club). */
  isProgramme: boolean;
  /** Tile/hero imagery for the category. Temporary CDN host until launch. */
  image: string;
  subCategories: SubCategory[];
}
