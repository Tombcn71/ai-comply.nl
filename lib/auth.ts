import { betterAuth } from "better-auth";
import { Pool } from "pg";

// Jouw bestaande pool (perfect voor CRUD en Auth)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRESQL_ADDON_URI,
  ssl: { rejectUnauthorized: false },
});

export const auth = betterAuth({
  database: {
    db: pool,         // 'db' in plaats van 'client'
    type: "postgres",
  },
  secret: process.env.BETTER_AUTH_SECRET,
  appName: "AI Comply",
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
});