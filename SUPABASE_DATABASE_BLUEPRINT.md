# Abuja Gentleman — Supabase Database Blueprint

> Source of truth for designing the Postgres schema on Supabase for the full e-commerce platform.
> Derived from the live TypeScript types, mock data, client stores, Auth.js setup, PLP facets, and account/club/partner flows in this repo.
>
> **Stack today:** Next.js App Router · Auth.js · Tailwind · localStorage carts/wishlist (no database yet).
> **Goal of this doc:** stand up Supabase Auth + Postgres + Storage + RLS so the mocks in `src/lib/data/*` can be replaced.

---

## 1. Product overview

**Abuja Gentleman** is a curated menswear e-commerce site for Nigerian gentlemen with three pillars:

| Pillar | Description |
|--------|-------------|
| **Flagship store** | House-line catalogue — native wears, English wears, shoes, perfumery, socks & essentials |
| **Partner marketplace** | Vetted Abuja / Lagos (+ other) brands on a negotiated commission / revenue-share model |
| **The Club** | Monthly subscription box — Essentials / Signature / Bespoke |

Commerce model matches an ASOS-like UX: guest checkout, size-first PDP, URL-driven PLP facets, made-to-measure (MTM) for native & English wears.

---

## 2. Design decisions (lock these before migrating)

| Decision | Recommendation | Rationale |
|----------|-----------------|-----------|
| **Money** | Store as **integer Naira** (`price_naira`) for now — match live code | App types use whole Naira (`priceNaira`). Convert to kobo later if needed with a migration |
| **IDs** | `uuid` primary keys; keep `slug` unique where public | Maps cleanly to Supabase; allow human-readable URLs |
| **House products** | `products.brand_id` **NULL** = AG house line | Matches `brandId: string \| null` |
| **Guest checkout** | `orders.user_id` **nullable**; store delivery snapshot on order | Guest is first-class |
| **Cart lines** | Reference `sku_id` + optional `measurements` jsonb | MTM variants are distinct lines |
| **Commission** | Negotiated rate on `brands`; **snapshot** on each `order_items` row at purchase | Payouts must survive brand rate changes |
| **Auth** | Prefer **Supabase Auth**; keep `public.profiles` for AG-specific fields | Sync on `auth.users` insert via trigger |
| **Images** | Supabase Storage buckets + `product_images` / `brand.logo_url` | Public CDN URLs |

---

## 3. Domain map (entities)

```
auth.users ─── profiles ────┬── addresses
                            ├── measurement_profiles
                            ├── wishlists ── products
                            ├── carts ── cart_items ── skus
                            ├── club_subscriptions ── club_tiers
                            ├── orders ── order_items ── skus
                            └── payment_methods (tokens)

categories ── subcategories
brands ── products ── skus
                   ├── product_images
                   ├── product_tags
                   ├── maker_stories
                   └── product_cross_sells (complete the look)

orders ── payments / shipments / returns
brands ── brand_applications / commission_payouts
newsletter_subscribers / hero_slides (CMS-lite)
```

---

## 4. Enums (Postgres)

```sql
-- Users
create type user_role as enum ('customer', 'brand_partner', 'admin');

-- Catalogue
create type product_tag as enum ('new', 'sale', 'club-exclusive', 'partner-brand');
create type fit_preference as enum ('Slim', 'Tailored', 'Relaxed');

-- Marketplace
create type brand_status as enum (
  'submitted', 'in_review', 'terms_agreed', 'storefront_setup', 'live', 'rejected'
);
create type fulfilment_model as enum ('brand_ships', 'ag_fulfilment_centre');
create type payout_cycle as enum ('bi-weekly');

-- Club
create type club_tier as enum ('essentials', 'signature', 'bespoke');
create type club_subscription_status as enum ('active', 'paused', 'cancelled');

-- Commerce
create type payment_method as enum ('card', 'bank_transfer', 'ussd', 'pod');
create type order_status as enum (
  'pending_payment', 'paid', 'packed', 'dispatched', 'delivered', 'cancelled', 'refunded'
);
create type return_status as enum (
  'requested', 'approved', 'rejected', 'received', 'refunded'
);
```

