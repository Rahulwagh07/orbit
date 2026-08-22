import { redis } from "@repo/redis";
import { prisma } from "@repo/db";
import { env } from "@repo/env/worker";
import crypto from "crypto";
import { DeploymentStateMachine, DeploymentEvent } from "@repo/deployment";
import { DockerContainerRuntime } from "@repo/container-runtime";
import { getAvailablePort, getAvailableUdpRange } from "../utils/port";
import { pollHealthCheck } from "./health-check";

const APP_CONFIG: Record<string, { image: string; env: Record<string, string> }> = {
  chromium: {
    image: "orbit-chromium",
    env: { APP_COMMAND: "chromium", APP_WINDOW_CLASS: "chromium" },
  },
  vscode: {
    image: "orbit-vscode",
    env: { APP_COMMAND: "code", APP_WINDOW_CLASS: "Code" },
  },
  terminal: {
    image: "orbit-terminal",
    env: { APP_COMMAND: "xfce4-terminal", APP_WINDOW_CLASS: "Xfce4-terminal" },
  },
};

export class DeploymentService {
  private runtime: DockerContainerRuntime;

  constructor() {
    this.runtime = new DockerContainerRuntime();
  }

  async stopInstance(instanceId: string) {
    console.log(`Stopping instance ${instanceId}`);
    await this.runtime.stop(instanceId);

    await prisma.applicationInstance.update({
      where: { shortId: instanceId },
      data: { status: "STOPPED" }
    });
  }

  async deployInstance(instanceId: string, application: string = "chromium") {
    console.log(`Deploying instance ${instanceId}`);

    const stateMachine = new DeploymentStateMachine(instanceId, async (event: DeploymentEvent) => {
      // Persist DB state BEFORE publishing, so the browser's first connection
      // attempt (triggered by the SSE event) passes gateway validation
      if (event.phase === "READY" || event.phase === "FAILED") {
        const updateData: any = {
          status: event.phase === "READY" ? "READY" : "FAILED"
        };
        if (event.phase === "READY" && event.deployed_url) {
          updateData.deployedUrl = event.deployed_url;
        }

        await prisma.applicationInstance.update({
          where: { shortId: event.instance_id },
          data: updateData
        });
      }

      await redis.publish(`deployment:${event.instance_id}`, JSON.stringify(event));
    });

    try {
      await stateMachine.transition("CREATING_RESOURCES");
      await stateMachine.transition("CONTAINER_STARTING");
      
      const port = await getAvailablePort();
      const udpPorts = await getAvailableUdpRange();
      const sessionToken = crypto.randomUUID();
      
      // Save port in DB for gateway validation
      await prisma.applicationInstance.update({
        where: { shortId: instanceId },
        data: { port }
      });
      
      const appConfig = APP_CONFIG[application] || APP_CONFIG.chromium!;

      await this.runtime.start({
        instanceId,
        image: appConfig.image,
        port,
        udpPorts,
        env: {
          ...appConfig.env,
          SESSION_TOKEN: sessionToken,
        },
      });

      await stateMachine.transition("WAITING_READY");
      
      const isReady = await pollHealthCheck(`http://127.0.0.1:${port}/health`);
      
      if (!isReady) {
        throw new Error("Container health check timed out");
      }

      await stateMachine.transition("CONFIGURING_NETWORK");
      await new Promise(resolve => setTimeout(resolve, 500));

      await stateMachine.transition("READY", {
        deployed_url: `${env.GATEWAY_WS_URL}/session/${instanceId}?port=${port}&token=${sessionToken}`
      });

    } catch (error: unknown) {
      console.error("Deployment failed:", error);
      await stateMachine.transition("FAILED", {
        error_code: error instanceof Error ? error.message : String(error),
        is_retryable: true 
      });
    }
  }
}
