import type { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

/**
 * "Grid defaults to 3-across on desktop, 2-across on tablet, 1-across on
 * mobile with filters moving into a bottom-sheet." — Section 04.
 */
export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-ink/60">
        No products match these filters yet — try widening your selection.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
