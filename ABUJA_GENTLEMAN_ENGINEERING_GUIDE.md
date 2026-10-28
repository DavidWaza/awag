# Abuja Gentleman — Engineering Guide

> **Audience:** every developer joining the build.
> **Source of truth:** `Abuja_Gentleman_Platform_Documentation.pdf` v1.0 (July 2026).
> **Rule zero:** no arbitrary values. Every colour, space, radius, and font size comes from a token defined in this document. If a value isn't a token, it doesn't ship.

---

## 1. Product in One Paragraph

A curated menswear e-commerce platform for the modern Nigerian gentleman, with three pillars: the **Flagship Store** (house lines — native wear, English wear, shoes, perfumery, essentials), a **Partner Marketplace** (hosted storefronts for vetted Abuja/Lagos brands on revenue share), and **The Club** (a paid monthly subscription box). The interface model is ASOS: sticky utility bar, full-bleed hero, left-rail filtered grids, size-first product page, frictionless guest checkout — localised for Naira pricing, Nigerian delivery, and card / bank transfer / USSD / pay-on-delivery payments.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SSR/ISR for SEO-critical PLP/PDP pages; RSC keeps the grid fast on 3G. |
| Styling | **Tailwind CSS + CSS custom properties** | Tokens live once in CSS variables; Tailwind consumes them. Zero arbitrary values enforced by lint. |
| State | **Server state:** TanStack Query · **Cart/UI:** Zustand | Small, explicit, no global soup. |
| Backend | **Supabase (Postgres + Auth + Edge Functions)** | Row-level security fits the multi-tenant marketplace; managed infra fits a small team. |
| Payments | Provider-agnostic `PaymentGateway` interface (Paystack/Flutterwave adapters) | Card, transfer, USSD, and POD behind one contract; provider choice stays swappable per the doc's "outside scope" note. |
| Testing | Vitest (unit) · Playwright (checkout & filter flows) | Test the money paths first. |

**Principles that override any tool choice**

1. **Tokens over values** — see §3.
2. **Composition over configuration** — components accept `children` and small prop surfaces; no 15-prop god components.
3. **Server-first** — anything that can render on the server does; client components are leaves (`AddToBagButton`, `FilterRail`, `SizeSelector`).
4. **One direction of dependency** — `app → features → components/ui → tokens`. Nothing imports upward.

---

## 3. Design Tokens (Single Source of Truth)

All tokens are defined **once** in `src/styles/tokens.css` and mirrored into `tailwind.config.ts`. Never write a hex, px, or rem literal in a component.

### 3.1 Colour

Palette is drawn from the brand doc — tailoring, not trend. Semantic aliases are what components use; raw values are never referenced directly outside this file.

```css
/* src/styles/tokens.css */
:root {
  /* ── Raw palette (do not use directly in components) ───────── */
  --ag-forest-900: #122E22;  /* darkened step for hover */
  --ag-forest-800: #1B4332;  /* PRIMARY — nav, buttons */
  --ag-forest-100: #E3EBE6;  /* tinted backgrounds, tags */
  --ag-gold-500:   #C89B3C;  /* ACCENT — dividers, highlights */
  --ag-gold-100:   #F3E8CE;  /* accent tint */
  --ag-wine-600:   #6B1E23;  /* PRICE / SALE / ALERTS */
  --ag-wine-100:   #F2E2E3;  /* alert tint */
  --ag-ivory-100:  #F4EFE2;  /* SECTION BACKGROUNDS */
  --ag-ink-900:    #211D1B;  /* BODY TEXT */
  --ag-ink-500:    #6E6862;  /* secondary text (derived, AA on ivory) */
  --ag-white:      #FFFFFF;
  --ag-focus:      #2E6FD8;  /* focus ring — never used decoratively */

  /* ── Semantic aliases (what components actually consume) ───── */
  --color-primary:        var(--ag-forest-800);
  --color-primary-hover:  var(--ag-forest-900);
  --color-accent:         var(--ag-gold-500);
  --color-price:          var(--ag-wine-600);
  --color-sale:           var(--ag-wine-600);
  --color-surface:        var(--ag-white);
  --color-surface-alt:    var(--ag-ivory-100);
  --color-text:           var(--ag-ink-900);
  --color-text-muted:     var(--ag-ink-500);
  --color-border:         var(--ag-ink-900);      /* used at reduced width, not opacity */
  --color-focus-ring:     var(--ag-focus);
  --color-on-primary:     var(--ag-white);
  --color-tag-new:        var(--ag-forest-800);
  --color-tag-sale:       var(--ag-wine-600);
  --color-tag-club:       var(--ag-gold-500);
  --color-tag-partner:    var(--ag-ink-900);
}
```

