import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: "../../.env" });
config({ path: "../../.env.local", override: true });
config({ path: ".env", override: true });
config({ path: ".env.local", override: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local at the repository root and fill it in."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
