import { execSync } from "node:child_process";

const resolvedDatabaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  "";

if (resolvedDatabaseUrl) {
  process.env.DATABASE_URL = resolvedDatabaseUrl;
}

execSync("node node_modules/prisma/build/index.js generate", {
  stdio: "inherit",
  env: process.env
});

if (resolvedDatabaseUrl) {
  execSync("node node_modules/prisma/build/index.js migrate deploy", {
    stdio: "inherit",
    env: process.env
  });
} else {
  console.warn(
    "[vercel-build] No database URL found; skipping Prisma migrations and using fallback content."
  );
}

execSync("node node_modules/next/dist/bin/next build", {
  stdio: "inherit",
  env: process.env
});
