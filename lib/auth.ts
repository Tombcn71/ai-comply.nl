import { betterAuth } from "better-auth";
import { postgres } from "better-auth/adapters/postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRESQL_ADDON_URI,
  ssl: { rejectUnauthorized: false },
});

export const auth = betterAuth({
  database: postgres({
    client: pool as any,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  appName: "AI Comply",
  baseURL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
});
