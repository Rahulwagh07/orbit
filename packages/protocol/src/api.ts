import { z } from "zod";

export const CreateWindowRequestSchema = z.object({
  application: z.enum(["chromium", "vscode", "terminal"])
});

export const CreateWindowResponseSchema = z.object({
  window_id: z.string(),
  app_id: z.string(),
  instance_id: z.string(),
  deployed_url: z.string(),
  is_new_deploy: z.boolean(),
  status: z.enum([
    "PENDING",
    "CREATING",
    "STARTING",
    "WAITING_READY",
    "READY",
    "STOPPING",
    "STOPPED",
    "FAILED"
  ])
});

export const HeartbeatResponseSchema = z.object({
  status: z.literal("ok")
});

export const DeploymentJobSchema = z.object({
  type: z.enum(["deploy", "stop"]),
  instanceId: z.string(),
  application: z.enum(["chromium", "vscode", "terminal"]).optional()
});

export type CreateWindowRequest = z.infer<typeof CreateWindowRequestSchema>;
export type CreateWindowResponse = z.infer<typeof CreateWindowResponseSchema>;
export type HeartbeatResponse = z.infer<typeof HeartbeatResponseSchema>;
export type DeploymentJob = z.infer<typeof DeploymentJobSchema>;
