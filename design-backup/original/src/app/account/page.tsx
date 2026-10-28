import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import {
  Bell,
  CreditCard,
  Crown,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  Package,
  RotateCcw,
  UserCog,
  type LucideIcon,
} from 'lucide-react';
import { auth, signOut } from '@/lib/auth';
import { AccountAuth } from '@/components/account/AccountAuth';

export const metadata: Metadata = { title: 'My Account' };

interface AccountTile {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

// ASOS-style dashboard destinations. Sub-routes under /account are stubbed for
// now (guarded by proxy.ts); the Club, Saved items and Help point at existing
// or planned public pages.
const TILES: AccountTile[] = [
  {
    href: '/account/orders',
    label: 'Orders',
    description: 'Track, return or buy again',
    icon: Package,
  },
  {
    href: '/account/returns',
    label: 'Returns',
    description: 'Create or track a return',
    icon: RotateCcw,
  },
  {
    href: '/account/details',
    label: 'Details & password',
    description: 'Edit your personal details',
    icon: UserCog,
  },
  {
    href: '/account/addresses',
    label: 'Addresses',
    description: 'Manage delivery addresses',
    icon: MapPin,
  },
  {
    href: '/account/payments',
    label: 'Payment methods',
    description: 'Saved cards & wallets',
    icon: CreditCard,
  },
  {
    href: '/saved',
    label: 'Saved items',
    description: 'Your wishlist',
    icon: Heart,
  },
  {
    href: '/the-club',
    label: 'The Club',
    description: 'Manage your membership',
    icon: Crown,
  },
  {
    href: '/account/preferences',
    label: 'Contact preferences',
    description: 'Email & marketing',
    icon: Bell,
  },
  {
    href: '/contact',
    label: 'Help',
    description: 'FAQs & contact us',
    icon: HelpCircle,
  },
];

export default async function AccountPage() {
  const session = await auth();

  // Unauthenticated: /account becomes the login / sign-up hub.
  if (!session?.user) {
    return (
      <div className="container flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md">
          <Suspense fallback={null}>
            <AccountAuth />
          </Suspense>
        </div>
      </div>
    );
  }

  // Authenticated: the account dashboard.
  const firstName = session.user.name?.split(' ')[0];

  async function signOutAction() {
    'use server';
    await signOut({ redirectTo: '/' });
  }

  return (
    <div className="container py-12">
      <p className="label-utility text-gold">My Account</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-ink">
          Hi{firstName ? `, ${firstName}` : ' there'}
        </h1>
        {session?.user?.email && (
          <p className="text-sm text-ink/50">Signed in as {session.user.email}</p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 rounded-md border border-border bg-white p-5 transition-colors hover:border-forest"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-muted text-forest transition-colors group-hover:bg-forest group-hover:text-ivory">
              <Icon size={20} />
            </span>
            <span>
              <span className="block font-display font-bold text-ink">{label}</span>
              <span className="mt-0.5 block text-sm text-ink/60">{description}</span>
            </span>
          </Link>
        ))}
      </div>

      <form action={signOutAction} className="mt-8">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded border border-border px-5 py-3 font-utility text-xs font-semibold uppercase tracking-utility text-ink transition-colors hover:border-wine hover:text-wine"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </form>
    </div>
  );
}
