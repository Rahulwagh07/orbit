import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import type { ZodType } from "zod";

let loaded = false;

function findRepoRoot(startDir: string): string {
  let dir = path.resolve(startDir);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const isRepoRoot =
      fs.existsSync(path.join(dir, "turbo.json")) ||
      fs.existsSync(path.join(dir, "bun.lock"));
    if (isRepoRoot) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return startDir;
    dir = parent;
  }
}

export function loadEnvFiles(): void {
  if (loaded) return;
  loaded = true;

  const repoRoot = findRepoRoot(process.cwd());
  dotenv.config({ path: path.join(repoRoot, ".env") });
  dotenv.config({ path: path.join(repoRoot, ".env.local"), override: true });
  if (process.cwd() !== repoRoot) {
    dotenv.config({ path: path.join(process.cwd(), ".env"), override: true });
    dotenv.config({
      path: path.join(process.cwd(), ".env.local"),
      override: true,
    });
  }
}

export function parseEnv<T>(schema: ZodType<T>, scope: string): T {
  loadEnvFiles();
  const result = schema.safeParse(process.env);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => issue.path.join("."))
      .join(", ");
    throw new Error(
      `[${scope}] Invalid or missing environment variables: ${issues}. ` +
        `Copy .env.example to .env.local at the repository root and fill in the values.`
    );
  }
  return result.data;
}