### Category slug set (app constants)

Use a `categories.slug` check constraint or seed-only table (not a rigid enum so commercial can add rows without migrations):

`native-wears` · `english-wears` · `shoes-and-sandals` · `perfumery` · `socks-and-essentials` · `partner-brands` · `the-club`

Programme rows: `partner-brands`, `the-club` → `is_programme = true`.

---

## 5. Table schemas

### 5.1 `profiles` (extends Supabase Auth)

```sql
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  name          text not null,
  email         text not null unique,
  role          user_role not null default 'customer',
  brand_id      uuid references public.brands (id), -- only when role = brand_partner
  phone         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
```

### 5.2 Taxonomy — `categories` / `subcategories`

```sql
create table public.categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  is_programme  boolean not null default false,
  image_url     text not null,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

create table public.subcategories (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.categories (id) on delete cascade,
  slug          text not null,
  name          text not null,
  sort_order    int not null default 0,
  unique (category_id, slug)
);
```

**Seed tree (from `src/lib/constants/categories.ts`):**

| Category | Subcategories |
|----------|---------------|
| Native Wears | Agbada, Kaftan & Senator, Dashiki, Native Trousers, Fila & Caps |
| English Wears | Suits & Blazers, Shirts, Trousers, Polos & Knitwear |
| Shoes & Sandals | Corporate Shoes, Native Sandals & Palm Slippers, Loafers & Sneakers |
| Perfumery | Colognes, Body Spray, Oud & Attar |
| Socks & Essentials | Socks, Ties & Bowties, Belts & Cufflinks, Pocket Squares |
| Partner Brands *(programme)* | Brand Directory, Featured Storefronts, Apply to Sell |
| The Club *(programme)* | Membership Tiers, Past Boxes, Gift a Membership |

### 5.3 `brands` (partner + directory)

```sql
create table public.brands (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  name               text not null,
  story              text not null,
  logo_url           text not null,
  city               text not null,
  commission_rate    numeric(4,3) not null check (commission_rate >= 0.15 and commission_rate <= 0.25),
  fulfilment_model   fulfilment_model not null,
  payout_cycle       payout_cycle not null default 'bi-weekly',
  status             brand_status not null default 'submitted',
  featured           boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
```

House catalogue products do **not** need a brand row (`products.brand_id` null). Optional: create a synthetic “Abuja Gentleman (House)” brand later for simpler joins; PLP currently uses facet slug `house`.

### 5.4 `products` / `skus` / media / tags

```sql
create table public.products (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  name               text not null,
  category_id        uuid not null references public.categories (id),
  subcategory_id     uuid not null references public.subcategories (id),
  brand_id           uuid references public.brands (id), -- null = house
  description        text not null,
  fabric             text,
  is_active          boolean not null default true,
  -- denormalised rating cache (recompute from reviews)
  rating_average     numeric(3,2),
  rating_count       int not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table public.skus (
  id                      uuid primary key default gen_random_uuid(),
  product_id              uuid not null references public.products (id) on delete cascade,
  size                    text not null,          -- S–XXL, numeric shoe, "100ml", "One size"
  colour                  text not null,
  colour_slug             text not null,          -- emerald, navy… for PLP facets
  stock                   int not null default 0 check (stock >= 0),
  price_naira             int not null check (price_naira >= 0),
  compare_at_price_naira  int check (compare_at_price_naira is null or compare_at_price_naira >= price_naira),
  is_active               boolean not null default true,
  unique (product_id, size, colour)
);

create table public.product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products (id) on delete cascade,
  url           text not null,
  alt           text,
  sort_order    int not null default 0
);

create table public.product_tags (
  product_id    uuid not null references public.products (id) on delete cascade,
  tag           product_tag not null,
  primary key (product_id, tag)
);

create table public.maker_stories (
  product_id    uuid primary key references public.products (id) on delete cascade,
  maker_name    text not null,
  location      text not null,
  narrative     text not null
);

create table public.product_cross_sells (
  product_id          uuid not null references public.products (id) on delete cascade,
  related_product_id  uuid not null references public.products (id) on delete cascade,
  sort_order          int not null default 0,
  primary key (product_id, related_product_id),
  check (product_id <> related_product_id)
);

-- Optional reviews (supports rating_average / rating_count)
create table public.reviews (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products (id) on delete cascade,
  user_id       uuid not null references public.profiles (id) on delete cascade,
  rating        int not null check (rating between 1 and 5),
  body          text,
  created_at    timestamptz not null default now(),
  unique (product_id, user_id)
);
```

