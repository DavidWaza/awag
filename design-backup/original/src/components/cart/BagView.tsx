'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Ruler, Trash2 } from 'lucide-react';
import type { Product, Sku } from '@/types/product';
import { findSkuById } from '@/lib/data/products';
import { formatNaira, cn } from '@/lib/utils';
import { filledMeasurements, type Measurements } from '@/lib/catalog/measurements';
import { Price } from '@/components/ui/Price';
import { buttonVariants } from '@/components/ui/Button';
import {
  decrementLine,
  incrementLine,
  removeLine,
  useCart,
  type CartLineItem,
} from '@/lib/store/cart';

// Free delivery in Abuja over ₦50,000 (matches the utility-bar promo).
const FREE_DELIVERY_THRESHOLD = 50_000;

interface ResolvedLine extends CartLineItem {
  product: Product;
  sku: Sku;
}

export function BagView() {
  const cart = useCart();

  const lines: ResolvedLine[] = cart.flatMap((line) => {
    const found = findSkuById(line.skuId);
    if (!found) return [];
    return [{ ...line, ...found }];
  });

  const subtotal = lines.reduce((sum, l) => sum + l.sku.priceNaira * l.qty, 0);
  const compareTotal = lines.reduce(
    (sum, l) => sum + (l.sku.compareAtPriceNaira ?? l.sku.priceNaira) * l.qty,
    0,
  );
  const savings = compareTotal - subtotal;
  const totalUnits = lines.reduce((sum, l) => sum + l.qty, 0);
  const freeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink">
        Shopping Bag
        {totalUnits > 0 && <span className="text-ink/40"> ({totalUnits})</span>}
      </h1>

      {lines.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-ink/60">Your bag is empty.</p>
          <Link href="/native-wears" className={cn(buttonVariants({ size: 'lg' }), 'mt-6')}>
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Line items */}
          <ul className="border-t border-border">
            {lines.map((line) => (
              <li key={line.id} className="flex gap-4 border-b border-border py-6">
                <Link
                  href={`/product/${line.product.slug}`}
                  className="relative h-32 w-24 shrink-0 overflow-hidden rounded-md bg-muted"
                >
                  {line.product.images[0] && (
                    <Image
                      src={line.product.images[0]}
                      alt={line.product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link href={`/product/${line.product.slug}`}>
                        <p className="text-sm text-ink">{line.product.name}</p>
                      </Link>
                      <p className="mt-1 text-xs text-ink/50">
                        {line.sku.colour} · Size {line.sku.size}
                      </p>
                      {line.measurements && (
                        <MeasurementSummary measurements={line.measurements} />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      aria-label={`Remove ${line.product.name}`}
                      className="text-ink/50 transition-colors hover:text-wine"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-4">
                    <div className="flex items-center rounded border border-border">
                      <button
                        type="button"
                        onClick={() => decrementLine(line.id)}
                        aria-label="Decrease quantity"
                        className="grid h-9 w-9 place-items-center text-ink hover:bg-muted"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums text-ink">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementLine(line.id)}
                        disabled={line.qty >= line.sku.stock}
                        aria-label="Increase quantity"
                        className="grid h-9 w-9 place-items-center text-ink hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <Price
                      amountNaira={line.sku.priceNaira * line.qty}
                      compareAtNaira={
                        line.sku.compareAtPriceNaira
                          ? line.sku.compareAtPriceNaira * line.qty
                          : undefined
                      }
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Order summary */}
          <aside className="h-fit rounded-md border border-border bg-white p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-bold text-ink">Order Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/60">Subtotal</dt>
                <dd className="text-ink">{formatNaira(subtotal)}</dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-wine">
                  <dt>You save</dt>
                  <dd>−{formatNaira(savings)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/60">Delivery</dt>
                <dd className="text-ink">
                  {freeDelivery ? 'Free' : 'Calculated at checkout'}
                </dd>
              </div>
            </dl>

            {!freeDelivery && (
              <p className="mt-3 text-xs text-ink/50">
                Add {formatNaira(FREE_DELIVERY_THRESHOLD - subtotal)} more for free
                delivery in Abuja.
              </p>
            )}

            <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold text-ink">
              <span>Total</span>
              <span>{formatNaira(subtotal)}</span>
            </div>

            <Link
              href="/checkout"
              className={cn(buttonVariants({ size: 'lg' }), 'mt-6 w-full')}
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

function MeasurementSummary({ measurements }: { measurements: Measurements }) {
  const filled = filledMeasurements(measurements);

  return (
    <details className="mt-2 text-xs text-ink/60">
      <summary className="flex cursor-pointer items-center gap-1.5 text-forest">
        <Ruler size={13} />
        Made to measure · {measurements.fit} fit
      </summary>
      {filled.length > 0 && (
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
          {filled.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-2">
              <dt>{label}</dt>
              <dd className="text-ink">{value}&Prime;</dd>
            </div>
          ))}
        </dl>
      )}
      {measurements.notes.trim() && (
        <p className="mt-2 italic">“{measurements.notes}”</p>
      )}
    </details>
  );
}
