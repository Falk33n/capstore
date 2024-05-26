import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { JwtPayload } from '../_types/user.types';

// Generate salt and hash for secure passwords
export async function generateSaltHash(
  password: string,
): Promise<{ hashedPassword: string; salt: string }> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return { hashedPassword, salt };
}

// Function to create a JWT token and serialize it into a cookie
export function generateAuthCookie(userId: string, resHeaders: Headers) {
  if (!process.env.SECRET_JWT_KEY)
    throw new Error('SECRET_JWT_KEY is undefined');

  const token = jwt.sign({ userId }, process.env.SECRET_JWT_KEY, {
    expiresIn: '2h',
  });

  // Set the cookie
  const serializedCookie = serialize('authCookie', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 2 * 60 * 60, // 2 hours in seconds
    path: '/',
  });

  resHeaders.append('Set-Cookie', serializedCookie);

  return token;
}

export function findValidAuthCookie(): {
  isValid: boolean;
  id?: string;
} {
  const token = cookies().get('authCookie');

  if (!token) return { isValid: false };

  if (!process.env.SECRET_JWT_KEY)
    throw new Error('SECRET_JWT_KEY is undefined');

  const decoded = jwt.verify(
    token.value,
    process.env.SECRET_JWT_KEY,
  ) as JwtPayload;

  if (decoded) return { isValid: true, id: decoded.userId };

  throw new Error('Unauthorized');
}

// Function to authenticate a user
export async function authenticatePassword(
  password: string,
  storedHashedPassword: string,
  storedSalt: string,
): Promise<boolean> {
  const hash = await bcrypt.hash(password, storedSalt);
  return hash === storedHashedPassword;
}
