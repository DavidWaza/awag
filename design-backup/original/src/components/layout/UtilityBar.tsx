import Link from 'next/link';
import { Heart, User } from 'lucide-react';
import { BagLink } from './BagLink';
import { SiteSearch } from './SiteSearch';

/**
 * Visible on every page: search, account, saved items, bag, and a rotating
 * promo message — Section 03.
 */
export function UtilityBar({
  promoMessage = 'Free delivery in Abuja over ₦50,000 · Join the Club',
}: {
  promoMessage?: string;
}) {
  return (
    <div className="border-b border-border bg-forest text-ivory">
      <div className="container flex h-9 items-center justify-between text-xs">
        <p className="label-utility truncate">{promoMessage}</p>
        <nav aria-label="Account utilities" className="flex items-center gap-4">
          <SiteSearch />
          <Link href="/account" aria-label="Account" className="hover:text-gold">
            <User size={16} />
          </Link>
          <Link href="/saved" aria-label="Saved items" className="hover:text-gold">
            <Heart size={16} />
          </Link>
          <BagLink />
        </nav>
      </div>
    </div>
  );
}