```ts
// tailwind.config.ts — Tailwind reads tokens; it never defines colours itself
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      primary: { DEFAULT: "var(--color-primary)", hover: "var(--color-primary-hover)" },
      accent: "var(--color-accent)",
      price: "var(--color-price)",
      surface: { DEFAULT: "var(--color-surface)", alt: "var(--color-surface-alt)" },
      text: { DEFAULT: "var(--color-text)", muted: "var(--color-text-muted)" },
      border: "var(--color-border)",
      focus: "var(--color-focus-ring)",
      "on-primary": "var(--color-on-primary)",
    },
    // spacing / fontSize / radii also mapped from tokens — see §3.2
  },
} satisfies Config;
```

> **Lint enforcement:** enable `tailwindcss/no-arbitrary-value` (or a custom ESLint rule banning `[`…`]` in class strings) plus Stylelint `declaration-property-value-allowed-list` restricting `color`/`background` to `var(--…)`. CI fails on violations.

### 3.2 Type, Space, Radius, Elevation

```css
:root {
  /* Typography — roles, not fonts-by-page */
  --font-display: "Fraunces", Georgia, serif;        /* headings, product names */
  --font-body:    "Inter", system-ui, sans-serif;    /* body, UI */
  --font-utility: "Inter", system-ui, sans-serif;    /* labels — used with tracking */

  --text-xs: 0.75rem;   /* 12px — tags, meta only, never body */
  --text-sm: 0.875rem;  /* 14px — ACCESSIBILITY FLOOR for body text */
  --text-md: 1rem;      /* 16px — default body */
  --text-lg: 1.25rem;   /* 20px — card titles */
  --text-xl: 1.75rem;   /* 28px — section headings */
  --text-2xl: 2.5rem;   /* 40px — page/hero headings */

  --tracking-label: 0.08em;  /* utility labels: uppercase + tracked */

  /* Spacing — 4px base scale. No values outside this scale. */
  --space-1: 0.25rem;  --space-2: 0.5rem;  --space-3: 0.75rem;
  --space-4: 1rem;     --space-6: 1.5rem;  --space-8: 2rem;
  --space-12: 3rem;    --space-16: 4rem;

  /* Radius & elevation — deliberately quiet */
  --radius-sm: 2px;    /* buttons, inputs, tags */
  --radius-md: 4px;    /* cards */
  --shadow-raised: 0 2px 8px rgb(33 29 27 / 0.08);
}
```

**Accessibility floor (non-negotiable, from the design system doc):**
- Body text never below `--text-sm` (14px).
- Every interactive element shows `outline: 2px solid var(--color-focus-ring)` on `:focus-visible`.
- Colour is never the only status signal — every `Tag` renders a text label alongside its colour.

---

## 4. Repository Structure

```
abuja-gentleman/
├─ src/
│  ├─ app/                        # Next.js routes — thin; compose features
│  │  ├─ (shop)/
│  │  │  ├─ page.tsx              # Homepage
│  │  │  ├─ [category]/page.tsx   # PLP  (native-wears, english-wears, …)
│  │  │  ├─ product/[slug]/page.tsx  # PDP
│  │  │  ├─ bag/page.tsx
│  │  │  └─ checkout/page.tsx
│  │  ├─ partner-brands/          # directory, [brand] storefront, apply
│  │  ├─ club/                    # tiers, past-boxes, gift
│  │  └─ account/                 # orders, saved items, club management
│  ├─ components/
│  │  └─ ui/                      # Dumb, reusable, token-styled primitives
│  │     ├─ Button.tsx  Tag.tsx  Price.tsx  Input.tsx
│  │     ├─ Select.tsx  Rating.tsx  Breadcrumbs.tsx  Skeleton.tsx
│  ├─ features/                   # Smart, domain-aware compositions
│  │  ├─ catalog/    # ProductCard, ProductGrid, FilterRail, SortBar
│  │  ├─ product/    # Gallery, SizeSelector, BuyBox, MakerStory, CompleteTheLook
│  │  ├─ cart/       # BagLine, BagSummary, PromoCode, cart.store.ts
│  │  ├─ checkout/   # DeliveryForm, PaymentMethodPicker, OrderSummary
│  │  ├─ club/       # TierCard, PreferenceProfile, BoxTimeline
│  │  └─ partners/   # BrandCard, StorefrontHeader, ApplyForm
│  ├─ lib/
│  │  ├─ api/        # typed data-access (products.ts, orders.ts, club.ts)
│  │  ├─ payments/   # PaymentGateway interface + provider adapters
│  │  └─ format.ts   # formatNaira(), formatDeliveryWindow()
│  ├─ types/         # domain models (see §6)
│  └─ styles/
│     ├─ tokens.css
│     └─ globals.css
├─ tailwind.config.ts
└─ tests/
```

