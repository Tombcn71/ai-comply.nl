import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

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
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.organization_id = user.organization_id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.organization_id = token.organization_id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
