import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      email?: string | null;
      name?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      role?: UserRole | null;
    };
  }

  interface User {
    firstName?: string | null;
    lastName?: string | null;
    role?: UserRole | null;
  }
}

export {};

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    role?: UserRole | null;
  }
}