**Boundary rules**
- `components/ui` knows nothing about products, carts, or Naira. It renders props.
- `features/*` may import `components/ui` and `lib`, never another feature's internals — cross-feature needs go through `lib/api` or a store.
- `app/*` files stay under ~80 lines: fetch → compose → render.

---

## 5. Component Library

### 5.1 UI Primitives (`components/ui`)

Small, typed, variant-driven. Variants map 1:1 to the design system — no ad-hoc styling at call sites.

```tsx
// components/ui/Button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const button = cva(
  // base: token-driven, focus ring always visible
  "inline-flex items-center justify-center rounded-sm font-utility uppercase " +
  "tracking-label text-sm transition-colors disabled:opacity-50 " +
  "disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-focus focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover",   // ADD TO BAG
        secondary: "border border-primary text-primary hover:bg-surface-alt", // SAVE ITEM
        ghost: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        md: "h-11 px-6",   // 44px — minimum touch target
        lg: "h-12 px-8 w-full", // buy-box / checkout CTA
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, ...props }, ref) => (
    <button ref={ref} className={button({ variant, size, className })} {...props} />
  )
);
Button.displayName = "Button";
```

```tsx
// components/ui/Tag.tsx — colour is never the only signal: label is required
const TAG_STYLES = {
  new: "bg-primary text-on-primary",
  sale: "bg-price text-on-primary",
  club: "bg-accent text-text",
  partner: "border border-border text-text",
} as const;

export function Tag({ kind, label }: { kind: keyof typeof TAG_STYLES; label: string }) {
  return (
    <span className={`rounded-sm px-2 py-1 text-xs font-utility uppercase tracking-label ${TAG_STYLES[kind]}`}>
      {label}
    </span>
  );
}
```

```tsx
// components/ui/Price.tsx — one formatter, used everywhere Naira appears
import { formatNaira } from "@/lib/format";

export function Price({ amountKobo, sale = false }: { amountKobo: number; sale?: boolean }) {
  return (
    <span className={sale ? "text-price font-semibold" : "text-text font-semibold"}>
      {formatNaira(amountKobo)}
    </span>
  );
}
```

```ts
// lib/format.ts
/** Money is stored as integer kobo. Display: "₦85,000" — kobo hidden unless non-zero (Club pricing). */
export function formatNaira(amountKobo: number): string {
  const naira = amountKobo / 100;
  const hasKobo = amountKobo % 100 !== 0;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: hasKobo ? 2 : 0,
    maximumFractionDigits: hasKobo ? 2 : 0,
  }).format(naira);
}
```

### 5.2 Feature Components (`features/*`)

Each is a composition of primitives + domain data. The key ones, mapped to the wireframes:

