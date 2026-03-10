import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.POSTGRESQL_ADDON_URI || process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production" ||
    process.env.POSTGRESQL_ADDON_URI?.includes("clever-cloud")
      ? { rejectUnauthorized: false }
      : false,
  max: 5, // Limit connections to avoid "too many connections" error
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const auth = betterAuth({
  // sommige versies verwachten ook een 'database' veld
  database: pool,
  emailAndPassword: { enabled: true },
  plugins: [organization()],
  callbacks: {
    // We gebruiken 'any' alleen HIER om de library-frictie te stoppen.
    // De rest van je app blijft veilig.
    async session({ session, user }: any) {
      return {
        ...session,
        user: {
          ...session.user,
          organization_id:
            user.activeOrganizationId || user.organizationId || null,
        },
      };
    },
  },
  baseURL: process.env.BETTER_AUTH_URL,
});
