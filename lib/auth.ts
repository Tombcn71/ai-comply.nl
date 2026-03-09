import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRESQL_ADDON_URI,
  ssl: { rejectUnauthorized: false },
});

export const auth = betterAuth({
  database: {
    // Gebruik 'db' voor de pool instance en 'type' voor het dialect
    db: pool,
    type: "postgres",
  },
  secret: process.env.BETTER_AUTH_SECRET,
  appName: "AI Comply",
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
});
