'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/constants/categories';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category';
import { UtilityBar } from './UtilityBar';

// ASOS-style shopping-context switch. Abuja Gentleman launches menswear-first;
// the Women tab is scaffolded for when that catalogue goes live.
const GENDERS = [
  { slug: 'men', label: 'Men' },
  { slug: 'women', label: 'Women' },
] as const;

const ACTIVE_GENDER: (typeof GENDERS)[number]['slug'] = 'men';

// Evergreen shortcuts every mega-menu carries, ASOS-style. They point at the
// category landing for now; wire to filtered PLP views once searchParams
// facets exist.
const POPULAR_LINKS = ['New In', 'Best Sellers', 'Sale', 'New Season'];

export function Header() {
  const pathname = usePathname();
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // Soft navigations keep focus on the clicked mega-menu link, so CSS
  // :focus-within would leave the panel open. Clear it on every route change.
  useEffect(() => {
    setOpenSlug(null);
  }, [pathname]);

  return (
    // overflow-x-clip contains the mega-menu's edges without clipping its
    // vertical drop (clip on one axis leaves the other visible), so a panel
    // can never introduce a horizontal scrollbar.
    <header className="sticky top-0 z-40 overflow-x-clip border-b border-border bg-ivory">
      <UtilityBar />

      {/* Gender tabs — top-level MEN / WOMEN switch */}
      <div className="border-b border-border">
        <div className="container flex items-center gap-6">
          {GENDERS.map((gender) => {
            const isActive = gender.slug === ACTIVE_GENDER;
            return (
              <Link
                key={gender.slug}
                href={`/${gender.slug}`}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex h-10 items-center font-utility text-xs font-semibold uppercase tracking-utility transition-colors',
                  isActive ? 'text-forest' : 'text-ink/50 hover:text-forest',
                )}
              >
                {gender.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-forest" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logo + primary category nav */}
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="shrink-0 font-display text-lg font-bold text-forest"
        >
          Abuja Gentleman
        </Link>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-4 xl:gap-6">
            {CATEGORIES.map((category) => {
              const isOpen = openSlug === category.slug;
              return (
                // No `relative` here: the mega-menu resolves against the sticky
                // <header> instead, letting it span the full viewport width.
                <li
                  key={category.slug}
                  className="static"
                  onMouseEnter={() => setOpenSlug(category.slug)}
                  onMouseLeave={() => setOpenSlug(null)}
                  onFocusCapture={() => setOpenSlug(category.slug)}
                  onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                      setOpenSlug(null);
                    }
                  }}
                >
                  <Link
                    href={`/${category.slug}`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    className="flex h-16 items-center whitespace-nowrap font-utility text-[11px] font-semibold uppercase tracking-utility text-ink/80 hover:text-forest"
                  >
                    {category.name}
                  </Link>
                  <MegaMenu category={category} open={isOpen} />
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

/**
 * Full-width dropdown panel shown on category hover/focus. Positioned against
 * the sticky header (`left-0 right-0 top-full`) so the coloured band runs edge
 * to edge, while the inner `container` keeps the columns aligned with the rest
 * of the site — the ASOS mega-menu pattern.
 */
function MegaMenu({ category, open }: { category: Category; open: boolean }) {
  return (
    <div
      className={cn(
        'absolute left-0 right-0 top-full z-40 border-b border-border bg-surface shadow-xl shadow-black/50 transition-opacity duration-150',
        open
          ? 'visible opacity-100'
          : 'invisible pointer-events-none opacity-0',
      )}
    >
      <div className="container grid grid-cols-4 gap-8 py-8">
        {/* Shop by sub-category */}
        <div>
          <p className="font-utility text-xs font-semibold uppercase tracking-utility text-ink/50">
            Shop {category.name}
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {category.subCategories.map((sub) => (
              <li key={sub.slug}>
                <Link
                  href={`/${category.slug}/${sub.slug}`}
                  className="text-sm text-ink/80 hover:text-forest hover:underline"
                >
                  {sub.name}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <Link
                href={`/${category.slug}`}
                className="text-sm font-semibold text-forest hover:underline"
              >
                View all {category.name} →
              </Link>
            </li>
          </ul>
        </div>

        {/* Evergreen shortcuts */}
        <div>
          <p className="font-utility text-xs font-semibold uppercase tracking-utility text-ink/50">
            Popular
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {POPULAR_LINKS.map((label) => (
              <li key={label}>
                <Link
                  href={`/${category.slug}`}
                  className="text-sm text-ink/80 hover:text-forest hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Promo tile */}
        <Link
          href={`/${category.slug}`}
          className="group/tile relative col-span-2 flex min-h-[220px] items-end overflow-hidden rounded-md bg-muted"
        >
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover/tile:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"
          />
          <div className="relative p-6">
            <p className="font-display text-xl font-bold text-ink">
              Explore {category.name}
            </p>
            <span className="mt-3 inline-block rounded bg-ivory px-4 py-2 font-utility text-[11px] font-semibold uppercase tracking-utility text-forest">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
