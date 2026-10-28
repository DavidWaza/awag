import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { ProductTagBadges } from '@/components/ui/Badge';
import { Price } from '@/components/ui/Price';

export function ProductCard({ product }: { product: Product }) {
  const lowestSku: Product['skus'][number] | undefined = product.skus.reduce<
    Product['skus'][number] | undefined
  >(
    (lowest, sku) => (!lowest || sku.priceNaira < lowest.priceNaira ? sku : lowest),
    undefined,
  );
  const inStock = product.skus.some((sku) => sku.stock > 0);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute left-2 top-2">
          <ProductTagBadges tags={product.tags} />
        </div>
        {!inStock && (
          <div className="absolute inset-x-2 bottom-2">
            <span className="label-utility inline-block rounded-sm bg-ink/80 px-2 py-1 text-ivory">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-display text-sm text-ink">{product.name}</h3>
        {lowestSku && (
          <Price
            amountNaira={lowestSku.priceNaira}
            compareAtNaira={lowestSku.compareAtPriceNaira}
            size="sm"
          />
        )}
      </div>
    </Link>
  );
}
