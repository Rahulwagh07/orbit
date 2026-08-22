import { z } from "zod";

export const nodeEnvField = z
  .enum(["development", "production", "test"])
  .default("development");

export const databaseUrlField = z.string().url();

export const redisUrlField = z.string().url();

export const jwtSecretField = z
  .string()
  .min(32, "JWT_SECRET must be at least 32 characters");
