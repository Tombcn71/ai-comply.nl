import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRESQL_ADDON_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const result = await pool.query(
            "SELECT id, email, password_hash, organization_id, role FROM users WHERE email = $1",
            [credentials.email]
          );
          if (result.rows.length === 0) return null;
          const user = result.rows[0];
          const passwordMatch = await compare(credentials.password, user.password_hash);
          if (!passwordMatch) return null;
          return {
            id: user.id,
            email: user.email,
            organization_id: user.organization_id,
            role: user.role,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.organization_id = (user as any).organization_id;
        token.role = (user as any).role;
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
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export const { GET, POST } = handler;
export const auth = handler;