**MTM eligibility (app rule):** only products whose category slug is `native-wears` or `english-wears`. Enforce in API, not necessarily DB.

### 5.5 Measurements profile & wishlist

```sql
create table public.measurement_profiles (
  user_id       uuid primary key references public.profiles (id) on delete cascade,
  fit           fit_preference not null default 'Tailored',
  notes         text not null default '',
  -- keys: neck, shoulder, chest, stomach, topLength, sleeveLength, roundSleeve, wrist,
  --        waist, hip, thigh, trouserLength, trouserMouth  (inches as strings/numbers)
  values        jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now()
);

create table public.wishlists (
  user_id       uuid not null references public.profiles (id) on delete cascade,
  product_id    uuid not null references public.products (id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (user_id, product_id)
);
```

### 5.6 Carts

```sql
create table public.carts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid unique references public.profiles (id) on delete cascade, -- null = anonymous
  guest_token   text unique,  -- cookie id for guests
  updated_at    timestamptz not null default now(),
  check (user_id is not null or guest_token is not null)
);

create table public.cart_items (
  id              uuid primary key default gen_random_uuid(),
  cart_id         uuid not null references public.carts (id) on delete cascade,
  sku_id          uuid not null references public.skus (id),
  qty             int not null check (qty > 0),
  measurements    jsonb,  -- same shape as MeasurementCustomizer / CartLineItem
  created_at      timestamptz not null default now(),
  -- MTM standard vs custom: treat null measurements as "std"
  unique (cart_id, sku_id, measurements)
);
```

Client cart line id pattern today: `` `${skuId}#${JSON.stringify(measurements)|'std'}` `` — the unique constraint above mirrors that.

### 5.7 Addresses & preferences

```sql
create table public.addresses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  label         text,                 -- Home / Office
  full_name     text not null,
  phone         text not null,
  line1         text not null,
  line2         text,
  city          text not null,
  state         text not null,
  country       text not null default 'NG',
  is_default    boolean not null default false,
  created_at    timestamptz not null default now()
);

create table public.contact_preferences (
  user_id           uuid primary key references public.profiles (id) on delete cascade,
  email_marketing   boolean not null default true,
  sms_marketing     boolean not null default false,
  club_updates      boolean not null default true,
  updated_at        timestamptz not null default now()
);
```

### 5.8 Orders, payments, shipments, returns

