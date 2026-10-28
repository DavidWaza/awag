/** Section 09 — Brand Partnership Model. */

export type BrandApplicationStatus =
  'submitted' | 'in_review' | 'terms_agreed' | 'storefront_setup' | 'live' | 'rejected';

export type FulfilmentModel = 'brand_ships' | 'ag_fulfilment_centre';

export interface PartnerBrand {
  id: string;
  slug: string;
  name: string;
  story: string;
  logoUrl: string;
  city: 'Abuja' | 'Lagos' | string;
  commissionRate: number; // 0.15–0.25 per Section 09, negotiated per brand
  fulfilmentModel: FulfilmentModel;
  payoutCycle: 'bi-weekly';
  status: BrandApplicationStatus;
  featured: boolean;
}
