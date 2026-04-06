import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const emailLower = email.toLowerCase();

    // Check if user exists
    const userExists = await query('SELECT id FROM public.users WHERE email = $1', [emailLower]);
    if (userExists.rows.length > 0) {
      return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 409 });
    }

    // Hashing: Using SHA-256 with a salt for basic security without bcryptjs
    // Ideally, the user should install bcryptjs later for production
    const salt = process.env.NEXTAUTH_SECRET || 'static-salt-fallback';
    const hashedPassword = crypto
      .createHash('sha256')
      .update(password + salt)
      .digest('hex');

    // Insert user
    await query(
      'INSERT INTO public.users (name, email, password) VALUES ($1, $2, $3)',
      [name || emailLower.split('@')[0], emailLower, hashedPassword]
    );

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
