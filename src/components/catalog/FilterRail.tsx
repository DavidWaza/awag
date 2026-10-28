import type { Facets } from '@/lib/plp/query';
import { FilterGroups } from './FilterGroups';

/** Desktop/tablet left rail. Mobile uses <FiltersSheet> instead. */
export function FilterRail({ facets }: { facets: Facets }) {
  return (
    <aside className="hidden w-56 shrink-0 lg:block" aria-label="Filters">
      <FilterGroups facets={facets} />
    </aside>
  );
}
