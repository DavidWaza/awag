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
      {/* Intro */}
      <section className="bg-forest text-ivory">
        <div className="container py-16">
          <p className="label-utility text-gold">The Gentleman&apos;s Club</p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl font-bold md:text-5xl">
            A curated box, delivered every month.
          </h1>
          <p className="mt-4 max-w-xl text-ivory/70">
            Grooming, skincare, socks, ties and native-wear accessories — chosen for you
            and shipped without a shopping trip. Choose a package, tell us your
            preferences, and become a member in minutes.
          </p>
        </div>
      </section>

      {/* Packages + registration */}
      <section className="container py-16">
        <h2 className="font-display text-2xl font-bold text-ink">Choose your membership</h2>
        <p className="mt-1 text-sm text-ink/60">
          Three packages, billed monthly. Skip, pause or cancel anytime.
        </p>
        <div className="mt-8">
          <ClubJoin />
        </div>
      </section>

      {/* Member benefits (included) */}
      <section className="border-t border-border bg-white">
        <div className="container py-16">
          <p className="label-utility text-gold">Every membership includes</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink">Member benefits</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CLUB_BENEFITS.map((benefit) => (
              <div key={benefit.title} className="rounded-md border border-border p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-muted text-forest">
                  <Check size={18} />
                </span>
                <p className="mt-3 font-display font-bold text-ink">{benefit.title}</p>
                <p className="mt-1 text-sm text-ink/60">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-on benefits (priced) */}
      <section className="container py-16">
        <p className="label-utility text-gold">Add to any membership</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">
          Concierge services
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Optional extras, priced individually and added to your monthly bill.
        </p>
        <ul className="mt-8 divide-y divide-border rounded-md border border-border">
          {CLUB_ADDONS.map((addon) => (
            <li
              key={addon.name}
              className="flex flex-wrap items-center justify-between gap-3 p-5"
            >
              <div>
                <p className="font-display font-bold text-ink">{addon.name}</p>
                <p className="mt-0.5 text-sm text-ink/60">{addon.description}</p>
              </div>
              <p className="font-utility font-semibold text-wine">
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
