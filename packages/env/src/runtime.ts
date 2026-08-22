import { z } from "zod";
import { parseEnv } from "./load";
import { nodeEnvField } from "./base";

const schema = z.object({
  NODE_ENV: nodeEnvField,
  RUNTIME_ENABLE_GPU: z.enum(["0", "1"]).default("0"),
  VIDEO_ENCODER: z.string().default("libx264"),
});

export const env = parseEnv(schema, "@repo/container-runtime");
