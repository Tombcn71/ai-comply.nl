import { betterAuth } from "better-auth";
import { pgAdapter } from "@better-auth/pg-adapter"; // Belangrijk: installeer dit!
import { Pool } from "pg";

export const auth = betterAuth({
  // Gebruik de adapter functie in plaats van een object
  database: pgAdapter(new Pool({
    connectionString: process.env.POSTGRESQL_ADDON_URI || process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
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