| Component | Wireframe source | Notes |
|---|---|---|
| `SiteHeader` | Utility bar + primary nav | Sticky; contains `PromoTicker`, `SearchBar` (predictive), account, saved, `BagIndicator`. Rendered once in the root layout. |
| `ProductCard` | Home "New In" rail, PLP grid | Image, name, `<Price>`, optional `<Tag>`s. Identical everywhere a product appears — home rail, PLP, cross-sell, brand page. |
| `ProductGrid` | PLP | 3 / 2 / 1 columns (desktop / tablet / mobile) via Tailwind responsive classes; "Load more" pagination. |
| `FilterRail` | PLP left rail | Client component. Filters (size, colour, fabric, price, brand) write to URL search params — shareable, no page reload. Collapses to a bottom sheet below `md`. |
| `BuyBox` | PDP | Sticky panel: name, `<Price>`, `SizeSelector`, `AddToBagButton`, save. |
| `SizeSelector` | PDP | Per-size stock state; out-of-stock sizes disabled **and** visibly labelled "Notify me". |
| `ProductTabs` | PDP | Details & Fabric · **Maker Story** (names the tailor/partner — the differentiator) · Delivery & Returns · Reviews. |
| `CompleteTheLook` | PDP | A `ProductRail` of `ProductCard`s — reuse, don't rebuild. |
| `PaymentMethodPicker` | Checkout | Radio group over `card \| bank_transfer \| ussd \| pod`; each renders its own detail panel. |
| `TierCard` | Club | Essentials / Signature / Bespoke; contents list + `<Price>` per month. |
| `BrandCard` / `StorefrontHeader` | Partner Brands | Directory grid and branded shop page shell. |

Example of the composition pattern — dumb card, smart page:

```tsx
// features/catalog/ProductCard.tsx  (server component — no client JS)
import Link from "next/link";
import Image from "next/image";
import { Price, Tag } from "@/components/ui";
import type { ProductSummary } from "@/types";

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-surface-alt">
        <Image
          src={product.image.url}
          alt={product.image.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform group-hover:scale-[1.02]"
        />
        {product.tags.length > 0 && (
          <div className="absolute left-2 top-2 flex gap-1">
            {product.tags.map((t) => <Tag key={t.kind} kind={t.kind} label={t.label} />)}
          </div>
        )}
      </div>
      <p className="mt-3 text-md text-text">{product.name}</p>
      <Price amountKobo={product.priceKobo} sale={product.onSale} />
    </Link>
  );
}
```

### 5.3 Cart Store — small and explicit

```ts
// features/cart/cart.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartLine { skuId: string; qty: number }

interface CartState {
  lines: CartLine[];
  add: (skuId: string, qty?: number) => void;
  setQty: (skuId: string, qty: number) => void;
  remove: (skuId: string) => void;
  clear: () => void;
}

/** Only SKU ids + quantities live on the client.
 *  Prices, stock, and delivery fees are always resolved server-side —
 *  the client is never trusted with money. */
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (skuId, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.skuId === skuId);
          return existing
            ? { lines: s.lines.map((l) => (l.skuId === skuId ? { ...l, qty: l.qty + qty } : l)) }
            : { lines: [...s.lines, { skuId, qty }] };
        }),
      setQty: (skuId, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.skuId !== skuId)
                          : s.lines.map((l) => (l.skuId === skuId ? { ...l, qty } : l)),
        })),
      remove: (skuId) => set((s) => ({ lines: s.lines.filter((l) => l.skuId !== skuId) })),
      clear: () => set({ lines: [] }),
    }),
    { name: "ag-cart" } // persists across session, per the doc
  )
);
```

---

## 6. Domain Model

Types are the contract between frontend, API, and database. Money is **integer kobo**, ids are opaque strings, enums are string unions.

```ts
// types/index.ts

export type CategorySlug =
  | "native-wears" | "english-wears" | "shoes-sandals"
  | "perfumery" | "socks-essentials";

export interface Brand {
  id: string;
  slug: string;
  name: string;
  story: string;
  isHouseLine: boolean;          // Flagship vs Partner
  commissionBps?: number;         // e.g. 2000 = 20% — partner brands only
  fulfilment: "brand" | "central";
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  subcategory: string;            // "agbada", "kaftan-senator", …
  brandId: string;
  description: string;
  fabric: string;
  makerStory: string;             // the differentiator tab — always populated
  images: { url: string; alt: string }[];
  skus: Sku[];
}

export interface Sku {
  id: string;
  productId: string;
  size: string;                   // "L", "43", "one-size"
  colour: string;
  priceKobo: number;
  compareAtKobo?: number;         // presence ⇒ on sale
  stock: number;
}

export type PaymentMethod = "card" | "bank_transfer" | "ussd" | "pod";

export type OrderStatus =
  | "pending_payment" | "paid" | "packed"
  | "dispatched" | "delivered" | "cancelled" | "refunded";

export interface Order {
  id: string;
  userId?: string;                // undefined ⇒ guest checkout
  lines: { skuId: string; qty: number; unitPriceKobo: number }[];
  deliveryFeeKobo: number;
  totalKobo: number;
  payment: PaymentMethod;
  status: OrderStatus;
  delivery: { name: string; phone: string; city: string; state: string; address: string };
  createdAt: string;
}

export type ClubTier = "essentials" | "signature" | "bespoke";

export interface ClubMembership {
  id: string;
  userId: string;
  tier: ClubTier;
  status: "active" | "paused" | "cancelled";
  preferences: { size: string; scent: string; skinType: string; palette: string[] };
  giftedBy?: string;
  nextDispatchDate: string;
}
```

