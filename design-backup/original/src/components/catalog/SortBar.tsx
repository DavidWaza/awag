'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { withPlpParam } from '@/lib/plp/searchParams';

const OPTIONS = [
  { value: 'new', label: 'New additions' },
  { value: 'price_asc', label: 'Price — low to high' },
  { value: 'price_desc', label: 'Price — high to low' },
  { value: 'brand', label: 'Brand' },
] as const;

export function SortBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get('sort') ?? 'new';

  const onChange = (sort: string) =>
    router.push(`${pathname}?${withPlpParam(params, { sort })}`, { scroll: false });

  return (
    <label className="flex items-center gap-2 text-sm text-ink/60">
      <span className="font-utility text-xs font-semibold uppercase tracking-utility">
        Sort
      </span>
      <select
        value={current}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded border border-border bg-white px-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
