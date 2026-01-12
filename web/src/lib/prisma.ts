import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

// Prefer DIRECT_URL (connection string without pooling); fall back to DATABASE_URL for local dev convenience.
const directUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!directUrl) {
  throw new Error("DIRECT_URL (or DATABASE_URL fallback) is required to initialize PrismaClient.");
}

const pool = globalForPrisma.prismaPool ?? new Pool({ connectionString: directUrl, max: 5 });
const adapter = new PrismaPg(pool);

process.env.DATABASE_URL = directUrl;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPool = pool;
}
