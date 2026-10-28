import { cn } from '@/lib/utils';
import { formatNaira } from '@/lib/utils';

interface PriceProps {
  amountNaira: number;
  compareAtNaira?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASS = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
} as const;

/** Section 06: price display always in Naira, thousands-separated, no kobo. */
export function Price({
  amountNaira,
  compareAtNaira,
  size = 'md',
  className,
}: PriceProps) {
  const isOnSale = typeof compareAtNaira === 'number' && compareAtNaira > amountNaira;

  return (
    <span className={cn('inline-flex items-baseline gap-2 font-utility', className)}>
      <span className={cn('font-semibold text-wine', SIZE_CLASS[size])}>
        {formatNaira(amountNaira)}
      </span>
      {isOnSale && (
        <span className="text-ink/40 line-through" aria-label="Original price">
          {formatNaira(compareAtNaira)}
        </span>
      )}
    </span>
  );
}
