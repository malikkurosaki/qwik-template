import { ensureDatabase } from "./ensure-db";

async function main() {
  await ensureDatabase();

  // jalankan drizzle-kit push
  const proc = Bun.spawn(
    ["bunx", "drizzle-kit", "push"],
    {
      stdout: "inherit",
      stderr: "inherit",
    }
  );

  const code = await proc.exited;
  if (code !== 0) {
    process.exit(code);
  }
}

await main();
