import { Client } from "pg";

function parseDatabaseUrl(url: string) {
  const parsed = new URL(url);

  return {
    host: parsed.hostname,
    port: Number(parsed.port || 5432),
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.replace("/", ""),
  };
}

export async function ensureDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL not set");
  }

  const { host, port, user, password, database } =
    parseDatabaseUrl(databaseUrl);

  // connect to default postgres db
  const client = new Client({
    host,
    port,
    user,
    password,
    database: "postgres",
  });

  await client.connect();

  const result = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [database]
  );

  if (result.rowCount === 0) {
    console.log(`🆕 Creating database "${database}"`);
    await client.query(`CREATE DATABASE "${database}"`);
  } else {
    console.log(`✅ Database "${database}" already exists`);
  }

  await client.end();
}
