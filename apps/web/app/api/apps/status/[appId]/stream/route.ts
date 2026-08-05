import { NextRequest } from "next/server";
import Redis from "ioredis";
import { env } from "@repo/env";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  await params;
  const url = new URL(req.url);
  const instanceId = url.searchParams.get("instance_id");

  if (!instanceId) {
    return new Response("Missing instance_id", { status: 400 });
  }

  const redis = new Redis(env.REDIS_URL);

  const stream = new ReadableStream({
    async start(controller) {
      const channel = `deployment:${instanceId}`;
      
      await redis.subscribe(channel);
      
      redis.on("message", (ch, message) => {
        if (ch === channel) {
          controller.enqueue(`data: ${message}\n\n`);
        }
      });

      req.signal.addEventListener("abort", () => {
        redis.unsubscribe(channel);
        redis.quit();
        controller.close();
      });
    },
    cancel() {
      redis.quit();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
