import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategoryBySlug } from '@/lib/constants/categories';
import { parsePlpQuery } from '@/lib/plp/searchParams';
import { getFacets, getProducts } from '@/lib/plp/query';
import { SortBar } from '@/components/catalog/SortBar';
import { FilterRail } from '@/components/catalog/FilterRail';
import { FiltersSheet } from '@/components/catalog/FiltersSheet';
import { PlpProductGrid } from '@/components/catalog/PlpProductGrid';
import { LoadMore } from '@/components/catalog/LoadMore';

const PAGE_SIZE = 24;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  return { title: category?.name ?? 'Category not found' };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) notFound();

  // Rebuild a URLSearchParams from the (awaited) query object so the same parser
  // runs on server and client.
  const raw = await searchParams;
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === 'string') sp.set(key, value);
  }
  const query = parsePlpQuery(sp);

  const facets = getFacets(categorySlug);
  const { items, total } = getProducts(categorySlug, query, {
    limit: query.page * PAGE_SIZE,
  });

  return (
    <div className="container py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-ink/50">
        Home / {category.name}
      </nav>
      <p className="label-utility mt-4 text-gold">The Edit</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
        {category.name}
      </h1>

      <div className="mt-10 flex gap-8">
        <FilterRail facets={facets} />

        <div className="min-w-0 flex-1">
          {/* Sort sits top-left of the grid; Filters button (mobile) beside it */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FiltersSheet facets={facets} />
              <SortBar />
            </div>
            <span className="text-sm text-ink/60">{total} items</span>
          </div>

          <PlpProductGrid products={items} />
          <LoadMore page={query.page} hasMore={items.length < total} />
        </div>
      </div>
    </div>
  );
}
