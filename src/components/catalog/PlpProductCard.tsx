'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import type { Product } from '@/types/product';
import { Price } from '@/components/ui/Price';
import { ProductTagBadges } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { flyToBag } from '@/lib/plp/flyToBag';
import { defaultSku } from '@/lib/catalog/sku';
import { addToCart } from '@/lib/store/cart';
import { toggleWishlist, useIsWishlisted } from '@/lib/store/wishlist';

export function PlpProductCard({ product }: { product: Product }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);
  const liked = useIsWishlisted(product.id);
  const sku = defaultSku(product);

  const onLike = (event: React.MouseEvent) => {
    event.preventDefault();
    toggleWishlist(product.id);
  };

  const onAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    addToCart(sku.id);
    flyToBag(imageRef.current);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Link href={`/product/${product.slug}`} className="ag-card group block">
      <div
        ref={imageRef}
        className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted"
      >
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        )}

        <div className="absolute left-2 top-2">
          <ProductTagBadges tags={product.tags} />
        </div>

        {/* LIKE — always tappable on touch; fades in on hover on pointer devices */}
        <button
          type="button"
          onClick={onLike}
          aria-pressed={liked}
          aria-label={liked ? 'Remove from saved items' : 'Save item'}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-black/60 opacity-100 backdrop-blur-sm transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest md:opacity-0 md:group-hover:opacity-100"
        >
          <Heart
            size={18}
            className={cn('ag-heart', liked ? 'is-liked fill-wine text-wine' : 'text-ink')}
          />
        </button>

        {/* ADD TO BAG — slides up from the bottom on hover */}
        <button
          type="button"
          onClick={onAdd}
          aria-label="Add to bag"
          className="absolute inset-x-0 bottom-0 flex h-11 translate-y-full items-center justify-center gap-2 bg-forest font-utility text-xs font-semibold uppercase tracking-utility text-ivory transition-transform focus-visible:translate-y-0 group-hover:translate-y-0"
        >
          {added ? <span className="ag-check">✓ Added</span> : 'Add to bag'}
        </button>
      </div>

      <p className="mt-3 text-sm text-ink">{product.name}</p>
      <Price
        amountNaira={sku.priceNaira}
        compareAtNaira={sku.compareAtPriceNaira}
        size="sm"
      />
    </Link>
  );
}
