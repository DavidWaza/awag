import { NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }

  // TODO: hash the password (argon2/bcrypt) and persist via your data layer
  // (Prisma, Drizzle, etc.). This stub exists so the frontend flow is
  // wireable end-to-end without blocking on the DB schema.
  // const passwordHash = await hash(parsed.data.password);
  // await db.user.create({ data: { ...parsed.data, passwordHash } });

  return NextResponse.json({ ok: true }, { status: 201 });
}
