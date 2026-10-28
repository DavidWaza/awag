'use client';

import * as React from 'react';
import { ArrowRight, Mail } from 'lucide-react';

/**
 * Email capture for the exclusive-deals list. Stubbed submit for now — wire
 * to `/api/newsletter` (or your ESP) when the integration lands; the success
 * state and validation shell are already here.
 */
export function NewsletterSignup() {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'done'>('idle');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');

    // TODO: POST the email to the newsletter provider.
    await new Promise((resolve) => setTimeout(resolve, 600));

    setStatus('done');
  }

  if (status === 'done') {
    return (
      <p role="status" className="font-display text-lg text-ink">
        You&apos;re in. Watch your inbox for members-only deals. ✦
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg" noValidate>
      {/* Bespoke joined pill: slim, gold-hairlined, gilt focus ring. */}
      <div className="flex items-center gap-3 rounded-full border border-gold/40 bg-black/40 py-2 pl-5 pr-2 transition-all focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/40">
        <Mail size={18} aria-hidden className="shrink-0 text-ink/40" />
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Enter your email"
          aria-label="Email address"
          className="h-9 flex-1 bg-transparent font-body text-sm text-ink outline-none placeholder:text-ink/40"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="group flex h-10 shrink-0 items-center gap-2 rounded-full bg-forest px-5 font-utility text-[11px] font-semibold uppercase tracking-utility text-ivory transition-colors hover:bg-gold disabled:opacity-60"
        >
          {status === 'submitting' ? 'Joining…' : 'Subscribe'}
          <ArrowRight
            size={14}
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </form>
  );
}
