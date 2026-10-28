'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { Product } from '@/types/product';
import { Price } from '@/components/ui/Price';
import { Button } from '@/components/ui/Button';
import { ProductTagBadges } from '@/components/ui/Badge';
import { defaultSku } from '@/lib/catalog/sku';
import { flyToBag } from '@/lib/plp/flyToBag';
import { addToCart } from '@/lib/store/cart';
import { toggleWishlist } from '@/lib/store/wishlist';

export function SavedProductCard({ product }: { product: Product }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);
  const sku = defaultSku(product);
  const inStock = product.skus.some((s) => s.stock > 0);

  const onAdd = () => {
    addToCart(sku.id);
    flyToBag(imageRef.current);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="ag-card flex flex-col">
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="block">
          <div
            ref={imageRef}
            className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted"
          >
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
            )}
            <div className="absolute left-2 top-2">
              <ProductTagBadges tags={product.tags} />
            </div>
          </div>
        </Link>

        {/* Remove from saved */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label="Remove from saved items"
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-ink backdrop-blur-sm transition-colors hover:text-wine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          <X size={18} />
        </button>
      </div>

      <Link href={`/product/${product.slug}`} className="mt-3">
        <p className="text-sm text-ink">{product.name}</p>
      </Link>
      <Price
        amountNaira={sku.priceNaira}
        compareAtNaira={sku.compareAtPriceNaira}
        size="sm"
        className="mt-1"
      />

      <Button
        type="button"
        size="sm"
        onClick={onAdd}
        disabled={!inStock}
        className="mt-3 w-full"
      >
        {!inStock ? 'Out of stock' : added ? '✓ Added to bag' : 'Add to bag'}
      </Button>
    </div>
  );
}
