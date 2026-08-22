import { z } from "zod";
import { parseEnv } from "./load";
import {
  databaseUrlField,
  nodeEnvField,
  redisUrlField,
} from "./base";

const schema = z.object({
  NODE_ENV: nodeEnvField,
  DATABASE_URL: databaseUrlField,
  REDIS_URL: redisUrlField,
  GATEWAY_WS_URL: z.string().url(),
});

export const env = parseEnv(schema, "@repo/worker");
