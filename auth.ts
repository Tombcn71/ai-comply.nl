import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRESQL_ADDON_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Generate a default secret if none is provided (for development)
const getSecret = () => {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    console.warn(
      "[Auth] Warning: No NEXTAUTH_SECRET set. Using default for development only."
    );
    return "default-dev-secret-change-in-production";
  }
  return secret;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
          const result = await pool.query(
            "SELECT id, email, password_hash, organization_id, role FROM users WHERE email = $1",
            [credentials.email]
          );

          if (result.rows.length === 0) {
            throw new Error("No user found");
          }

          const user = result.rows[0];
          const passwordMatch = await compare(
            credentials.password as string,
            user.password_hash
          );

          if (!passwordMatch) {
            throw new Error("Invalid password");
          }

          return {
            id: user.id,
            email: user.email,
            organization_id: user.organization_id,
            role: user.role,
          };
        } catch (error) {
          console.error("[Auth] Authorization error:", error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.organization_id = user.organization_id as string;
        token.role = user.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).organization_id = token.organization_id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: getSecret(),
});
