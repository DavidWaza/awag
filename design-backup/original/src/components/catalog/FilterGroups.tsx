'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { parsePlpQuery, withPlpParam } from '@/lib/plp/searchParams';
import type { Facets } from '@/lib/plp/query';
import { cn } from '@/lib/utils';
import { PriceRange } from './PriceRange';

/**
 * The size / colour / price / brand controls. Shared by the desktop rail and
 * the mobile sheet — each writes to the URL through `withPlpParam`, and any
 * change resets pagination.
 */
export function FilterGroups({ facets }: { facets: Facets }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = parsePlpQuery(params);

  const go = (patch: Record<string, string | undefined>) =>
    router.push(`${pathname}?${withPlpParam(params, patch)}`, { scroll: false });

  const toggle = (key: 'size' | 'colour' | 'brand', value: string) => {
    const set = new Set(q[key]);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    go({ [key]: [...set].join(',') || undefined });
  };

  return (
    <div className="space-y-8">
      {facets.sizes.length > 0 && (
        <FilterGroup title="Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((size) => (
              <Chip
                key={size}
                active={q.size.includes(size)}
                onClick={() => toggle('size', size)}
              >
                {size}
              </Chip>
            ))}
          </div>
        </FilterGroup>
      )}

      {facets.colours.length > 0 && (
        <FilterGroup title="Colour">
          {/* Colour is never the only signal: title + aria-label + checkmark. */}
          <div className="flex flex-wrap gap-2">
            {facets.colours.map((colour) => {
              const active = q.colour.includes(colour.slug);
              return (
                <button
                  key={colour.slug}
                  type="button"
                  onClick={() => toggle('colour', colour.slug)}
                  title={colour.label}
                  aria-pressed={active}
                  aria-label={colour.label}
                  className={cn(
                    'grid h-7 w-7 place-items-center rounded-sm border transition-transform',
                    active ? 'scale-110 border-forest' : 'border-border',
                  )}
                  style={{ backgroundColor: colour.hex }}
                >
                  {active && <span className="text-xs text-ivory">✓</span>}
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}

      {facets.brands.length > 1 && (
        <FilterGroup title="Brand">
          <ul className="space-y-2">
            {facets.brands.map((brand) => {
              const active = q.brand.includes(brand.slug);
              return (
                <li key={brand.slug}>
                  <label className="flex items-center gap-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggle('brand', brand.slug)}
                      className="h-4 w-4 accent-forest"
                    />
                    {brand.label}
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
      )}

      {facets.price.max > facets.price.min && (
        <FilterGroup title="Price">
          <PriceRange
            bounds={facets.price}
            value={{ min: q.min, max: q.max }}
            onCommit={(min, max) => go({ min: String(min), max: String(max) })}
          />
        </FilterGroup>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 font-utility text-xs font-semibold uppercase tracking-utility text-ink/50">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Chip({
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <button
      {...props}
      type="button"
      aria-pressed={active}
      className={cn(
        'h-9 min-w-9 rounded-sm border px-3 text-sm transition-colors',
        active
          ? 'border-forest bg-forest text-ivory'
          : 'border-border text-ink hover:bg-muted',
      )}
    >
      {children}
    </button>
  );
}
