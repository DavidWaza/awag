'use client';

import { useState } from 'react';
import { LoginForm } from '@/app/(auth)/login/LoginForm';
import { RegisterForm } from '@/app/(auth)/register/RegisterForm';
import { cn } from '@/lib/utils';

type Tab = 'signin' | 'join';

/**
 * The unauthenticated view of /account — an ASOS-style panel that toggles
 * between signing in and joining, reusing the existing credential forms. Both
 * redirect back to /account on success, where the dashboard then renders.
 */
export function AccountAuth() {
  const [tab, setTab] = useState<Tab>('signin');

  return (
    <div>
      <p className="label-utility text-center text-gold">My Account</p>

      <div className="mt-4 grid grid-cols-2 border-b border-border">
        <TabButton active={tab === 'signin'} onClick={() => setTab('signin')}>
          Sign In
        </TabButton>
        <TabButton active={tab === 'join'} onClick={() => setTab('join')}>
          Join AG
        </TabButton>
      </div>

      {tab === 'signin' ? (
        <div className="mt-6">
          <h1 className="font-display text-2xl font-bold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink/60">
            Sign in to track orders, save items, and reorder in one tap.
          </p>
          <LoginForm />
        </div>
      ) : (
        <div className="mt-6">
          <h1 className="font-display text-2xl font-bold text-ink">Create an account</h1>
          <p className="mt-1 text-sm text-ink/60">
            Join the Abuja Gentleman — guest checkout is always available too.
          </p>
          <RegisterForm />
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        '-mb-px border-b-2 pb-3 font-utility text-xs font-semibold uppercase tracking-utility transition-colors',
        active ? 'border-gold text-gold' : 'border-transparent text-ink/50 hover:text-ink',
      )}
    >
      {children}
    </button>
  );
}
