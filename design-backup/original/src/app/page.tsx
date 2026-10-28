import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/constants/categories';
import {
  getBiggestDeals,
  getFeaturedProducts,
  getFlashSaleProducts,
} from '@/lib/data/products';
import { getAllBrands } from '@/lib/data/brands';
import { ProductGrid } from '@/components/product/ProductGrid';
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup';
import { FlashSaleCountdown } from '@/components/marketing/FlashSaleCountdown';
import { HeroSlider, type HeroSlide } from '@/components/marketing/HeroSlider';
import { CategorySlider } from '@/components/marketing/CategorySlider';

// Rotating campaign slides for the hero. Swap the images for the seasonal
// shoot on the CDN when it lands; the first slide keeps the house campaign.
const HERO_SLIDES: HeroSlide[] = [
  {
    image: '/kaduna-threads.jpg',
    alt: 'Nigerian gentleman in tailored native wear',
    label: 'Seasonal Campaign',
    title: 'One wardrobe. Friday and Monday, both covered.',
    ctaLabel: 'Shop Native Wears',
    ctaHref: '/native-wears',
  },
  {
    image: '/english-cat.jpg',
    alt: 'Man in a sharp tailored suit',
    label: 'English Wears',
    title: 'Sharp tailoring for the boardroom.',
    ctaLabel: 'Shop English Wears',
    ctaHref: '/english-wears',
  },
  {
    image: '/pefume.jpg',
    alt: 'Heritage native wear detail',
    label: 'Heritage, Reimagined',
    title: 'Native wear, made for the moment.',
    ctaLabel: 'Explore the Edit',
    ctaHref: '/native-wears',
  },
];

export default function HomePage() {
  const shopCategories = CATEGORIES.filter((category) => !category.isProgramme);
  const newIn = getFeaturedProducts();
  const brands = getAllBrands();
  const flashSales = getFlashSaleProducts();
  const biggestDeals = getBiggestDeals();

  return (
    <>
      {/* Hero — rotating campaign slider, Section 04 */}
      <HeroSlider slides={HERO_SLIDES} />

      {/* Shop by category slider */}
      <CategorySlider categories={shopCategories} />

      {/* Shop by Brand */}
      <section className="container py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-ink">Shop by Brand</h2>
          <Link
            href="/partner-brands"
            className="label-utility text-forest hover:underline"
          >
            All brands
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/partner-brands/${brand.slug}`}
              className="group flex flex-col overflow-hidden rounded-md border border-border bg-white transition-colors hover:border-forest"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="font-display text-sm font-bold text-ink">{brand.name}</p>
                <p className="text-xs text-ink/50">{brand.city}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New In rail */}
      <section className="container py-16">
        <h2 className="font-display text-2xl font-bold text-ink">New In</h2>
        <div className="mt-6">
          <ProductGrid products={newIn} />
        </div>
      </section>

      {/* Flash Sales — bespoke members' preview band */}
      <section className="container py-16">
        <div className="relative overflow-hidden rounded-lg border border-gold/30 bg-gradient-to-r from-ink via-forest to-ink px-8 py-8 text-ivory shadow-xl">
          {/* Gold hairline along the top edge — a tailoring detail. */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
          />
          {/* Soft gilt glow in the corner. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-2xl"
          />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="label-utility text-gold">
                The Gentleman&apos;s Sale · By Invitation
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Flash Sales
              </h2>
              <p className="mt-2 max-w-md text-sm text-ivory/60">
                A short, curated markdown on our finest pieces — while they last.
              </p>
            </div>
            <div className="rounded-md border border-gold/40 bg-ink/40 px-5 py-3">
              <FlashSaleCountdown />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <ProductGrid products={flashSales} />
        </div>
      </section>

      {/* Biggest Deals — sorted by deepest markdown */}
      <section className="container py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="label-utility text-gold">Best Value</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink">
              Biggest Deals
            </h2>
          </div>
        </div>
        <div className="mt-6">
          <ProductGrid products={biggestDeals} />
        </div>
      </section>

      {/* Subscribe for exclusive deals */}
      <section className="bg-forest text-ivory">
        <div className="container flex flex-col items-start gap-6 py-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <p className="label-utility text-gold">Members Only</p>
            <h2 className="mt-2 font-display text-3xl font-bold">
              Get exclusive deals before anyone else.
            </h2>
            <p className="mt-3 text-ivory/70">
              Early access to drops, subscriber-only prices, and a first look at each
              month&apos;s Club box.
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </section>

      {/* Club + Partner spotlight bands */}
      <section className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
        <Link href="/the-club" className="bg-gold p-10 text-ink hover:bg-gold/90">
          <p className="label-utility">Shop The Club</p>
          <p className="mt-2 font-display text-xl font-bold">This month's box preview</p>
        </Link>
        <Link
          href="/partner-brands"
          className="bg-forest p-10 text-ivory hover:bg-forest/90"
        >
          <p className="label-utility text-gold">Partner Spotlight</p>
          <p className="mt-2 font-display text-xl font-bold">
            Featured Abuja & Lagos brand
          </p>
        </Link>
      </section>
    </>
  );
}
