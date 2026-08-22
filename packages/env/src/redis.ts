import { z } from "zod";
import { parseEnv } from "./load";
import { nodeEnvField, redisUrlField } from "./base";

const schema = z.object({
  NODE_ENV: nodeEnvField,
  REDIS_URL: redisUrlField,
});

export const env = parseEnv(schema, "@repo/redis");
