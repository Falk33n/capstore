import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { CtxProps, JwtPayloadProp, UserIPProps } from '../_types/_index';
import { unauthorizedUser, unknownError, unknownUser } from './_index';

export async function generateSaltHash(
  password: string,
): Promise<{ hashedPassword?: string; salt?: string }> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const validData = salt && hashedPassword;

  if (validData) {
    return { hashedPassword: hashedPassword, salt: salt };
  } else {
    unknownError();
    return {};
  }
}

export function generateAuthCookies(
  userId: string,
  userIP: string,
  resHeaders: Headers,
) {
  if (process.env.SECRET_JWT_KEY) {
    const hashedIP = crypto.createHash('sha256').update(userIP).digest('hex');
    const userIPProps: UserIPProps = { userId, hashedIP };
    const token = jwt.sign({ userId }, process.env.SECRET_JWT_KEY, {
      expiresIn: '24h',
    });

    const serializedAuthCookie = serialize('pkajgokfdarqq', token, {
      // Unrecognizable name of cookie for security reasons
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    const serializedIPCookie = serialize(
      'tkiflocdsyywsas',
      JSON.stringify(userIPProps),
      {
        // Unrecognizable name of cookie for security reasons
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 365 * 24 * 60 * 60, // 1 year
        path: '/',
      },
    );

    const validData =
      hashedIP &&
      userIPProps &&
      token &&
      serializedAuthCookie &&
      serializedIPCookie;

    if (validData) {
      resHeaders.append('Set-Cookie', serializedAuthCookie);
      resHeaders.append('Set-Cookie', serializedIPCookie);

      return token;
    }
  }

  unknownError();
}

export function verifyUserIP(userId: string, userIP: string): boolean {
  const token = cookies().get('tkiflocdsyywsas');

  if (token) {
    const userIPData = JSON.parse(token.value) as UserIPProps;

    const hashedCurrentIP = crypto
      .createHash('sha256')
      .update(userIP)
      .digest('hex');

    const validData =
      userIPData.userId === userId && hashedCurrentIP === userIPData.hashedIP;

    if (!validData) {
      unauthorizedUser();
    }

    return true;
  }

  return false;
}

export function findValidAuthCookie(): {
  isValid: boolean;
  id?: string;
} {
  const token = cookies().get('pkajgokfdarqq');

  if (token) {
    if (process.env.SECRET_JWT_KEY) {
      const decoded = jwt.verify(
        token.value,
        process.env.SECRET_JWT_KEY,
      ) as JwtPayloadProp;

      if (!decoded) {
        unauthorizedUser();
      }

      return { isValid: true, id: decoded.userId };
    }

    unknownError();
  }

  return { isValid: false };
}

export async function authenticatePassword(
  password: string,
  storedHashedPassword: string,
  storedSalt: string,
): Promise<boolean> {
  const hash = await bcrypt.hash(password, storedSalt);

  if (hash === storedHashedPassword) {
    return true;
  }

  unknownError();
  return false;
}

export async function checkSession() {
  const { isValid, id } = findValidAuthCookie();

  const validData = isValid && id;

  if (validData) {
    return { isValid: true, id: id };
  }

  unauthorizedUser();
  return { isValid: false };
}

export async function checkAdminSession({ ctx }: CtxProps) {
  const { isValid, id } = await checkSession();

  const user = await ctx.db.userRole.findUnique({ where: { userId: id } });

  const validData = isValid && id && user;

  if (validData) {
    if (!user.admin) {
      unauthorizedUser();
    }

    return { isValid: true, id: id };
  }

  if (!user) {
    unknownUser();
  }

  return { isValid: false };
}

export async function checkSuperAdminSession({ ctx }: CtxProps) {
  const { isValid, id } = await checkSession();

  const user = await ctx.db.userRole.findUnique({ where: { userId: id } });

  const validData = isValid && id && user;

  if (validData) {
    const validAdmin = user.superAdmin && user.admin;

    if (!validAdmin) {
      unauthorizedUser();

      return { isValid: false };
    }

    return { isValid: true, id: id };
  }

  if (!user) {
    unknownUser();
  }

  return { isValid: false };
}
