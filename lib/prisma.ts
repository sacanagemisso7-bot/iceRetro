import { PrismaClient } from "@prisma/client";
import { getResolvedDatabaseUrl } from "@/lib/runtime-db";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

process.env.DATABASE_URL = getResolvedDatabaseUrl();

export const prisma =
  global.prismaGlobal ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}
