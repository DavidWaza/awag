import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Buy-box and utility actions share one primitive so states (loading,
 * disabled, focus) are consistent everywhere — ADD TO BAG, SAVE ITEM,
 * PLACE ORDER, etc. all render through this component.
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-utility text-xs font-semibold uppercase tracking-utility transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest',
  {
    variants: {
      variant: {
        primary: 'bg-forest text-ivory hover:bg-forest/90',
        secondary: 'border border-forest bg-transparent text-forest hover:bg-forest/5',
        ghost: 'text-forest hover:bg-forest/5',
        destructive: 'bg-wine text-ivory hover:bg-wine/90',
        link: 'text-forest underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-[11px]',
        md: 'h-11 px-5',
        lg: 'h-14 px-8 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled ?? isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? 'Please wait…' : children}
      </button>
    );
  },
);
Button.displayName = 'Button';
