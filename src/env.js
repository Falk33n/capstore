import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    SECRET_DATABASE_URL: z.string().url(),
    SECRET_JWT_KEY: z.string(),
    SECRET_DEVELOPER_KEY: z.string(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development')
  },
  client: {},
  runtimeEnv: {
    SECRET_DATABASE_URL: process.env.SECRET_DATABASE_URL,
    SECRET_JWT_KEY: process.env.SECRET_JWT_KEY,
    SECRET_DEVELOPER_KEY: process.env.SECRET_DEVELOPER_KEY,
    NODE_ENV: process.env.NODE_ENV
  },
  skipValidation: true,
  emptyStringAsUndefined: true
});
