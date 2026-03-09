import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRESQL_ADDON_URI,
  ssl: { rejectUnauthorized: false },
});

// Better Auth with native PostgreSQL support
export const auth = betterAuth({
  database: {
    type: "postgres",
    client: pool,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  appName: "AI Comply",
  // Gebruik de specifieke Better Auth variabele
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
}); 
