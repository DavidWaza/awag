import type { Product } from '@/types/product';
import { PlpProductCard } from './PlpProductCard';

/** 3-across desktop → 2 tablet → 1 mobile, per the design system. */
export function PlpProductGrid({ products }: { products: Product[] }) {
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
        <PlpProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
