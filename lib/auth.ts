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
  baseURL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
});
