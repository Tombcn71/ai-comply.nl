import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: {
    type: "postgres",
    client: new Pool({
      connectionString: process.env.DATABASE_URL || process.env.POSTGRESQL_ADDON_URI,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
});
