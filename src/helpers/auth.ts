import { internalServerError, notFound, unauthorized } from '@/helpers';
import type { JwtPayloadProp, UserIPProps } from '@/types';
import type { PrismaClient } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import requestIp from 'request-ip';

export async function generateSaltHash(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (!salt || !hashedPassword) {
    return { hashedPassword: undefined, salt: undefined };
  }
  return { hashedPassword: hashedPassword, salt: salt };
}

function convertNextRequest(req: NextRequest): requestIp.Request {
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    headers: headers,
    method: req.method,
    url: req.url,
    body: req.body
  } as unknown as requestIp.Request;
}

export function generateAuthCookies(
  userId: string,
  req: NextRequest,
  resHeaders: Headers
) {
  const clientIp = requestIp.getClientIp(convertNextRequest(req));

  if (!clientIp) return internalServerError();

  const hashedIP = crypto.createHash('sha256').update(clientIp).digest('hex');
  const userIPProps: UserIPProps = { userId: userId, hashedIP: hashedIP };

  if (!process.env.SECRET_JWT_KEY) return internalServerError();

  const token = jwt.sign({ userId }, process.env.SECRET_JWT_KEY, {
    expiresIn: '24h'
  });

  // Unrecognizable name of auth cookie for security reasons
  const serializedAuthCookie = serialize('pkajgokfdarqq', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 1 day
    path: '/'
  });

  // Unrecognizable name of  IP cookie for security reasons
  const serializedIPCookie = serialize(
    'tkiflocdsyywsas',
    JSON.stringify(userIPProps),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/'
    }
  );

  if (!userIPProps || !token || !serializedAuthCookie || !serializedIPCookie) {
    return internalServerError();
  }

  resHeaders.append('Set-Cookie', serializedAuthCookie);
  resHeaders.append('Set-Cookie', serializedIPCookie);
}

export function verifyUserSameIP(userId: string, userIP: string) {
  const token = cookies().get('tkiflocdsyywsas');

  if (!token) return false;

  const userIPData = JSON.parse(token.value) as UserIPProps;
  const hashedCurrentIp = crypto
    .createHash('sha256')
    .update(userIP)
    .digest('hex');

  if (userIPData.userId !== userId && hashedCurrentIp !== userIPData.hashedIP) {
    unauthorized();
    return false;
  }

  return true;
}

export function findValidAuthCookie() {
  const token = cookies().get('pkajgokfdarqq');

  if (!token || !process.env.SECRET_JWT_KEY) {
    internalServerError();
    return { isValid: false, id: undefined };
  }

  const decoded = jwt.verify(
    token.value,
    process.env.SECRET_JWT_KEY
  ) as JwtPayloadProp;

  if (!decoded) {
    unauthorized();
    return { isValid: false, id: undefined };
  }

  return { isValid: true, id: decoded.userId };
}

export async function authenticatePassword(
  password: string,
  storedHashedPassword: string,
  storedSalt: string
) {
  const hash = await bcrypt.hash(password, storedSalt);

  if (hash && hash === storedHashedPassword) return true;
  return false;
}

export async function checkSession(
  db: PrismaClient<
    {
      log: ('query' | 'warn' | 'error')[];
    },
    never,
    DefaultArgs
  >
) {
  const { isValid, id } = findValidAuthCookie();
  const user = await db.user.findUnique({ where: { id: id } });
  const userRole = await db.userRole.findUnique({ where: { id: id } });

  if (!isValid || !id || !user || !userRole) {
    notFound();
    unauthorized();

    return {
      isValid: isValid,
      id: undefined,
      user: undefined,
      role: undefined
    };
  }

  return { isValid: isValid, id: id, user: user, role: userRole.role };
}
