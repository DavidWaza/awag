import type { Product, Sku } from '@/types/product';

/**
 * Dev-only fixture data so components and pages render without a database.
 * Replace with real fetches (e.g. `getProducts()` backed by Prisma/a CMS)
 * before launch — nothing in `src/components` or `src/app` should import
 * this file directly outside of `src/app/**\/page.tsx` seams marked TODO.
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_agbada_emerald',
    slug: 'emerald-agbada-set',
    name: 'Emerald Agbada Set — House Line',
    categorySlug: 'native-wears',
    subCategorySlug: 'agbada',
    brandId: null,
    description:
      'Hand-finished collar, breathable cotton, tailored fit for the Nigerian climate.',
    fabric: 'Cotton blend',
    images: [
      '/agbada.jpg',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    ],
    skus: [
      { id: 'sku_1', size: 'M', colour: 'Emerald', stock: 6, priceNaira: 85_000 },
      { id: 'sku_2', size: 'L', colour: 'Emerald', stock: 4, priceNaira: 85_000 },
    ],
    tags: ['new'],
    makerStory: {
      makerName: 'Adamu & Sons Tailoring',
      location: 'Kaduna',
      narrative:
        'Crafted in Kaduna, cut in Abuja — three generations of native wear tailoring.',
    },
    rating: { average: 4.7, count: 128 },
  },
  {
    id: 'prod_oxford_shoe',
    slug: 'corporate-oxford-shoe',
    name: 'Corporate Oxford Shoe',
    categorySlug: 'shoes-and-sandals',
    subCategorySlug: 'corporate-shoes',
    brandId: null,
    description: 'Full-grain leather Oxford, built for long office days.',
    images: ['/oxford-shoe.jpg'],
    skus: [
      {
        id: 'sku_3',
        size: '43',
        colour: 'Black',
        stock: 10,
        priceNaira: 46_000,
        compareAtPriceNaira: 60_000,
      },
    ],
    tags: ['sale'],
    rating: { average: 4.4, count: 52 },
  },
  {
    id: 'prod_navy_kaftan',
    slug: 'navy-senator-kaftan',
    name: 'Navy Senator Kaftan',
    categorySlug: 'native-wears',
    subCategorySlug: 'kaftan-and-senator',
    brandId: null,
    description: 'Clean-lined senator cut in a lightweight, wrinkle-resistant weave.',
    fabric: 'Cashmere blend',
    images: ['/navy-kaftan.jpg'],
    skus: [
      {
        id: 'sku_4',
        size: 'L',
        colour: 'Navy',
        stock: 8,
        priceNaira: 38_000,
        compareAtPriceNaira: 55_000,
      },
    ],
    tags: ['sale'],
    rating: { average: 4.6, count: 74 },
  },
  {
    id: 'prod_royal_oud',
    slug: 'royal-oud-cologne',
    name: 'Royal Oud Cologne — 100ml',
    categorySlug: 'perfumery',
    subCategorySlug: 'colognes',
    brandId: null,
    description: 'Warm oud and amber base with a bright citrus opening. Long-wearing.',
    images: ['/oud.jpg'],
    skus: [
      {
        id: 'sku_5',
        size: '100ml',
        colour: 'Amber',
        stock: 15,
        priceNaira: 22_000,
        compareAtPriceNaira: 32_000,
      },
    ],
    tags: ['sale'],
    rating: { average: 4.8, count: 210 },
  },
  {
    id: 'prod_suede_loafers',
    slug: 'suede-tassel-loafers',
    name: 'Suede Tassel Loafers',
    categorySlug: 'shoes-and-sandals',
    subCategorySlug: 'loafers-and-sneakers',
    brandId: 'brand_sahel_leatherworks',
    description: 'Hand-stitched suede loafers with a cushioned leather footbed.',
    images: ['/loafers.jpg'],
    skus: [
      {
        id: 'sku_6',
        size: '43',
        colour: 'Tan',
        stock: 5,
        priceNaira: 34_000,
        compareAtPriceNaira: 52_000,
      },
    ],
    tags: ['sale', 'partner-brand'],
    rating: { average: 4.5, count: 39 },
  },
  {
    id: 'prod_silk_tie_set',
    slug: 'silk-tie-and-pocket-square-set',
    name: 'Silk Tie & Pocket Square Set',
    categorySlug: 'socks-and-essentials',
    subCategorySlug: 'ties-and-bowties',
    brandId: null,
    description: 'Woven silk tie with a matching pocket square, gift-boxed.',
    images: ['/pocket--square.jpg'],
    skus: [
      {
        id: 'sku_7',
        size: 'One size',
        colour: 'Burgundy',
        stock: 20,
        priceNaira: 9_000,
        compareAtPriceNaira: 15_000,
      },
    ],
    tags: ['sale'],
    rating: { average: 4.3, count: 61 },
  },
];

export function getFeaturedProducts(): Product[] {
  return MOCK_PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((product) => product.slug === slug);
}

/** Resolve a list of product ids to products, preserving the given order. */
export function getProductsByIds(ids: readonly string[]): Product[] {
  return ids
    .map((id) => MOCK_PRODUCTS.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
}

export interface SkuLocation {
  product: Product;
  sku: Sku;
}

/** Find the product + variant for a SKU id (used to render cart lines). */
export function findSkuById(skuId: string): SkuLocation | undefined {
  for (const product of MOCK_PRODUCTS) {
    const sku = product.skus.find((candidate) => candidate.id === skuId);
    if (sku) return { product, sku };
  }
  return undefined;
}

export function getProductsByCategory(
  categorySlug: string,
  subCategorySlug?: string,
): Product[] {
  return MOCK_PRODUCTS.filter(
    (product) =>
      product.categorySlug === categorySlug &&
      (!subCategorySlug || product.subCategorySlug === subCategorySlug),
  );
}

/** First variant that's marked down (compare-at above the selling price). */
function discountedSku(product: Product): Sku | undefined {
  return product.skus.find(
    (sku) =>
      typeof sku.compareAtPriceNaira === 'number' &&
      sku.compareAtPriceNaira > sku.priceNaira,
  );
}

/** Whole-number percent off, or 0 when the product isn't discounted. */
export function getDiscountPercent(product: Product): number {
  const sku = discountedSku(product);
  if (!sku?.compareAtPriceNaira) return 0;
  return Math.round(
    ((sku.compareAtPriceNaira - sku.priceNaira) / sku.compareAtPriceNaira) * 100,
  );
}

/** Everything currently on sale — powers the homepage Flash Sales rail. */
export function getFlashSaleProducts(): Product[] {
  return MOCK_PRODUCTS.filter((product) => product.tags.includes('sale'));
}

/** Discounted products, deepest markdown first — the Biggest Deals rail. */
export function getBiggestDeals(): Product[] {
  return MOCK_PRODUCTS.filter((product) => getDiscountPercent(product) > 0).sort(
    (a, b) => getDiscountPercent(b) - getDiscountPercent(a),
  );
}
