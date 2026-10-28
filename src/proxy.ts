import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Route guard — Next.js 16 renamed the `middleware.ts` convention to
 * `proxy.ts`; the API (the `auth()` wrapper, matcher config) is unchanged.
 *
 * `/account` itself is the public login / sign-up hub. Everything below it
 * (orders, addresses, …) and the brand-partner dashboard require a session;
 * guest checkout stays unauthenticated (Section 05, 07).
 */
const AUTH_HUB = '/account';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const needsAuth = pathname !== AUTH_HUB;

  if (needsAuth && !req.auth) {
    const hub = new URL(AUTH_HUB, req.nextUrl.origin);
    hub.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(hub);
  }
});

export const config = {
  matcher: ['/account/:path*', '/partner-brands/dashboard/:path*'],
};
