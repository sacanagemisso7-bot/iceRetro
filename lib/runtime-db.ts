export function getResolvedDatabaseUrl() {
  return (
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim() ||
    ""
  );
}

export function hasUsableDatabase() {
  const databaseUrl = getResolvedDatabaseUrl();

  if (!databaseUrl) {
    return false;
  }

  if (databaseUrl.startsWith("file:")) {
    return process.env.VERCEL !== "1";
  }

  return true;
}
