import { spawn, execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export interface ContainerConfig {
  instanceId: string;
  image: string;
  port: number;
}

export interface ContainerRuntime {
  start(config: ContainerConfig): Promise<void>;
  stop(instanceId: string): Promise<void>;
  status(instanceId: string): Promise<string>;
}

export class DockerContainerRuntime implements ContainerRuntime {
  async start(config: ContainerConfig): Promise<void> {
    const containerName = `chromium-runtime-${config.instanceId}`;

    // Idempotency: cleanup existing container
    try {
      await execFileAsync("docker", ["inspect", containerName]);
      console.log(`Container ${containerName} exists. Removing...`);
      await execFileAsync("docker", ["rm", "-f", containerName]);
    } catch (e: any) {
      // If error code is not 1 (not found), then rethrow
      if (e.code && e.code !== 1 && !e.message?.includes("No such object")) {
        console.error("Docker cleanup error", e);
        throw e;
      }
    }

    const dockerArgs = [
      "run", "-d",
      "--name", containerName,
      "-p", `${config.port}:8080`,
      "--shm-size=1g",
      config.image
    ];

    return new Promise((resolve, reject) => {
      const child = spawn("docker", dockerArgs);
      
      child.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Docker start failed with code ${code}`));
      });
      child.on("error", (error) => {
        reject(error);
      });
    });
  }

  async stop(instanceId: string): Promise<void> {
    const containerName = `chromium-runtime-${instanceId}`;
    try {
      await execFileAsync("docker", ["rm", "-f", containerName]);
    } catch (e: any) {
      if (e.code && e.code !== 1 && !e.message?.includes("No such object")) {
        console.error(`Failed to stop container ${containerName}`, e);
        throw e;
      }
    }
  }

  async status(instanceId: string): Promise<string> {
    const containerName = `chromium-runtime-${instanceId}`;
    try {
      const { stdout } = await execFileAsync("docker", ["inspect", "--format='{{.State.Status}}'", containerName]);
      return stdout.trim().replace(/['"]/g, '');
    } catch (e) {
      return "not_found";
    }
  }
}
