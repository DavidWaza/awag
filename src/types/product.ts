import type { CategorySlug } from '@/types/category';

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL' | string; // shoe/waist sizes are numeric strings

export type ProductTag = 'new' | 'sale' | 'club-exclusive' | 'partner-brand';

/** A single sellable variant — one size/colour combination (Appendix, SKU). */
export interface Sku {
  id: string;
  size: Size;
  colour: string;
  stock: number;
  priceNaira: number; // kobo-free; store as whole Naira, format at the edge
  compareAtPriceNaira?: number;
}

export interface MakerStory {
  makerName: string;
  location: string;
  narrative: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: CategorySlug;
  subCategorySlug: string;
  /** Null for house-line products; set for Partner Marketplace listings. */
  brandId: string | null;
  description: string;
  fabric?: string;
  images: string[];
  skus: Sku[];
  tags: ProductTag[];
  rating?: {
    average: number;
    count: number;
  };
  makerStory?: MakerStory;
  /** Product ids to surface in "Complete the Look" (PDP cross-sell). */
  completeTheLook?: string[];
}
