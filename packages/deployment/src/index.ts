import { DeploymentPhase } from "@repo/db";

export interface DeploymentEvent {
  phase: DeploymentPhase;
  phase_display: string;
  progress: number;
  is_retryable: boolean;
  instance_id: string;
  deployed_url?: string;
  error_code?: string;
}

export const DEPLOYMENT_PHASES: Record<DeploymentPhase, { display: string, progress: number }> = {
  CREATING_RESOURCES: { display: "Setting up environment...", progress: 11 },
  CONTAINER_STARTING: { display: "Starting application...", progress: 44 },
  WAITING_READY: { display: "Waiting for application to start...", progress: 55 },
  CONFIGURING_NETWORK: { display: "Configuring network access...", progress: 75 },
  READY: { display: "Ready", progress: 100 },
  FAILED: { display: "Application failed to start", progress: 100 }
};

export class DeploymentStateMachine {
  constructor(private instanceId: string, private onStateChange: (event: DeploymentEvent) => void) {}

  transition(phase: DeploymentPhase, options?: { deployed_url?: string, error_code?: string, is_retryable?: boolean }) {
    const phaseInfo = DEPLOYMENT_PHASES[phase];
    const event: DeploymentEvent = {
      phase,
      phase_display: phaseInfo.display,
      progress: phaseInfo.progress,
      is_retryable: options?.is_retryable ?? false,
      instance_id: this.instanceId,
      ...options
    };
    // Return the callback result so callers can await async side effects
    // (e.g. persisting + publishing READY) before moving on
    return this.onStateChange(event) as unknown as Promise<void> | void;
  }
}
