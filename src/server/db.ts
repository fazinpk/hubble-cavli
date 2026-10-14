import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@generated/prisma/client";

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      // The adapter sends timestamps without an offset; pin the session to UTC so a non-UTC server doesn't shift them.
      options: "-c TimeZone=UTC",
    }),
  });

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
