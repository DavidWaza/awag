import Link from 'next/link';
import { RegisterForm } from './RegisterForm';

export const metadata = { title: 'Create Account' };

export default function RegisterPage() {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="relative w-full max-w-sm overflow-hidden rounded-md border border-gold/25 bg-surface p-8">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
        />
        <p className="label-utility text-gold">Join AG</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">Create an account</h1>
        <p className="mt-1 text-sm text-ink/60">
          Save addresses, track orders, and reorder in one tap.
        </p>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-ink/50">
          Already a member?{' '}
          <Link href="/login" className="text-forest hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
