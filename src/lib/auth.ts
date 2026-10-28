import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { z } from 'zod';
import type { UserRole } from '@/types/user';

/**
 * Central auth config (Auth.js v5). Import `auth`, `signIn`, `signOut` from
 * here anywhere in the app — never re-instantiate NextAuth elsewhere.
 *
 * Swap `authorize`'s lookup for your real user store (Postgres/Prisma) before
 * launch — this file intentionally has no DB dependency yet so the project
 * boots without one configured.
 */

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Dev fallback so the simulated auth flow works without an .env file.
  // Set a real AUTH_SECRET (openssl rand -base64 33) before deploying.
  secret: process.env.AUTH_SECRET || 'dev-simulation-secret-not-for-production',
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/account',
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        // DEV SIMULATION: accept any well-formed credentials and mint a user
        // from the email so the sign-in / account / sign-out flow is testable
        // end-to-end. Replace with a real lookup + hashed-password comparison
        // (e.g. Prisma + bcrypt/argon2) before launch — never trust plaintext.
        const { email } = parsed.data;
        const local = email.split('@')[0] ?? 'Gentleman';
        const name = local
          .replace(/[._-]+/g, ' ')
          .replace(/\b\w/g, (character) => character.toUpperCase());

        const user = { id: `sim_${email}`, name, email, role: 'customer' as const };
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: UserRole }).role ?? 'customer';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as UserRole) ?? 'customer';
      }
      return session;
    },
  },
});
