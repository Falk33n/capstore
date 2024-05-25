import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import type { NextResponse } from 'next/server';

// Generate salt and hash for secure passwords
export async function generateSaltHash(
  password: string,
): Promise<{ hashedPassword: string; salt: string }> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return { hashedPassword, salt };
}

// Function to create a JWT token and serialize it into a cookie
export function generateAuthCookie(userId: string, res: NextResponse) {
  if (!process.env.SECRET_JWT_KEY)
    throw new Error('SECRET_JWT_KEY is undefined');

  const token = jwt.sign({ userId }, process.env.SECRET_JWT_KEY, {
    expiresIn: '24h',
  });

  const serializedCookie = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  res.cookies.set('token', serializedCookie);

  return token;
}

// Function to authenticate a user
export async function authenticateUser(
  password: string,
  storedHashedPassword: string,
  storedSalt: string,
): Promise<boolean> {
  const hash = await bcrypt.hash(password, storedSalt);
  return hash === storedHashedPassword;
}
