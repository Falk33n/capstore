import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { CtxProps, JwtPayloadProp } from '../_types/_index';
import { unauthorizedUser, unknownError, unknownUser } from './_index';

// Generate salt and hash for secure passwords
export async function generateSaltHash(
  password: string,
): Promise<{ hashedPassword: string; salt: string }> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  if (!salt || !hashedPassword) unknownError(!salt || !hashedPassword);
  return { hashedPassword, salt };
}

// Function to create a JWT token and serialize it into a cookie
export function generateAuthCookie(userId: string, resHeaders: Headers) {
  if (!process.env.SECRET_JWT_KEY) unknownError(!process.env.SECRET_JWT_KEY);

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
  if (!process.env.SECRET_JWT_KEY) unknownError(!process.env.SECRET_JWT_KEY);

  const decoded = jwt.verify(
    token.value,
    process.env.SECRET_JWT_KEY,
  ) as JwtPayloadProp;

  unauthorizedUser(!decoded);
  if (!decoded) return { isValid: false };

  return { isValid: true, id: decoded.userId };
}

// Function to authenticate a user
export async function authenticatePassword(
  password: string,
  storedHashedPassword: string,
  storedSalt: string,
): Promise<boolean> {
  const hash = await bcrypt.hash(password, storedSalt);
  if (hash) return hash === storedHashedPassword;
  unknownError(!hash);
}

// Function to check if a user is authenticated
export async function checkSession() {
  const { isValid, id } = findValidAuthCookie();
  unauthorizedUser(!isValid || !id);
  return { isValid, id };
}

// Function to check if a user is authenticated and a admin
export async function checkAdminSession({ ctx }: CtxProps) {
  const { isValid, id } = await checkSession();
  const user = await ctx.db.user.findUnique({ where: { id: id } });

  unknownUser(!user);
  unauthorizedUser(!user?.admin);

  return { isValid, id };
}

// Function to check if a user is authenticated and a super admin
export async function checkSuperAdminSession({ ctx }: CtxProps) {
  const { isValid, id } = await checkSession();
  const user = await ctx.db.user.findUnique({ where: { id: id } });
  
  unknownUser(!user);
  unauthorizedUser(!user?.admin && !user?.superAdmin);

  return { isValid, id };
}
