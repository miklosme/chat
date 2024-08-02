import { defineConfig } from 'drizzle-kit';
import { env } from '@/env';

export default defineConfig({
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
});
