import { z } from "zod";
import { parseEnv } from "./load";
import { databaseUrlField, nodeEnvField } from "./base";

const schema = z.object({
  NODE_ENV: nodeEnvField,
  DATABASE_URL: databaseUrlField,
});

export const env = parseEnv(schema, "@repo/db");
