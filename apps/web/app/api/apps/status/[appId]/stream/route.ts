import { NextRequest } from "next/server";
import Redis from "ioredis";
import { env } from "@repo/env/web";
import { prisma } from "@repo/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const { appId } = await params;
  const url = new URL(req.url);
  const instanceId = url.searchParams.get("instance_id");

  if (!instanceId) {
    return new Response("Missing instance_id", { status: 400 });
  }

  const redis = new Redis(env.REDIS_URL);
  redis.on("error", (err) => {
    console.error("Redis connection error in status stream:", err);
  });
  
  let cleanup = () => {
    void redis.quit().catch(() => undefined);
  };

  const stream = new ReadableStream({
    async start(controller) {
      const channel = `deployment:${instanceId}`;

      let closed = false;
      let heartbeat: ReturnType<typeof setInterval> | null = null;
      const close = () => {
        if (closed) return;
        closed = true;
        if (heartbeat !== null) clearInterval(heartbeat);
        redis.removeListener("message", onMessage);
        void redis
          .unsubscribe(channel)
          .catch(() => undefined)
          .finally(() => redis.quit().catch(() => undefined));
        try {
          controller.close();
        } catch {
          // The stream may already have been cancelled by the client.
        }
      };
      cleanup = close;
      const onMessage = (ch: string, message: string) => {
        if (closed) return;
        if (ch === channel) {
          controller.enqueue(`data: ${message}\n\n`);
        }
      };

      // Register the listener before subscribing. Otherwise a deployment can
      // publish its terminal event in the small subscribe/listener gap.
      redis.on("message", onMessage);
      await redis.subscribe(channel);

      // Redis Pub/Sub is intentionally ephemeral. Recover READY/FAILED when
      // the browser opened this stream after the worker published the event.
      const instance = await prisma.applicationInstance.findFirst({
        where: { shortId: instanceId, applicationId: appId },
        select: { status: true, deployedUrl: true },
      });
      if (!closed && instance?.status === "READY") {
        controller.enqueue(`data: ${JSON.stringify({
          phase: "READY",
          phase_display: "Ready",
          progress: 100,
          is_retryable: false,
          instance_id: instanceId,
          deployed_url: instance.deployedUrl,
        })}\n\n`);
      } else if (!closed && instance?.status === "FAILED") {
        controller.enqueue(`data: ${JSON.stringify({
          phase: "FAILED",
          phase_display: "Application failed to start",
          progress: 100,
          is_retryable: true,
          instance_id: instanceId,
        })}\n\n`);
      }

      heartbeat = setInterval(() => {
        if (!closed) controller.enqueue(": keep-alive\n\n");
      }, 15000);

      req.signal.addEventListener("abort", () => {
        close();
      });
    },
    cancel() {
      cleanup();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
