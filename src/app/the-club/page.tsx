import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { CLUB_ADDONS, CLUB_BENEFITS } from '@/lib/constants/club-tiers';
import { formatNaira } from '@/lib/utils';
import { ClubJoin } from '@/components/club/ClubJoin';

export const metadata: Metadata = {
  title: "The Gentleman's Club",
  description:
    'A curated monthly box and membership for the modern Nigerian gentleman — tiers, benefits and member perks.',
};

export default function TheClubPage() {
  return (
    <>
      {/* Intro — noir atelier band */}
      <section className="relative overflow-hidden border-b border-gold/20 bg-gradient-to-b from-black via-surface to-black text-ink">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-8 h-48 w-48 rounded-full bg-gold/5 blur-2xl"
        />
        <div className="container relative py-20 md:py-24">
          <p className="label-utility text-gold">The Gentleman&apos;s Club</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl">
            A curated box, delivered every month.
          </h1>
          <p className="mt-5 max-w-xl text-ink/65">
            Grooming, skincare, socks, ties and native-wear accessories — chosen for you
            and shipped without a shopping trip. Choose a package, tell us your
            preferences, and become a member in minutes.
          </p>
        </div>
      </section>

      {/* Packages + registration */}
      <section className="container py-16">
        <p className="label-utility text-gold">Membership</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">
          Choose your membership
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Three packages, billed monthly. Skip, pause or cancel anytime.
        </p>
        <div className="mt-8">
          <ClubJoin />
        </div>
      </section>

      {/* Member benefits */}
      <section className="border-y border-gold/20 bg-surface">
        <div className="container py-16">
          <p className="label-utility text-gold">Every membership includes</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink">Member benefits</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CLUB_BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-md border border-border bg-black/40 p-5 transition-colors hover:border-gold/40"
              >
                <span className="grid h-9 w-9 place-items-center rounded-sm border border-gold/30 bg-muted text-gold">
                  <Check size={18} />
                </span>
                <p className="mt-3 font-display font-bold text-ink">{benefit.title}</p>
                <p className="mt-1 text-sm text-ink/60">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-on benefits */}
      <section className="container py-16">
        <p className="label-utility text-gold">Add to any membership</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">
          Concierge services
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Optional extras, priced individually and added to your monthly bill.
        </p>
        <ul className="mt-8 divide-y divide-border overflow-hidden rounded-md border border-gold/20 bg-surface">
          {CLUB_ADDONS.map((addon) => (
            <li
              key={addon.name}
              className="flex flex-wrap items-center justify-between gap-3 p-5"
            >
              <div>
                <p className="font-display font-bold text-ink">{addon.name}</p>
                <p className="mt-0.5 text-sm text-ink/60">{addon.description}</p>
              </div>
              <p className="font-utility font-semibold text-gold">
                {formatNaira(addon.priceNaira)}
                <span className="text-xs font-normal text-ink/50"> each</span>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
