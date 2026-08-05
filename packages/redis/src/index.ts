import { Redis } from "ioredis";
import { env } from "@repo/env";

const globalForRedis = globalThis as unknown as { redis: Redis | undefined };

export const createRedisClient = () => {
  const client = new Redis(env.REDIS_URL);
  client.on("error", (err) => {
    console.error("Redis connection error:", err);
  });
  return client;
};

export const redis = globalForRedis.redis || createRedisClient();

if (env.NODE_ENV !== "production") globalForRedis.redis = redis;
