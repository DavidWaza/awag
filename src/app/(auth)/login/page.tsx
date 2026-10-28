import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from './LoginForm';

export const metadata = { title: 'Log In' };

export default function LoginPage() {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="relative w-full max-w-sm overflow-hidden rounded-md border border-gold/25 bg-surface p-8">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
        />
        <p className="label-utility text-gold">Members</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">Log in</h1>
        <p className="mt-1 text-sm text-ink/60">
          Guest checkout is always available — an account just makes reordering faster.
        </p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-ink/50">
          New here?{' '}
          <Link href="/register" className="text-forest hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
