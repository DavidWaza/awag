export type UserRole = 'customer' | 'brand_partner' | 'admin';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** Present only for role === 'brand_partner'. */
  brandId?: string;
}
