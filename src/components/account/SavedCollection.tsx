'use client';

import Link from 'next/link';
import { getProductsByIds } from '@/lib/data/products';
import { useWishlistIds } from '@/lib/store/wishlist';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { SavedProductCard } from './SavedProductCard';

export function SavedCollection() {
  const ids = useWishlistIds();
  // Most recently saved first.
  const products = getProductsByIds([...ids].reverse());

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="label-utility text-gold">Your Collection</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Saved items
          </h1>
        </div>
        {products.length > 0 && (
          <span className="text-sm text-ink/60">{products.length} items</span>
        )}
      </div>

      {products.length === 0 ? (
        <div className="mt-12 border border-gold/20 bg-surface px-6 py-16 text-center">
          <p className="font-display text-xl text-ink">Nothing saved yet.</p>
          <p className="mt-2 text-sm text-ink/60">
            Tap the heart on any product to keep it here.
          </p>
          <Link href="/native-wears" className={cn(buttonVariants({ size: 'lg' }), 'mt-6')}>
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <SavedProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
