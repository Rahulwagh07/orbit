import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { redis } from "@repo/redis";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: windowId } = await params;
  
  const window = await prisma.window.findUnique({
    where: { id: windowId }
  });

  if (!window) {
    return NextResponse.json({ error: "Window not found" }, { status: 404 });
  }

  if (window.instanceId) {
    const instance = await prisma.applicationInstance.findUnique({
      where: { id: window.instanceId }
    });

    if (instance) {
      await prisma.applicationInstance.update({
        where: { id: instance.id },
        data: { status: "STOPPING" }
      });

      // Enqueue stop job
      await redis.lpush("deployment_jobs", JSON.stringify({
        type: "stop",
        instanceId: instance.shortId,
      }));
    }
  }

  await prisma.window.delete({
    where: { id: windowId }
  });

  return NextResponse.json({ success: true });
}
