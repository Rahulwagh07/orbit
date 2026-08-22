import { z } from "zod";
import { parseEnv } from "./load";
import {
  databaseUrlField,
  jwtSecretField,
  nodeEnvField,
} from "./base";

const schema = z.object({
  NODE_ENV: nodeEnvField,
  DATABASE_URL: databaseUrlField,
  JWT_SECRET: jwtSecretField,
  GATEWAY_PORT: z.coerce.number().int().positive(),
  GATEWAY_WS_URL: z.string().url(),
});

export const env = parseEnv(schema, "@repo/gateway");
