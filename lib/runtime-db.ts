export function hasUsableDatabase() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    return false;
  }

  if (databaseUrl.startsWith("file:")) {
    return process.env.VERCEL !== "1";
  }

  return true;
}
