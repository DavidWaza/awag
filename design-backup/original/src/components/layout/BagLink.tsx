'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartCount } from '@/lib/store/cart';

/** Header bag link with a live count. `id="bag-icon"` is the fly-to-bag target. */
export function BagLink() {
  const count = useCartCount();
  return (
    <Link
      id="bag-icon"
      href="/bag"
      aria-label={`Bag, ${count} items`}
      className="flex items-center gap-1 hover:text-gold"
    >
      <ShoppingBag size={16} />
      <span>{count}</span>
    </Link>
  );
}
