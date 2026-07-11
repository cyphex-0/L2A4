import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string({ message: 'DATABASE_URL is required' }),
  JWT_SECRET: z.string({ message: 'JWT_SECRET is required' }),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string({ message: 'JWT_REFRESH_SECRET is required' }),
  JWT_REFRESH_EXPIRES_IN: z.string().default('365d'),
  STRIPE_SECRET_KEY: z.string({ message: 'STRIPE_SECRET_KEY is required' }),
  STRIPE_WEBHOOK_SECRET: z.string({ message: 'STRIPE_WEBHOOK_SECRET is required' }),
  BCRYPT_SALT_ROUNDS: z.string().default('8'),
  SEED_ADMIN_PASSWORD: z.string({ message: 'SEED_ADMIN_PASSWORD is required' }),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error('❌ Invalid environment variables:', envVars.error.format());
  process.exit(1);
}

const env = envVars.data;

export default {
  env: env.NODE_ENV,
  port: env.PORT,
  database_url: env.DATABASE_URL,
  jwt: {
    secret: env.JWT_SECRET,
    expires_in: env.JWT_EXPIRES_IN,
    refresh_secret: env.JWT_REFRESH_SECRET,
    refresh_expires_in: env.JWT_REFRESH_EXPIRES_IN,
  },
  stripe: {
    secret_key: env.STRIPE_SECRET_KEY,
    webhook_secret: env.STRIPE_WEBHOOK_SECRET,
  },
  bcrypt_salt_rounds: env.BCRYPT_SALT_ROUNDS,
  seed_admin_password: env.SEED_ADMIN_PASSWORD,
};
