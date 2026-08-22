import { z } from "zod";
import { parseEnv } from "./load";
import {
  databaseUrlField,
  jwtSecretField,
  nodeEnvField,
  redisUrlField,
} from "./base";

const schema = z.object({
  NODE_ENV: nodeEnvField,
  DATABASE_URL: databaseUrlField,
  REDIS_URL: redisUrlField,
  JWT_SECRET: jwtSecretField,
  NEXT_PUBLIC_APP_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  NEXT_PUBLIC_TURN_URL: z.string().optional(),
  NEXT_PUBLIC_TURN_USERNAME: z.string().optional(),
  NEXT_PUBLIC_TURN_CREDENTIAL: z.string().optional(),
});

export const env = parseEnv(schema, "@repo/web");
