import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedBrands } from '@/lib/data/brands';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Partner Brands' };

export default function PartnerBrandsPage() {
  const featured = getFeaturedBrands();

  return (
    <>
      <section className="relative overflow-hidden border-b border-gold/20 bg-gradient-to-b from-black via-surface to-black">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
        />
        <div className="container relative py-16 md:py-20">
          <p className="label-utility text-gold">Marketplace</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            A stage for local makers.
          </h1>
          <p className="mt-5 max-w-xl text-ink/65">
            Vetted Abuja and Lagos brands, hosted on a revenue-share model — extending the
            catalogue without extending in-house production.
          </p>
          <div className="mt-8">
            <Link
              href="/partner-brands/apply-to-sell"
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Apply to Sell
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <p className="label-utility text-gold">Curated</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">
          Featured Storefronts
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {featured.map((brand) => (
            <Link
              key={brand.id}
              href={`/partner-brands/${brand.slug}`}
              className="group flex flex-col overflow-hidden rounded-md border border-border bg-surface transition-colors hover:border-gold/40"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="font-display text-lg font-bold text-ink">{brand.name}</p>
                <p className="mt-0.5 text-xs uppercase tracking-utility text-gold/80">
                  {brand.city}
                </p>
                <p className="mt-3 flex-1 text-sm text-ink/65">{brand.story}</p>
                <span className="label-utility mt-4 text-forest transition-colors group-hover:text-gold">
                  Visit storefront
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
