import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { CtxProps, JwtPayloadProp, UserIPProps } from '../_types/_index';
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

// Function to create a JWT token and serialize it into a auth cookie
// Also creates a cookie to track changes of the IP address linked to the user
export function generateAuthCookies(
  userId: string,
  userIP: string,
  resHeaders: Headers,
) {
  if (!process.env.SECRET_JWT_KEY) unknownError(!process.env.SECRET_JWT_KEY);

  // Create a hashed version of the IP address
  const hashedIP = crypto.createHash('sha256').update(userIP).digest('hex');
  const userIPProps: UserIPProps = { userId, hashedIP };
  const token = jwt.sign({ userId }, process.env.SECRET_JWT_KEY, {
    expiresIn: '24h',
  });

  // Set the auth cookie
  const serializedAuthCookie = serialize('authCookie', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60,
    path: '/',
  });

  // Set the IP cookie
  const serializedIPCookie = serialize(
    'userIPCookie',
    JSON.stringify(userIPProps),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    },
  );

  resHeaders.append('Set-Cookie', serializedAuthCookie);
  resHeaders.append('Set-Cookie', serializedIPCookie);

  return token;
}

// Function to verify if the IP address has changed
export function verifyUserIP(
  userId: string,
  userIP: string,
): { isValid: boolean } {
  const token = cookies().get('userIPCookie');
  if (!token) return { isValid: false };

  const userIPData = JSON.parse(token.value) as UserIPProps;
  if (userIPData.userId !== userId) unauthorizedUser(true);

  // Hash the current IP address and compare it to the stored IP address
  const hashedCurrentIP = crypto
    .createHash('sha256')
    .update(userIP)
    .digest('hex');

  if (hashedCurrentIP !== userIPData.hashedIP) return { isValid: false };
  return { isValid: true };
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
  const user = await ctx.db.userRole.findUnique({ where: { userId: id } });
  unknownUser(!user);
  unauthorizedUser(!user?.admin);
  return { isValid, id };
}

// Function to check if a user is authenticated and a super admin
export async function checkSuperAdminSession({ ctx }: CtxProps) {
  const { isValid, id } = await checkSession();
  const user = await ctx.db.userRole.findUnique({ where: { userId: id } });
  unknownUser(!user);
  unauthorizedUser(!user?.admin && !user?.superAdmin);
  return { isValid, id };
}
