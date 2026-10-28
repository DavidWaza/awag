import type { Product, Sku } from '@/types/product';

/** Cheapest in-stock variant, falling back to the cheapest overall. */
export function defaultSku(product: Product): Sku {
  const inStock = product.skus.filter((sku) => sku.stock > 0);
  const pool = inStock.length ? inStock : product.skus;
  return pool.reduce((lowest, sku) =>
    sku.priceNaira < lowest.priceNaira ? sku : lowest,
  );
}