```sql
create table public.orders (
  id                  uuid primary key default gen_random_uuid(),
  order_number        text not null unique,           -- human-facing e.g. AG-2026-000142
  user_id             uuid references public.profiles (id), -- null = guest
  status              order_status not null default 'pending_payment',
  -- money (whole Naira)
  subtotal_naira      int not null,
  delivery_fee_naira  int not null default 0,
  discount_naira      int not null default 0,
  total_naira         int not null,
  currency            text not null default 'NGN',
  -- delivery snapshot (immutable after place)
  delivery_name       text not null,
  delivery_phone      text not null,
  delivery_line1      text not null,
  delivery_line2      text,
  delivery_city       text not null,
  delivery_state      text not null,
  delivery_notes      text,
  -- free Abuja delivery rule: subtotal >= 50000 → fee 0 (enforce in API)
  is_club_member_order boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table public.order_items (
  id                      uuid primary key default gen_random_uuid(),
  order_id                uuid not null references public.orders (id) on delete cascade,
  sku_id                  uuid not null references public.skus (id),
  product_id              uuid not null references public.products (id),
  brand_id                uuid references public.brands (id),
  product_name_snapshot   text not null,
  size_snapshot           text not null,
  colour_snapshot         text not null,
  qty                     int not null check (qty > 0),
  unit_price_naira        int not null,
  compare_at_naira        int,
  commission_rate         numeric(4,3),  -- snapshot for partner lines; null for house
  measurements            jsonb,
  created_at              timestamptz not null default now()
);

create table public.payments (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders (id),
  method          payment_method not null,
  provider        text,                 -- paystack | flutterwave | …
  provider_ref    text,
  amount_naira    int not null,
  status          text not null,        -- pending | success | failed
  raw_payload     jsonb,
  paid_at         timestamptz,
  created_at      timestamptz not null default now()
);

create table public.shipments (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders (id),
  carrier         text,
  tracking_code   text,
  status          text not null default 'pending',
  dispatched_at   timestamptz,
  delivered_at    timestamptz,
  created_at      timestamptz not null default now()
);

create table public.returns (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders (id),
  user_id         uuid references public.profiles (id),
  status          return_status not null default 'requested',
  reason          text,
  created_at      timestamptz not null default now()
);

create table public.return_items (
  id              uuid primary key default gen_random_uuid(),
  return_id       uuid not null references public.returns (id) on delete cascade,
  order_item_id   uuid not null references public.order_items (id),
  qty             int not null check (qty > 0)
);

-- Saved cards / wallets (tokenised — never store PAN)
create table public.payment_methods (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles (id) on delete cascade,
  provider        text not null,
  token           text not null,
  brand           text,           -- visa, mastercard
  last4           text,
  exp_month       int,
  exp_year        int,
  is_default      boolean not null default false,
  created_at      timestamptz not null default now()
);
```

**Business rules to encode in Edge Functions / server actions:**

| Rule | Value |
|------|-------|
| Free delivery (bag UI) | Subtotal ≥ **₦50,000** → free in **Abuja** |
| Club members | Free nationwide delivery claim for box + store orders |
| Prices | Always resolve server-side from `skus`; never trust client totals |
| Tax / VAT | Not modelled yet — add `tax_naira` later if required |

### 5.9 The Club

```sql
create table public.club_tiers (
  tier                    club_tier primary key,
  name                    text not null,
  tagline                 text not null,
  price_naira             int not null,
  whats_inside            text[] not null,
  featured                boolean not null default false,
  is_active               boolean not null default true
);

create table public.club_addons (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  description     text not null,
  price_naira     int not null,
  is_active       boolean not null default true
);

create table public.club_subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references public.profiles (id),
  tier                    club_tier not null references public.club_tiers (tier),
  status                  club_subscription_status not null default 'active',
  -- preferences (from ClubJoin)
  size                    text not null,
  scent_preference        text not null,  -- Fresh | Woody | Oud | Citrus | Spicy
  skin_type               text not null,  -- Normal | Dry | Oily | Combination | Sensitive
  style_palette           text[] not null default '{}',
  next_billing_date       date not null,
  next_dispatch_date      date,
  gift_recipient_email    text,
  gifted_by_user_id       uuid references public.profiles (id),
  started_at              timestamptz not null default now(),
  cancelled_at            timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create table public.club_subscription_addons (
  subscription_id   uuid not null references public.club_subscriptions (id) on delete cascade,
  addon_id          uuid not null references public.club_addons (id),
  primary key (subscription_id, addon_id)
);

-- Optional: each monthly box shipment
create table public.club_boxes (
  id                uuid primary key default gen_random_uuid(),
  subscription_id   uuid not null references public.club_subscriptions (id),
  period_label      text not null,      -- e.g. "2026-07"
  status            text not null,      -- scheduled | packed | shipped | delivered | skipped
  shipped_at        timestamptz,
  created_at        timestamptz not null default now()
);
```

**Seed tier prices (illustrative — from `club-tiers.ts`):**

| Tier | ₦ / month | Featured |
|------|-----------|----------|
| essentials | 12,000 | no |
| signature | 22,000 | yes |
| bespoke | 40,000 | no |

**Seed addons:** Styling session ₦15,000 · Express MTM ₦20,000 · Home fitting (Abuja) ₦10,000 · Gift wrap ₦3,500.

### 5.10 Brand applications & payouts

