import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Generate salt and hash for secure passwords
export async function generateSaltHash(
  password: string,
): Promise<{ hashedPassword: string; salt: string }> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return { hashedPassword, salt };
}

// Function to create a JWT token and serialize it into a cookie
export function generateAuthCookie(userId: string): void {
  if (!process.env.SECRET_JWT_KEY)
    throw new Error('SECRET_JWT_KEY is undefined');

  const token = jwt.sign({ userId }, process.env.SECRET_JWT_KEY, {
    expiresIn: '2h',
  });

  // Set the cookie
  cookies().set({
    name: 'authToken',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 2 * 60 * 60, // 2 hours in seconds
  });
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
