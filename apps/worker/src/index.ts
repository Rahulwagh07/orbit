import { redis, createRedisClient } from "@repo/redis";
import { DeploymentJobSchema } from "@repo/protocol";
import { DeploymentService } from "./services/deployment";

const deploymentService = new DeploymentService();

// Dedicated connection for the blocking brpop, so the shared client (used
// for publishing deployment events) never gets stuck behind a blocked command
const jobsRedis = createRedisClient();

async function processJob(jobStr: string) {
  let jobData: unknown;
  try {
    jobData = JSON.parse(jobStr);
  } catch (e) {
    console.error("Failed to parse job JSON", e);
    return;
  }

  const parseResult = DeploymentJobSchema.safeParse(jobData);
  if (!parseResult.success) {
    console.error("Invalid job schema", parseResult.error);
    return;
  }

  const job = parseResult.data;

  if (job.type === "stop") {
    await deploymentService.stopInstance(job.instanceId);
  } else if (job.type === "deploy") {
    await deploymentService.deployInstance(job.instanceId, job.application ?? "chromium");
  }
}

async function main() {
  console.log("Worker started, waiting for jobs...");
  while (true) {
    try {
      const result = await jobsRedis.brpop("deployment_jobs", 0);
      if (result) {
        const [, jobStr] = result;
        await processJob(jobStr);
      }
    } catch (e) {
      console.error("Worker error:", e);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

main();