```sql
create table public.brand_applications (
  id              uuid primary key default gen_random_uuid(),
  brand_id        uuid references public.brands (id),
  applicant_name  text not null,
  applicant_email text not null,
  company_name    text not null,
  city            text not null,
  story           text not null,
  status          brand_status not null default 'submitted',
  notes           text,
  created_at      timestamptz not null default now()
);

create table public.commission_payouts (
  id              uuid primary key default gen_random_uuid(),
  brand_id        uuid not null references public.brands (id),
  period_start    date not null,
  period_end      date not null,
  gross_naira     int not null,
  commission_naira int not null,
  returns_naira   int not null default 0,
  net_naira       int not null,
  status          text not null default 'pending', -- pending | paid
  paid_at         timestamptz,
  created_at      timestamptz not null default now()
);
```

### 5.11 Marketing / CMS-lite

```sql
create table public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  source        text default 'homepage',
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table public.hero_slides (
  id            uuid primary key default gen_random_uuid(),
  image_url     text not null,
  alt           text not null,
  label         text not null,
  title         text not null,
  cta_label     text not null,
  cta_href      text not null,
  sort_order    int not null default 0,
  is_active     boolean not null default true
);
```

---

## 6. Indexes (minimum for PLP & account)

```sql
create index products_category_id_idx on public.products (category_id);
create index products_subcategory_id_idx on public.products (subcategory_id);
create index products_brand_id_idx on public.products (brand_id);
create index skus_product_id_idx on public.skus (product_id);
create index skus_colour_slug_idx on public.skus (colour_slug);
create index skus_size_idx on public.skus (size);
create index skus_price_naira_idx on public.skus (price_naira);
create index orders_user_id_idx on public.orders (user_id);
create index order_items_brand_id_idx on public.order_items (brand_id);
create index wishlists_user_id_idx on public.wishlists (user_id);
```

**PLP filters (URL params → SQL):**

| Query param | Column / join |
|-------------|----------------|
| `size` | `skus.size` |
| `colour` | `skus.colour_slug` |
| `brand` | `brands.slug` or `products.brand_id is null` for `house` |
| `min` / `max` | min SKU `price_naira` per product |
| `sort` | `new` (created_at), `price_asc`, `price_desc`, `brand` |
| `page` | page size **24** |

---

## 7. Storage buckets

| Bucket | Purpose | Public |
|--------|---------|--------|
| `product-images` | PDP / PLP gallery | yes |
| `brand-logos` | Partner storefronts | yes |
| `category-images` | Nav / mega-menu tiles | yes |
| `hero` | Homepage campaign slides | yes |
| `private-docs` | Brand applications / KYC | **no** |

Store object paths in DB; serve via Supabase public URL or CDN.

---

## 8. Row Level Security (RLS) sketch

Enable RLS on all public tables. Typical policies:

| Table | Select | Insert / Update |
|-------|--------|-----------------|
| `products`, `skus`, `categories`, `brands` (live) | Public read where `is_active` / `status = live` | Admin / brand_partner (own brand only) |
| `profiles` | Own row | Own row |
| `addresses`, `wishlists`, `measurement_profiles`, `carts` | Own user | Own user |
| `orders` | Own `user_id` **or** guest access via signed order token | Insert via service role / checkout Edge Function |
| `club_subscriptions` | Own user | Own user (pause/cancel); billing via service role |
| `brand_*` partner dashboards | `profiles.brand_id = brands.id` | Same |
| Admin | Bypass via `role = admin` claim or service role |

Checkout, stock decrement, and payment webhooks should use the **service role** on the server — never expose it to the browser.

---

## 9. Auth sync trigger

