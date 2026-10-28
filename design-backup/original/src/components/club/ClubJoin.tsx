'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import type { ClubSubscription, ClubTier } from '@/types/club';
import { CLUB_TIERS } from '@/lib/constants/club-tiers';
import { cancelMembership, joinClub, useMembership } from '@/lib/store/club';
import { formatNaira, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const SCENTS = ['Fresh', 'Woody', 'Oud', 'Citrus', 'Spicy'];
const SKIN_TYPES = ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'];
const STYLES = ['Classic', 'Bold', 'Minimal', 'Traditional', 'Contemporary'];

export function ClubJoin() {
  const membership = useMembership();

  if (membership) {
    return <MemberStatus membership={membership} />;
  }

  return <JoinFlow />;
}

function JoinFlow() {
  const [selectedTier, setSelectedTier] = React.useState<ClubTier | null>(null);
  const formRef = React.useRef<HTMLDivElement>(null);

  const choose = (tier: ClubTier) => {
    setSelectedTier(tier);
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {CLUB_TIERS.map((tier) => (
          <div
            key={tier.tier}
            className={cn(
              'relative flex flex-col rounded-md border bg-white p-6',
              tier.featured ? 'border-forest shadow-lg' : 'border-border',
            )}
          >
            {tier.featured && (
              <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 font-utility text-[10px] font-semibold uppercase tracking-utility text-ink">
                Most popular
              </span>
            )}
            <p className="label-utility text-forest">{tier.name}</p>
            <p className="mt-1 text-sm text-ink/60">{tier.tagline}</p>
            <p className="mt-3 font-display text-2xl font-bold text-ink">
              {formatNaira(tier.indicativePriceNaira)}
              <span className="text-sm font-normal text-ink/50"> / month</span>
            </p>
            <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm text-ink/80">
              {tier.whatsInside.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-forest" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 w-full"
              variant={tier.featured ? 'primary' : 'secondary'}
              onClick={() => choose(tier.tier)}
            >
              Join {tier.name}
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-ink/40">
        Pricing shown is illustrative pending commercial team confirmation.
      </p>

      {selectedTier && (
        <div ref={formRef}>
          <RegistrationForm tier={selectedTier} onChangeTier={setSelectedTier} />
        </div>
      )}
    </div>
  );
}

function RegistrationForm({
  tier,
  onChangeTier,
}: {
  tier: ClubTier;
  onChangeTier: (tier: ClubTier) => void;
}) {
  const definition = CLUB_TIERS.find((t) => t.tier === tier)!;
  const [size, setSize] = React.useState('M');
  const [scent, setScent] = React.useState('Woody');
  const [skin, setSkin] = React.useState('Normal');
  const [styles, setStyles] = React.useState<string[]>(['Classic']);

  const toggleStyle = (style: string) =>
    setStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const now = new Date();
    const nextBilling = new Date(now);
    nextBilling.setMonth(nextBilling.getMonth() + 1);

    const subscription: ClubSubscription = {
      id: `club_${now.getTime()}`,
      userId: 'guest',
      tier,
      status: 'active',
      preferences: {
        size,
        scentPreference: scent,
        skinType: skin,
        stylePalette: styles,
      },
      nextBillingDate: nextBilling.toISOString(),
    };
    joinClub(subscription);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mt-10 rounded-lg border border-border bg-white p-6 duration-300 animate-in fade-in slide-in-from-bottom-4 md:p-8"
    >
      <p className="label-utility text-gold">Become a member</p>
      <h2 className="mt-1 font-display text-2xl font-bold text-ink">
        Join {definition.name} — {formatNaira(definition.indicativePriceNaira)}/mo
      </h2>
      <p className="mt-1 text-sm text-ink/60">
        Tell us your preferences so each month&apos;s box is curated to you.
      </p>

      {/* Tier switch */}
      <div className="mt-6">
        <p className="label-utility text-ink/50">Membership</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CLUB_TIERS.map((t) => (
            <button
              key={t.tier}
              type="button"
              onClick={() => onChangeTier(t.tier)}
              aria-pressed={t.tier === tier}
              className={cn(
                'rounded border px-4 py-2 text-sm transition-colors',
                t.tier === tier
                  ? 'border-forest bg-forest text-ivory'
                  : 'border-border text-ink hover:bg-muted',
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <SelectField label="Shirt size" value={size} onChange={setSize} options={SIZES} />
        <SelectField
          label="Scent preference"
          value={scent}
          onChange={setScent}
          options={SCENTS}
        />
        <SelectField
          label="Skin type"
          value={skin}
          onChange={setSkin}
          options={SKIN_TYPES}
        />
      </div>

      <div className="mt-6">
        <p className="label-utility text-ink/50">Style palette</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STYLES.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => toggleStyle(style)}
              aria-pressed={styles.includes(style)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm transition-colors',
                styles.includes(style)
                  ? 'border-forest bg-forest text-ivory'
                  : 'border-border text-ink hover:bg-muted',
              )}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-8 w-full sm:w-auto">
        Start membership — {formatNaira(definition.indicativePriceNaira)}/mo
      </Button>
      <p className="mt-3 text-xs text-ink/50">
        You can skip, pause or cancel anytime. First box ships within 7 days.
      </p>
    </form>
  );
}

function MemberStatus({ membership }: { membership: ClubSubscription }) {
  const definition = CLUB_TIERS.find((t) => t.tier === membership.tier);
  const nextBilling = new Date(membership.nextBillingDate).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="rounded-lg border border-forest bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label-utility text-gold">You&apos;re a member</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink">
            {definition?.name} Membership
          </h2>
          <p className="mt-1 text-sm text-ink/60">
            {definition && formatNaira(definition.indicativePriceNaira)} / month · Active
          </p>
        </div>
        <span className="rounded-full bg-forest px-3 py-1 font-utility text-[10px] font-semibold uppercase tracking-utility text-ivory">
          Active
        </span>
      </div>

      <dl className="mt-6 grid gap-4 border-t border-border pt-6 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-ink/50">Next box &amp; billing</dt>
          <dd className="mt-0.5 text-ink">{nextBilling}</dd>
        </div>
        <div>
          <dt className="text-ink/50">Your preferences</dt>
          <dd className="mt-0.5 text-ink">
            Size {membership.preferences.size} · {membership.preferences.scentPreference}{' '}
            scent · {membership.preferences.skinType} skin
          </dd>
        </div>
        {membership.preferences.stylePalette.length > 0 && (
          <div className="sm:col-span-2">
            <dt className="text-ink/50">Style palette</dt>
            <dd className="mt-0.5 text-ink">
              {membership.preferences.stylePalette.join(' · ')}
            </dd>
          </div>
        )}
      </dl>

      {definition && (
        <div className="mt-6 border-t border-border pt-6">
          <p className="label-utility text-ink/50">In your box</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-ink/80">
            {definition.whatsInside.map((item) => (
              <li key={item} className="flex gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-forest" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-6">
        <Button variant="secondary" onClick={() => cancelMembership()}>
          Cancel membership
        </Button>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="label-utility text-ink/70">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded border border-border bg-white px-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
