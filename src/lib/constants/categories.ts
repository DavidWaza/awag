import type { Category } from '@/types/category';

/**
 * Source of truth for primary navigation + PLP taxonomy.
 * Matches Section 03 ("Site Architecture & Navigation") exactly. If the
 * commercial team changes the taxonomy, update this file only — nav,
 * sitemap, and category pages all read from here.
 */
export const CATEGORIES: Category[] = [
  {
    slug: 'native-wears',
    name: 'Native Wears',
    isProgramme: false,
    image: '/download.png',
    subCategories: [
      { slug: 'agbada', name: 'Agbada' },
      { slug: 'kaftan-and-senator', name: 'Kaftan & Senator' },
      { slug: 'dashiki', name: 'Dashiki' },
      { slug: 'native-trousers', name: 'Native Trousers' },
      { slug: 'fila-and-caps', name: 'Fila & Caps' },
    ],
  },
  {
    slug: 'english-wears',
    name: 'English Wears',
    isProgramme: false,
    image: '/english-cat.jpg',
    subCategories: [
      { slug: 'suits-and-blazers', name: 'Suits & Blazers' },
      { slug: 'shirts', name: 'Shirts' },
      { slug: 'trousers', name: 'Trousers' },
      { slug: 'polos-and-knitwear', name: 'Polos & Knitwear' },
    ],
  },
  {
    slug: 'shoes-and-sandals',
    name: 'Shoes & Sandals',
    isProgramme: false,
    image: '/loafers.jpg',
    subCategories: [
      { slug: 'corporate-shoes', name: 'Corporate Shoes' },
      {
        slug: 'native-sandals-and-palm-slippers',
        name: 'Native Sandals & Palm Slippers',
      },
      { slug: 'loafers-and-sneakers', name: 'Loafers & Sneakers' },
    ],
  },
  {
    slug: 'perfumery',
    name: 'Perfumery',
    isProgramme: false,
    image: '/pefume.jpg',
    subCategories: [
      { slug: 'colognes', name: 'Colognes' },
      { slug: 'body-spray', name: 'Body Spray' },
      { slug: 'oud-and-attar', name: 'Oud & Attar' },
    ],
  },
  {
    slug: 'socks-and-essentials',
    name: 'Socks & Essentials',
    isProgramme: false,
    image: '/socks.jpg',
    subCategories: [
      { slug: 'socks', name: 'Socks' },
      { slug: 'ties-and-bowties', name: 'Ties & Bowties' },
      { slug: 'belts-and-cufflinks', name: 'Belts & Cufflinks' },
      { slug: 'pocket-squares', name: 'Pocket Squares' },
    ],
  },
  {
    slug: 'partner-brands',
    name: 'Partner Brands',
    isProgramme: true,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
    subCategories: [
      { slug: 'brand-directory', name: 'Brand Directory (A–Z)' },
      { slug: 'featured-storefronts', name: 'Featured Storefronts' },
      { slug: 'apply-to-sell', name: 'Apply to Sell' },
    ],
  },
  {
    slug: 'the-club',
    name: 'The Club',
    isProgramme: true,
    image: 'https://images.unsplash.com/photo-1610384104075-e05c8cf200c3?w=800&q=80',
    subCategories: [
      { slug: 'membership-tiers', name: 'Membership Tiers' },
      { slug: 'past-boxes', name: 'Past Boxes' },
      { slug: 'gift-a-membership', name: 'Gift a Membership' },
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}
