import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductBySlug } from '@/lib/data/products';
import { Price } from '@/components/ui/Price';
import { ProductTagBadges } from '@/components/ui/Badge';
import { ProductBuyBox } from '@/components/product/ProductBuyBox';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const referencePrice = product.skus[0];

  return (
    <div className="container grid grid-cols-1 gap-10 py-10 lg:grid-cols-2 lg:gap-14">
      {/* Gallery */}
      <div className="grid grid-cols-2 gap-2">
        {product.images.map((image) => (
          <div
            key={image}
            className="relative aspect-[3/4] overflow-hidden rounded-md border border-border/60 bg-muted"
          >
            <Image src={image} alt={product.name} fill className="object-cover" />
          </div>
        ))}
      </div>

      {/* Buy-box — sticky relative to gallery on scroll (Section 05) */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ProductTagBadges tags={product.tags} />
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {product.name}
        </h1>
        {referencePrice && (
          <Price
            amountNaira={referencePrice.priceNaira}
            compareAtNaira={referencePrice.compareAtPriceNaira}
            size="lg"
            className="mt-3"
          />
        )}

        <ProductBuyBox product={product} />

        <div className="mt-10 border-t border-gold/20 pt-6 text-sm text-ink/80">
          <p className="label-utility text-gold">Details & Fabric</p>
          <p className="mt-3">{product.description}</p>
          {product.fabric && (
            <p className="mt-2 text-ink/60">Fabric: {product.fabric}</p>
          )}
        </div>

        {product.makerStory && (
          <div className="mt-6 border-t border-gold/20 pt-6 text-sm text-ink/80">
            <p className="label-utility text-gold">Maker Story</p>
            <p className="mt-3 font-display italic text-ink">
              {product.makerStory.makerName} — {product.makerStory.location}
            </p>
            <p className="mt-2">{product.makerStory.narrative}</p>
          </div>
        )}
      </div>
    </div>
  );
}
