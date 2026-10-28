# Abuja Gentleman

Curated menswear e-commerce, partner marketplace, and monthly club — built on
Next.js (App Router), TypeScript, and Tailwind CSS. Structure and copy are
derived from `Abuja_Gentleman_Platform_Documentation.pdf` v1.0.

## Stack

| Concern      | Choice                                          |
| ------------ | ------------------------------------------------ |
| Framework    | Next.js 16 (App Router, Turbopack)                |
| Language     | TypeScript, strict mode                           |
| Styling      | Tailwind CSS v3, CSS-variable-backed design tokens|
| Auth         | Auth.js (NextAuth v5) — credentials + Google       |
| Validation   | Zod                                               |
| Linting      | ESLint 9 flat config (native, not FlatCompat)     |
| Formatting   | Prettier + prettier-plugin-tailwindcss            |
| Variants     | class-variance-authority (cva)                    |

## Getting started

```bash
npm install
cp .env.example .env
# fill in AUTH_SECRET at minimum: openssl rand -base64 33
npm run dev
```

```bash
npm run lint       # eslint .
npm run format      # prettier --write .
npm run typecheck   # tsc --noEmit
npm run build       # production build
```

A pre-commit hook (husky + lint-staged) runs eslint + prettier on staged files.

## Folder structure

```
src/
  app/                     # App Router routes only — thin, compose from components/
    (auth)/login/          # Route groups for auth pages (no URL segment added)
    (auth)/register/
    (shop)/[category]/     # Dynamic category + sub-category PLPs
    (shop)/product/[slug]/ # PDP
    api/                   # Route handlers (auth, register)
    club/                  # The Club — membership tiers
    partner-brands/        # Marketplace landing + directory
    layout.tsx             # Root layout: fonts, Header/Footer, Providers
    providers.tsx          # Client-side context (SessionProvider)
    globals.css            # Tailwind layers + CSS variable palette

  components/
    ui/                    # Design-system primitives: Button, Badge, Price, Input, Card
    layout/                # Header, UtilityBar, Footer
    product/               # ProductCard, ProductGrid
    brand/, club/           # Feature-specific composites (add as they're built)

  lib/
    design-tokens.ts        # Canonical hex palette + typography — see below
    utils.ts                 # cn() classname merge, formatNaira()
    auth.ts                  # Auth.js config (single source — import from here only)
    constants/               # categories.ts (nav taxonomy), club-tiers.ts
    data/                    # MOCK_* fixtures — swap for real queries before launch

  types/                   # Domain types: Product, Category, PartnerBrand, ClubSubscription, AppUser

  proxy.ts                 # Route guard (Next.js 16's renamed `middleware.ts`)
```

**Rule of thumb:** `app/**/page.tsx` files fetch data and compose components;
they should rarely contain markup beyond layout wrappers. Presentational
logic belongs in `components/`, domain shape in `types/`, and static
reference data in `lib/constants/`.

## Specifying colour

Don't hardcode hex values in components. There is exactly one place brand
colour is defined:

1. **`src/lib/design-tokens.ts`** — the documented source of truth (hex
   values, commented with what each colour is for). Import this in any
   non-Tailwind context (charts, emails, native apps).
2. **`src/app/globals.css`** — the same palette, restated as HSL channels in
   CSS custom properties (`--color-forest`, `--color-gold`, etc.), because
   Tailwind's `hsl(var(--x) / <alpha-value>)` pattern is what makes opacity
   modifiers (`bg-forest/90`) and future theming (dark mode, seasonal palette
   swaps) work without touching component code.
3. **`tailwind.config.ts`** — maps Tailwind utility names (`bg-forest`,
   `text-gold`, `border-wine`) to those CSS variables.

If a colour ever changes, update **both** `design-tokens.ts` and
`globals.css` — nothing currently enforces the two staying in sync, so it's
called out with a comment in each file as a tripwire.

