import { redirect } from 'next/navigation';

// The club now lives at /the-club (matching the primary nav). Keep this old
// path working by redirecting.
export default function ClubPage() {
  redirect('/the-club');
}
