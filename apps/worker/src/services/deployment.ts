import { redis } from "@repo/redis";
import { prisma } from "@repo/db";
import { DeploymentStateMachine, DeploymentEvent } from "@repo/deployment";
import { DockerContainerRuntime } from "@repo/container-runtime";
import { getAvailablePort } from "../utils/port";
import { pollHealthCheck } from "./health-check";

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

  async deployInstance(instanceId: string) {
    console.log(`Deploying instance ${instanceId}`);
    
    const stateMachine = new DeploymentStateMachine(instanceId, async (event: DeploymentEvent) => {
      await redis.publish(`deployment:${event.instance_id}`, JSON.stringify(event));
      
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
    });

    try {
      stateMachine.transition("CREATING_RESOURCES");
      stateMachine.transition("CONTAINER_STARTING");
      
      const port = await getAvailablePort();
      
      // Save port in DB for gateway validation
      await prisma.applicationInstance.update({
        where: { shortId: instanceId },
        data: { port }
      });
      
      await this.runtime.start({
        instanceId,
        image: "infinity-chromium",
        port
      });

      stateMachine.transition("WAITING_READY");
      
      const isReady = await pollHealthCheck(`http://127.0.0.1:${port}/health`);
      
      if (!isReady) {
        throw new Error("Container health check timed out");
      }

      stateMachine.transition("CONFIGURING_NETWORK");
      await new Promise(resolve => setTimeout(resolve, 500));

      stateMachine.transition("READY", { 
        deployed_url: `ws://localhost:4001/session/${instanceId}?port=${port}` 
      });
      
    } catch (error: unknown) {
      console.error("Deployment failed:", error);
      stateMachine.transition("FAILED", { 
        error_code: error instanceof Error ? error.message : String(error), 
        is_retryable: true 
      });
    }
  }
}