**Key backend rules**

- **Prices are computed server-side, always.** Cart totals, delivery fees, and commission are calculated in an edge function against current SKU data; the client submits only `skuId + qty`.
- **Commission at settlement.** Each order line snapshots `commissionBps` at purchase time; the bi-weekly payout job aggregates by brand, net of returns.
- **Guest checkout is first-class.** `Order.userId` is optional; account creation is offered *after* confirmation, never gates payment.
- **Payments behind an interface:**

```ts
// lib/payments/gateway.ts
export interface PaymentGateway {
  initialise(order: Order, method: PaymentMethod): Promise<{ reference: string; next: PaymentNext }>;
  verify(reference: string): Promise<"paid" | "pending" | "failed">;
}
// PaymentNext = redirect URL (card), account details (transfer),
// USSD code string, or "collect_on_delivery" — the picker renders each accordingly.
```

---

## 7. Routing & Information Architecture

Seven top-level destinations, nothing more than three clicks from home (per the sitemap):

```
/                                → Homepage
/[category]                      → PLP        e.g. /native-wears
/[category]?sub=agbada&size=L    → filtered PLP (filters live in the URL)
/product/[slug]                  → PDP
/bag  ·  /checkout  ·  /checkout/confirmation/[orderId]
/partner-brands                  → directory (A–Z) + featured
/partner-brands/[brand]          → branded storefront
/partner-brands/apply            → application flow
/club                            → tiers      /club/past-boxes · /club/gift
/account                         → orders, saved items, club management (pause/skip/cancel)
```

Filters as URL search params buys us: shareable links, back-button correctness, server-rendered filtered grids, and zero custom filter-state plumbing.

---

## 8. Quality Bar

| Concern | Standard |
|---|---|
| Performance | PLP/PDP server-rendered; images via `next/image` with explicit `sizes`; target LCP < 2.5s on Fast 3G — the customer is often on mobile data. |
| Accessibility | WCAG 2.1 AA. 14px body-text floor, visible focus everywhere, tags always carry text labels, 44px minimum touch targets. |
| i18n/format | All Naira through `formatNaira()`; all dates through one `formatDeliveryWindow()`. Never hand-format. |
| Testing | Unit-test `formatNaira`, cart reducer, commission calc. Playwright: guest checkout happy path per payment method, filter → grid update, Club pause/skip/cancel. |
| Code review | PR fails if it introduces a raw hex/px value, a cross-feature import, or an untyped API response. |
| Naming | Match the glossary: PLP, PDP, buy-box, SKU. Code and doc speak the same language. |

---

## 9. Build Order (mirrors the roadmap)

Each phase is shippable on its own; 2 and 3 both stand on Phase 1's payments + fulfilment plumbing, so they are not reordered.

1. **Phase 1 — Flagship MVP:** tokens + `components/ui` → catalog (PLP/PDP) → cart → checkout (all four payment methods) → order tracking. *Definition of done: a guest buys an agbada with USSD and tracks it.*
2. **Phase 2 — Partner Marketplace:** brand application flow, storefront pages, order routing (brand vs central fulfilment), commission ledger + bi-weekly payout job, brand dashboard.
3. **Phase 3 — The Club:** subscription billing, preference profiles, monthly curation/packing workflow, self-service pause/skip/cancel, gifting.
4. **Phase 4 — Loyalty & Personalisation:** points, personalised homepage rails, native app (the token system and API contracts above are what make this phase cheap).

---

*Illustrative pricing throughout is from the source document and is not a commercial position. Payment provider selection is a technical decision made at Phase 1 kickoff behind the `PaymentGateway` interface.*
