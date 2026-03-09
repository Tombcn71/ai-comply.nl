import { betterAuth } from "better-auth";
import { pgAdapter } from "@better-auth/pg-adapter";
import { Pool } from "pg";

export const auth = betterAuth({
  database: pgAdapter(new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRESQL_ADDON_URI,
    ssl: {
      rejectUnauthorized: false,
    },
  }), {
    schema: "public",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
});
