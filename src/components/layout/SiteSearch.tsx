'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { MOCK_BRANDS } from '@/lib/data/brands';
import { CATEGORIES } from '@/lib/constants/categories';
import { Price } from '@/components/ui/Price';
import { defaultSku } from '@/lib/catalog/sku';
import { cn } from '@/lib/utils';

const POPULAR = ['Agbada', 'Kaftan', 'Oxford', 'Oud', 'Loafers', 'Tie'];
const MAX_PRODUCTS = 8;
const MAX_BRANDS = 6;

export function SiteSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus on open, Escape to close, and lock body scroll while open.
  React.useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const q = query.trim().toLowerCase();

  const products = q
    ? MOCK_PRODUCTS.filter((product) =>
        [
          product.name,
          product.description,
          product.fabric ?? '',
          product.categorySlug,
          product.subCategorySlug,
          product.tags.join(' '),
        ]
          .join(' ')
          .toLowerCase()
          .includes(q),
      ).slice(0, MAX_PRODUCTS)
    : [];

  const brands = q
    ? MOCK_BRANDS.filter((brand) =>
        `${brand.name} ${brand.story} ${brand.city}`.toLowerCase().includes(q),
      ).slice(0, MAX_BRANDS)
    : [];

  const hasResults = products.length > 0 || brands.length > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="transition-opacity hover:opacity-70"
      >
        <Search size={16} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-ivory duration-150 animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          {/* Full-width search bar */}
          <div className="border-b border-border bg-surface">
            <div className="container flex items-center gap-4 py-4">
              <Search size={22} className="shrink-0 text-ink/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for an item or a brand"
                aria-label="Search for an item or a brand"
                className="h-10 flex-1 bg-transparent font-display text-lg text-ink outline-none placeholder:text-ink/30"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="text-ink transition-colors hover:text-forest"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Results / suggestions */}
          <div className="flex-1 overflow-y-auto">
            <div className="container py-8">
              {!q ? (
                <Suggestions onPick={setQuery} onNavigate={close} />
              ) : !hasResults ? (
                <p className="text-ink/60">
                  No matches for “{query}”. Try a different term.
                </p>
              ) : (
                <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
                  <section>
                    <p className="label-utility text-ink/50">Products</p>
                    {products.length > 0 ? (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {products.map((product) => {
                          const sku = defaultSku(product);
                          return (
                            <Link
                              key={product.id}
                              href={`/product/${product.slug}`}
                              onClick={close}
                              className="group flex gap-3"
                            >
                              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-muted">
                                {product.images[0] && (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="text-sm text-ink group-hover:text-forest">
                                  {product.name}
                                </p>
                                <Price
                                  amountNaira={sku.priceNaira}
                                  compareAtNaira={sku.compareAtPriceNaira}
                                  size="sm"
                                  className="mt-1"
                                />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-ink/50">No products found.</p>
                    )}
                  </section>

                  <section>
                    <p className="label-utility text-ink/50">Brands</p>
                    {brands.length > 0 ? (
                      <ul className="mt-4 space-y-2">
                        {brands.map((brand) => (
                          <li key={brand.id}>
                            <Link
                              href={`/partner-brands/${brand.slug}`}
                              onClick={close}
                              className="block rounded border border-border p-3 transition-colors hover:border-forest"
                            >
                              <p className="text-sm font-medium text-ink">{brand.name}</p>
                              <p className="text-xs text-ink/50">{brand.city}</p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-ink/50">No brands found.</p>
                    )}
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Suggestions({
  onPick,
  onNavigate,
}: {
  onPick: (term: string) => void;
  onNavigate: () => void;
}) {
  const categories = CATEGORIES.filter((category) => !category.isProgramme);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <p className="label-utility text-ink/50">Popular searches</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {POPULAR.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onPick(term)}
              className="rounded-full border border-border px-4 py-2 text-sm text-ink transition-colors hover:border-forest hover:text-forest"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label-utility text-ink/50">Shop by category</p>
        <ul className="mt-4 flex flex-col gap-2">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/${category.slug}`}
                onClick={onNavigate}
                className={cn('text-sm text-ink/80 hover:text-forest hover:underline')}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
