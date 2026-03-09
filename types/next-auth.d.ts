import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    organization_id: string;
    role: string;
  }

  interface Session {
    user: User & {
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    organization_id: string;
    role: string;
  }
}
