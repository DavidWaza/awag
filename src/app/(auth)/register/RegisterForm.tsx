'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.message ?? 'Something went wrong creating your account.');
      setIsSubmitting(false);
      return;
    }

    await signIn('credentials', {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });

    window.location.assign('/account');
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
      <Input label="Full name" name="name" required autoComplete="name" />
      <Input label="Email" name="email" type="email" required autoComplete="email" />
      <Input
        label="Password"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
      />
      {error && (
        <p role="alert" className="text-sm text-wine">
          {error}
        </p>
      )}
      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        Create Account
      </Button>
    </form>
  );
}
