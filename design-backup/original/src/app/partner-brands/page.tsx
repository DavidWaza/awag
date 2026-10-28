import Link from 'next/link';
import { getFeaturedBrands } from '@/lib/data/brands';
import { buttonVariants } from '@/components/ui/Button';

export const metadata = { title: 'Partner Brands' };

export default function PartnerBrandsPage() {
  const featured = getFeaturedBrands();

  return (
    <div className="container py-16">
      <p className="label-utility text-gold">Marketplace</p>
      <h1 className="mt-2 max-w-2xl font-display text-4xl font-bold text-ink">
        A stage for local makers.
      </h1>
      <p className="mt-4 max-w-xl text-ink/70">
        Vetted Abuja and Lagos brands, hosted on a revenue-share model — extending the
        catalogue without extending in-house production.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/partner-brands/apply-to-sell"
          className={buttonVariants({ size: 'lg' })}
        >
          Apply to Sell
        </Link>
      </div>

      <h2 className="mt-14 font-display text-2xl font-bold text-ink">
        Featured Storefronts
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {featured.map((brand) => (
          <Link
            key={brand.id}
            href={`/partner-brands/${brand.slug}`}
            className="rounded-md border border-border bg-white p-6 hover:border-forest"
          >
            <p className="font-display text-lg font-bold text-ink">{brand.name}</p>
            <p className="mt-1 text-sm text-ink/60">{brand.city}</p>
            <p className="mt-3 text-sm text-ink/80">{brand.story}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