Palette (Section 06 of the platform doc):

| Token  | Hex       | Use                                  |
| ------ | --------- | ------------------------------------- |
| forest | `#1B4332` | Primary — nav, buttons                |
| gold   | `#C89B3C` | Accents, dividers, highlight state    |
| wine   | `#6B1E23` | Price emphasis, sale, destructive     |
| ivory  | `#F4EFE2` | Section backgrounds                   |
| ink    | `#211D1B` | Body text                             |

Accessibility floor (enforced, not just documented): body text never below
14px-equivalent, every interactive element has a visible focus ring
(`:focus-visible` in `globals.css`), and colour is never the only signal for
state — see `ProductTagBadges` in `components/ui/Badge.tsx`, where every tag
pairs a colour with a distinct text label.

## Components

All primitives live in `components/ui/` and are exported from a single
barrel (`components/ui/index.ts`). Variant logic uses `cva` so new visual
states are additive, typed, and don't require prop-drilling booleans:

```tsx
<Button variant="secondary" size="lg">Add to Saved Items</Button>
<Badge variant="clubExclusive">Club Exclusive</Badge>
<Price amountNaira={85000} compareAtNaira={95000} size="lg" />
```

Feature composites (`ProductCard`, `ProductGrid`, `Header`, `Footer`) build
on these primitives and live next to the feature they serve
(`components/product/`, `components/layout/`).

## Category & brand data

The seven-destination taxonomy from Section 03 is a single typed constant —
`src/lib/constants/categories.ts` — consumed by the primary nav, the
homepage category tiles, and the dynamic `[category]/[subcategory]` routes.
Changing the taxonomy (adding a sub-category, renaming a destination) means
editing this one file.

Product, brand, and club data currently comes from `src/lib/data/*` fixture
files (clearly marked `MOCK_*`). Replace their internals with real
queries (Prisma, a headless CMS, whatever's chosen) without needing to touch
any component — pages call `getFeaturedProducts()`, `getProductBySlug()`,
etc., not the fixtures directly.

## Authentication

Auth.js v5 (`src/lib/auth.ts`) is wired for credentials (email/password) and
Google OAuth, with `role` (`customer` | `brand_partner` | `admin`) carried
through the JWT and session (see `types/next-auth.d.ts` for the module
augmentation). `src/proxy.ts` (Next.js 16's renamed `middleware.ts`) guards
`/account/*` and `/partner-brands/dashboard/*` only — **guest checkout stays
unauthenticated end-to-end**, per Section 05/07 of the platform doc.

`authorize()` in `auth.ts` and the credential-checking logic in
`api/register/route.ts` currently have `TODO`s where a real database call
(with password hashing — argon2 or bcrypt, never plaintext) needs to go in.

## Linting note

`eslint.config.mjs` calls each plugin's native flat-config export directly
(`@next/eslint-plugin-next`, `eslint-plugin-react-hooks`, `typescript-eslint`)
rather than bridging `eslint-config-next`'s legacy shareable config through
`FlatCompat`. As of `eslint-config-next@16` + `eslint@9`, that bridge throws
`Converting circular structure to JSON` — a known interaction between
`eslint-plugin-react`'s self-referencing flat config and the legacy
validator's error-formatting path. This file was verified to lint,
typecheck, and build clean.

## What's stubbed vs. real

Fully wired: nav/taxonomy, design tokens, Button/Badge/Price/Input/Card,
ProductCard/Grid, PDP/PLP layout, Club tiers page, Partner Brands landing,
login/register forms + credentials auth flow, route protection.

Intentionally stubbed (marked `TODO` in-file): database layer (no ORM
opinion imposed), password hashing, payment provider integration
(Paystack/Flutterwave env vars are scaffolded in `.env.example` but unwired),
delivery-fee calculation, and the PLP filter facets (UI shell exists in
`FilterRailPlaceholder`, not yet backed by `searchParams`).
