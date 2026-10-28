import type { PartnerBrand } from '@/types/brand';

/** Dev-only fixture — replace with a real brand-partner data source. */
export const MOCK_BRANDS: PartnerBrand[] = [
  {
    id: 'brand_kaduna_threads',
    slug: 'kaduna-threads',
    name: 'Kaduna Threads',
    story: 'Three generations of native wear tailoring, now shipping nationwide.',
    logoUrl: '/kaduna-threads.jpg',
    city: 'Abuja',
    commissionRate: 0.2,
    fulfilmentModel: 'brand_ships',
    payoutCycle: 'bi-weekly',
    status: 'live',
    featured: true,
  },
  {
    id: 'brand_lagos_sartorial',
    slug: 'lagos-sartorial',
    name: 'Lagos Sartorial',
    story: 'Sharp English tailoring cut for the Nigerian boardroom.',
    logoUrl: '/lagos-sartorial.jpg',
    city: 'Lagos',
    commissionRate: 0.22,
    fulfilmentModel: 'ag_fulfilment_centre',
    payoutCycle: 'bi-weekly',
    status: 'live',
    featured: true,
  },
  {
    id: 'brand_abuja_bespoke',
    slug: 'abuja-bespoke',
    name: 'Abuja Bespoke',
    story: 'Made-to-measure agbada and kaftan, finished in 72 hours.',
    logoUrl: '/abuja-bespoke.jpg',
    city: 'Abuja',
    commissionRate: 0.18,
    fulfilmentModel: 'brand_ships',
    payoutCycle: 'bi-weekly',
    status: 'live',
    featured: false,
  },
  {
    id: 'brand_sahel_leatherworks',
    slug: 'sahel-leatherworks',
    name: 'Sahel Leatherworks',
    story: 'Hand-tooled leather shoes and belts from Kano artisans.',
    logoUrl: '/kano-fits.jpg',
    city: 'Kano',
    commissionRate: 0.2,
    fulfilmentModel: 'brand_ships',
    payoutCycle: 'bi-weekly',
    status: 'live',
    featured: true,
  },
  {
    id: 'brand_naija_scent_co',
    slug: 'naija-scent-co',
    name: 'Naija Scent Co',
    story: 'Small-batch oud and attar blended in Lagos.',
    logoUrl: '/oud.jpg',
    city: 'Lagos',
    commissionRate: 0.25,
    fulfilmentModel: 'ag_fulfilment_centre',
    payoutCycle: 'bi-weekly',
    status: 'live',
    featured: false,
  },
];

export function getFeaturedBrands(): PartnerBrand[] {
  return MOCK_BRANDS.filter((brand) => brand.featured);
}

/** All live brands — powers the homepage "Shop by Brand" selector. */
export function getAllBrands(): PartnerBrand[] {
  return MOCK_BRANDS.filter((brand) => brand.status === 'live');
}
