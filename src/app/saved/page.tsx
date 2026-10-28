import type { Metadata } from 'next';
import { SavedCollection } from '@/components/account/SavedCollection';

export const metadata: Metadata = { title: 'Saved Items' };

export default function SavedPage() {
  return (
    <div className="container py-12">
      <SavedCollection />
    </div>
  );
}
