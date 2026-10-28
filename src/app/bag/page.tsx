import type { Metadata } from 'next';
import { BagView } from '@/components/cart/BagView';

export const metadata: Metadata = { title: 'Shopping Bag' };

export default function BagPage() {
  return (
    <div className="container py-12">
      <BagView />
    </div>
  );
}
