import "dotenv/config";
import { defineConfig } from "prisma/config";

process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  "";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Missing DATABASE_URL. Set DATABASE_URL in Vercel, or provide POSTGRES_PRISMA_URL / POSTGRES_URL."
  );
}

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  }
});
