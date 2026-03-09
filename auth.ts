import NextAuth from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRESQL_ADDON_URI,
  ssl: { rejectUnauthorized: false },
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
          const result = await pool.query("SELECT * FROM users WHERE email = $1", [credentials.email]);
          if (result.rows.length === 0) return null;
          const user = result.rows[0];
          const passwordMatch = await compare(credentials.password, user.password_hash);
          if (!passwordMatch) return null;
          return { id: user.id, email: user.email, role: user.role, organization_id: user.organization_id };
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
        token.role = (user as any).role;
        token.organization_id = (user as any).organization_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).organization_id = token.organization_id;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export const handlers = { GET: handler, POST: handler };
export { handler as GET, handler as POST };
export const auth = () => getServerSession(authOptions);