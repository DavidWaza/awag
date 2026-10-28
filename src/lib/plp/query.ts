import { MOCK_PRODUCTS } from '@/lib/data/products';
import { MOCK_BRANDS } from '@/lib/data/brands';
import type { Product } from '@/types/product';
import type { PlpQuery } from './searchParams';

export interface ColourFacet {
  slug: string;
  label: string;
  hex: string;
}

export interface Facets {
  sizes: string[];
  colours: ColourFacet[];
  brands: { slug: string; label: string }[];
  price: { min: number; max: number };
}

export interface PlpResult {
  items: Product[];
  total: number;
}

const HOUSE_SLUG = 'house';

// Indicative swatch hexes for the colours in the fixture data. A real catalogue
// would carry these on the SKU; kept here so swatches render meaningfully.
const COLOUR_HEX: Record<string, string> = {
  emerald: '#046307',
  black: '#111111',
  navy: '#1f2a44',
  amber: '#b45309',
  tan: '#c19a6b',
  burgundy: '#6b1e23',
  white: '#f4efe2',
};

const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, '-');

/** Lowest selling price across a product's SKUs — the "effective" price. */
function effectivePrice(product: Product): number {
  return product.skus.reduce(
    (lowest, sku) => Math.min(lowest, sku.priceNaira),
    Number.POSITIVE_INFINITY,
  );
}

function brandSlugOf(product: Product): string {
  if (!product.brandId) return HOUSE_SLUG;
  return MOCK_BRANDS.find((brand) => brand.id === product.brandId)?.slug ?? HOUSE_SLUG;
}

function brandLabelOf(slug: string): string {
  if (slug === HOUSE_SLUG) return 'Abuja Gentleman (House)';
  return MOCK_BRANDS.find((brand) => brand.slug === slug)?.name ?? slug;
}

function inScope(categorySlug: string, subCategorySlug?: string): Product[] {
  return MOCK_PRODUCTS.filter(
    (product) =>
      product.categorySlug === categorySlug &&
      (!subCategorySlug || product.subCategorySlug === subCategorySlug),
  );
}

/**
 * Facet options for a category (optionally narrowed to a sub-category), derived
 * from the products actually in scope — so we never offer a filter that would
 * return zero results.
 */
export function getFacets(categorySlug: string, subCategorySlug?: string): Facets {
  const products = inScope(categorySlug, subCategorySlug);

  const sizes = [...new Set(products.flatMap((p) => p.skus.map((s) => s.size)))];

  const colourMap = new Map<string, ColourFacet>();
  for (const product of products) {
    for (const sku of product.skus) {
      const slug = slugify(sku.colour);
      if (!colourMap.has(slug)) {
        colourMap.set(slug, {
          slug,
          label: sku.colour,
          hex: COLOUR_HEX[slug] ?? '#999999',
        });
      }
    }
  }

  const brandSlugs = [...new Set(products.map(brandSlugOf))];
  const brands = brandSlugs.map((slug) => ({ slug, label: brandLabelOf(slug) }));

  const prices = products.map(effectivePrice);
  const price =
    prices.length > 0
      ? { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) }
      : { min: 0, max: 0 };

  return { sizes, colours: [...colourMap.values()], brands, price };
}

const SORTERS: Record<PlpQuery['sort'], (a: Product, b: Product) => number> = {
  new: () => 0, // fixture order stands in for `created_at DESC`
  price_asc: (a, b) => effectivePrice(a) - effectivePrice(b),
  price_desc: (a, b) => effectivePrice(b) - effectivePrice(a),
  brand: (a, b) => brandLabelOf(brandSlugOf(a)).localeCompare(brandLabelOf(brandSlugOf(b))),
};

/**
 * Filter → sort → slice. Returns `total` (the filtered count, before the page
 * limit) so Load more knows whether more remain.
 */
export function getProducts(
  categorySlug: string,
  query: PlpQuery,
  options: { limit: number; subCategorySlug?: string },
): PlpResult {
  const filtered = inScope(categorySlug, options.subCategorySlug).filter((product) => {
    if (query.size.length && !product.skus.some((s) => query.size.includes(s.size))) {
      return false;
    }
    if (
      query.colour.length &&
      !product.skus.some((s) => query.colour.includes(slugify(s.colour)))
    ) {
      return false;
    }
    if (query.brand.length && !query.brand.includes(brandSlugOf(product))) {
      return false;
    }
    const price = effectivePrice(product);
    if (query.min !== undefined && price < query.min) return false;
    if (query.max !== undefined && price > query.max) return false;
    return true;
  });

  const sorted = [...filtered].sort(SORTERS[query.sort]);

  return { items: sorted.slice(0, options.limit), total: sorted.length };
}