```sql
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'customer'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

Register API fields today: `name`, `email`, `password` (≥ 8). Google OAuth is already scaffolded in Auth.js — map to Supabase Auth providers when migrating.

---

## 10. Client store → DB migration map

| localStorage key | Shape today | Supabase home |
|------------------|-------------|----------------|
| `ag-cart` | `{ id, skuId, qty, measurements? }[]` | `carts` + `cart_items` |
| `ag-wishlist` | `productId[]` | `wishlists` |
| `ag-club-membership` | full `ClubSubscription` | `club_subscriptions` |
| `ag-measurements` | `{ fit, notes, values }` | `measurement_profiles` |

Merge guest cart into user cart on first login.

---

## 11. TypeScript entity → table quick reference

| App type (`src/types` / stores) | Table(s) |
|---------------------------------|----------|
| `Product` | `products` + images/tags/maker |
| `Sku` | `skus` |
| `PartnerBrand` | `brands` |
| `Category` / `SubCategory` | `categories` / `subcategories` |
| `AppUser` / session role | `profiles` |
| `ClubSubscription` | `club_subscriptions` |
| `ClubTierDefinition` | `club_tiers` |
| `ClubAddon` | `club_addons` |
| `CartLineItem` | `cart_items` |
| `Measurements` | `measurement_profiles` (+ line snapshot) |
| Order (engineering guide) | `orders` + `order_items` + `payments` |

---

## 12. Suggested migration order

1. Enums  
2. `categories` → `subcategories` → seed taxonomy  
3. `brands` → seed partners  
4. `products` → `skus` → images / tags / maker stories  
5. `profiles` + auth trigger  
6. Addresses, measurements, wishlists, carts  
7. Club tables + seed tiers/addons  
8. Orders / payments / shipments / returns  
9. Brand applications + commission payouts  
10. Newsletter + hero slides  
11. Storage buckets + RLS policies  
12. Seed from `src/lib/data/products.ts` & `brands.ts`

---

## 13. Example seed brands (from mocks)

| Slug | City | Commission | Fulfilment | Featured |
|------|------|------------|------------|----------|
| `kaduna-threads` | Abuja | 0.20 | brand_ships | yes |
| `lagos-sartorial` | Lagos | 0.22 | ag_fulfilment_centre | yes |
| `abuja-bespoke` | Abuja | 0.18 | brand_ships | no |
| `sahel-leatherworks` | Kano | 0.20 | brand_ships | yes |
| `naija-scent-co` | Lagos | 0.25 | ag_fulfilment_centre | no |

Status for all live mocks: `live`.

---

## 14. Colour swatches (PLP)

| Slug | Hex (app) |
|------|-----------|
| emerald | (see `src/lib/plp/query.ts`) |
| black | |
| navy | |
| amber | |
| tan | |
| burgundy | |
| white | |

Unknown colours fall back to `#999999`. Store `colour_slug` on SKUs; optional `colour_hex` lookup table if you want DB-owned swatches.

---

## 15. Out of scope / stubbed fronts (still need tables)

These routes exist as UI stubs or footer links — include tables now so you don’t migrate twice:

- `/checkout` (+ confirmation)
- `/account/orders`, `/returns`, `/details`, `/addresses`, `/payments`, `/preferences`
- `/partner-brands/apply-to-sell`, `/partner-brands/dashboard/*`
- Club past boxes / gift membership
- `/delivery`, `/returns`, `/size-guide`, `/contact`, `/about`, `/terms`, `/privacy`

---

## 16. Files to re-read when implementing

| Area | Path |
|------|------|
| Product / SKU | `src/types/product.ts`, `src/lib/data/products.ts` |
| Brands | `src/types/brand.ts`, `src/lib/data/brands.ts` |
| Categories | `src/types/category.ts`, `src/lib/constants/categories.ts` |
| Club | `src/types/club.ts`, `src/lib/constants/club-tiers.ts`, `src/components/club/ClubJoin.tsx` |
| MTM | `src/lib/catalog/measurements.ts` |
| Cart / bag rules | `src/lib/store/cart.ts`, `src/components/cart/BagView.tsx` |
| PLP | `src/lib/plp/searchParams.ts`, `src/lib/plp/query.ts` |
| Auth | `src/lib/auth.ts`, `src/app/api/register/route.ts` |
| Account destinations | `src/app/account/page.tsx` |
| Prior engineering notes | `ABUJA_GENTLEMAN_ENGINEERING_GUIDE.md` |

---

*Generated for Supabase schema design. Prefer keeping money as integer Naira until a global kobo conversion is planned; always snapshot prices and commission on order lines.*
