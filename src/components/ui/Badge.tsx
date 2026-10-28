import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { ProductTag } from '@/types/product';

/**
 * Section 06: "colour is never the only signal for stock/sale status — a
 * text label always accompanies the tag colour." Every variant below pairs
 * a colour with a distinct text string, never colour alone.
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-sm px-2 py-0.5 font-utility text-[10px] font-semibold uppercase tracking-utility',
  {
    variants: {
      variant: {
        new: 'bg-forest text-ivory',
        sale: 'bg-wine text-ivory',
        clubExclusive: 'bg-gold text-ink',
        partnerBrand: 'border border-ink/20 bg-transparent text-ink',
        outOfStock: 'bg-muted text-ink/60',
      },
    },
    defaultVariants: { variant: 'new' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}

const TAG_LABEL: Record<ProductTag, string> = {
  new: 'New',
  sale: 'Sale',
  'club-exclusive': 'Club Exclusive',
  'partner-brand': 'Partner Brand',
};

const TAG_VARIANT: Record<ProductTag, BadgeProps['variant']> = {
  new: 'new',
  sale: 'sale',
  'club-exclusive': 'clubExclusive',
  'partner-brand': 'partnerBrand',
};

/** Renders a product's `tags` array as badges, in a fixed priority order. */
export function ProductTagBadges({ tags }: { tags: ProductTag[] }) {
  const priority: ProductTag[] = ['sale', 'club-exclusive', 'new', 'partner-brand'];
  const ordered = priority.filter((tag) => tags.includes(tag));

  if (ordered.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {ordered.map((tag) => (
        <Badge key={tag} variant={TAG_VARIANT[tag]}>
          {TAG_LABEL[tag]}
        </Badge>
      ))}
    </div>
  );
}
