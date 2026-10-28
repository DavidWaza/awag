'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

/**
 * Appends the next page on demand. `page=N` means "N pages loaded", so a shared
 * link restores the same amount of content in one server request.
 */
export function LoadMore({ page, hasMore }: { page: number; hasMore: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();

  if (!hasMore) return null;

  const loadMore = () => {
    const next = new URLSearchParams(params);
    next.set('page', String(page + 1));
    start(() => router.push(`${pathname}?${next}`, { scroll: false }));
  };

  return (
    <div className="flex justify-center py-12">
      <Button variant="secondary" size="lg" onClick={loadMore} disabled={pending}>
        {pending ? 'Loading…' : 'Load more'}
      </Button>
    </div>
  );
}
