import NextAuth, { type NextAuthOptions } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import { UserRole } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

if (!authSecret) {
  throw new Error("AUTH_SECRET is not set in the environment.");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: authSecret,
  providers: [
    Credentials({
      name: "email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) {
          return null;
        }

        const safeUser: AdapterUser & {
          passwordHash?: string | null;
          role?: string | null;
          firstName?: string | null;
          lastName?: string | null;
        } = {
          id: user.id,
          email: user.email,
          emailVerified: null,
          name: [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
          passwordHash: null,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        };
        return safeUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName ?? null;
        token.lastName = user.lastName ?? null;
        token.email = user.email ?? null;
        // carry role for admin gating
        token.role = (user as { role?: UserRole | null }).role ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.firstName = (token.firstName as string | null) ?? null;
        session.user.lastName = (token.lastName as string | null) ?? null;
        session.user.email = (token.email as string | null) ?? session.user.email ?? null;
        session.user.role = (token.role as UserRole | null) ?? null;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
