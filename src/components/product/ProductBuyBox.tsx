'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import type { Product } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { addToCart } from '@/lib/store/cart';
import { toggleWishlist, useIsWishlisted } from '@/lib/store/wishlist';
import { useMeasurements } from '@/lib/store/measurements';
import { MeasurementCustomizer } from './MeasurementCustomizer';

const TAILORABLE_CATEGORIES = ['native-wears', 'english-wears'];

export function ProductBuyBox({ product }: { product: Product }) {
  const sizes = [...new Set(product.skus.map((sku) => sku.size))];
  const firstInStock = sizes.find((size) =>
    product.skus.some((sku) => sku.size === size && sku.stock > 0),
  );

  const [size, setSize] = React.useState<string | undefined>(firstInStock);
  const [added, setAdded] = React.useState(false);
  const saved = useIsWishlisted(product.id);
  const profile = useMeasurements();

  const tailorable = TAILORABLE_CATEGORIES.includes(product.categorySlug);
  const measurements = tailorable ? (profile ?? undefined) : undefined;

  const selectedSku =
    product.skus.find((sku) => sku.size === size && sku.stock > 0) ??
    product.skus.find((sku) => sku.size === size);

  const onAdd = () => {
    if (!selectedSku) return;
    addToCart(selectedSku.id, measurements);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <>
      <fieldset className="mt-6">
        <legend className="label-utility text-ink/60">Size</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((option) => {
            const inStock = product.skus.some(
              (sku) => sku.size === option && sku.stock > 0,
            );
            const active = option === size;
            return (
              <button
                key={option}
                type="button"
                disabled={!inStock}
                onClick={() => setSize(option)}
                aria-pressed={active}
                className={cn(
                  'h-11 min-w-11 rounded border px-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                  active
                    ? 'border-forest bg-forest text-ivory'
                    : 'border-ink/20 hover:border-forest',
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-col gap-3">
        <Button size="lg" onClick={onAdd} disabled={!selectedSku}>
          {added ? (
            <>
              <Check size={16} />
              Added to bag
            </>
          ) : (
            'Add to Bag'
          )}
        </Button>
        <Button variant="secondary" size="lg" onClick={() => toggleWishlist(product.id)}>
          {saved ? 'Saved ✓' : 'Add to Saved Items'}
        </Button>

        {tailorable && <MeasurementCustomizer productName={product.name} />}
      </div>

      {measurements && (
        <p className="mt-3 text-xs text-forest">
          ✓ Your saved measurements ({measurements.fit} fit) will be attached to this
          item.
        </p>
      )}

      {added && (
        <p className="mt-2 text-xs text-ink/60">
          Added to your bag.{' '}
          <Link href="/bag" className="font-medium text-forest underline">
            View bag
          </Link>
        </p>
      )}
    </>
  );
}
