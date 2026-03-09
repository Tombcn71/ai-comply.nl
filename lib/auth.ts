import { betterAuth } from "better-auth";
import { pgAdapter } from "@better-auth/pg-adapter";
import { Pool } from "pg";

export const auth = betterAuth({
  database: pgAdapter(new Pool({
    // Gebruik de URI die Clever Cloud injecteert
    connectionString: process.env.POSTGRESQL_ADDON_URI || process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Verplicht voor Clever Cloud
    },
  }), {
    schema: "public"
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
});