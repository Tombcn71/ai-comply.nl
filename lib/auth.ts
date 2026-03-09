import { betterAuth } from "better-auth";
import { pgAdapter } from "better-auth/adapters/pg";
import { Pool } from "pg";

export const auth = betterAuth({
  database: pgAdapter(new Pool({
    // Gebruik de URI die je in je dashboard ziet
    connectionString: process.env.POSTGRESQL_ADDON_URI || process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // DIT IS HET VERSCHIL
    }
  }), {
    schema: "public"
  }),
  // ... de rest van je config (secret, url, etc.)
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});