import { HealthCheckResult } from "../types/monitoring.js";
import { TelemetryService } from "../monitoring/telemetry-service.js";

export interface HealthCheck {
  name: string;
  check: () => Promise<{ status: "ok" | "error"; message?: string }>;
  interval?: number; // in milliseconds
}

export class HealthCheckService {
  private static instance: HealthCheckService;
  private checks: Map<string, HealthCheck> = new Map();
  private checkIntervals: Map<string, NodeJS.Timeout> = new Map();
  private telemetryService: TelemetryService;
  private lastCheckResult: HealthCheckResult | null = null;

  private constructor() {
    this.telemetryService = TelemetryService.getInstance();
  }

  public static getInstance(): HealthCheckService {
    if (!HealthCheckService.instance) {
      HealthCheckService.instance = new HealthCheckService();
    }
    return HealthCheckService.instance;
  }

  public registerCheck(check: HealthCheck): void {
    this.checks.set(check.name, check);
    
    // If an interval is specified, set up periodic checking
    if (check.interval) {
      const intervalId = setInterval(async () => {
        await this.runCheck(check.name);
      }, check.interval);
      this.checkIntervals.set(check.name, intervalId);
    }
  }

  public unregisterCheck(name: string): void {
    this.checks.delete(name);
    const intervalId = this.checkIntervals.get(name);
    if (intervalId) {
      clearInterval(intervalId);
      this.checkIntervals.delete(name);
    }
  }

  public async runCheck(name: string): Promise<{ status: "ok" | "error"; message?: string }> {
    const check = this.checks.get(name);
    if (!check) {
      return { status: "error", message: `Check "${name}" not found` };
    }

    try {
      const result = await check.check();
      this.telemetryService.emitEvent(
        "HealthCheckService",
        "HEALTH_CHECK",
        { check: name, status: result.status, message: result.message }
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.telemetryService.emitEvent(
        "HealthCheckService",
        "HEALTH_CHECK",
        { check: name, status: "error", message: errorMessage }
      );
      return { status: "error", message: errorMessage };
    }
  }

  public async runAllChecks(): Promise<HealthCheckResult> {
    const results: Record<string, { status: "ok" | "error"; message?: string }> = {};
    let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy";

    for (const [name, check] of this.checks) {
      const result = await this.runCheck(name);
      results[name] = result;
      
      if (result.status === "error") {
        overallStatus = "unhealthy";
      } else if (overallStatus === "healthy") {
        overallStatus = "degraded";
      }
    }

    this.lastCheckResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: results,
    };

    return this.lastCheckResult;
  }

  public getLastCheckResult(): HealthCheckResult | null {
    return this.lastCheckResult;
  }

  public getCheckNames(): string[] {
    return Array.from(this.checks.keys());
  }

  public clearChecks(): void {
    this.checks.clear();
    for (const intervalId of this.checkIntervals.values()) {
      clearInterval(intervalId);
    }
    this.checkIntervals.clear();
  }

  // Built-in health checks
  public registerDefaultChecks(): void {
    // Memory usage check
    this.registerCheck({
      name: "memory_usage",
      check: async () => {
        const memoryUsage = process.memoryUsage();
        const heapUsed = memoryUsage.heapUsed / 1024 / 1024; // in MB
        if (heapUsed > 500) { // Threshold: 500MB
          return {
            status: "error",
            message: `High memory usage: ${heapUsed.toFixed(2)}MB`,
          };
        }
        return { status: "ok", message: `Memory usage: ${heapUsed.toFixed(2)}MB` };
      },
      interval: 60000, // Check every minute
    });

    // Event loop lag check
    this.registerCheck({
      name: "event_loop",
      check: async () => {
        const start = Date.now();
        return new Promise((resolve) => {
          setImmediate(() => {
            const lag = Date.now() - start;
            if (lag > 100) { // Threshold: 100ms
              resolve({
                status: "error",
                message: `Event loop lag: ${lag}ms`,
              });
            } else {
              resolve({ status: "ok", message: `Event loop lag: ${lag}ms` });
            }
          });
        });
      },
      interval: 30000, // Check every 30 seconds
    });

    // Telemetry service check
    this.registerCheck({
      name: "telemetry_service",
      check: async () => {
        try {
          const events = this.telemetryService.getEvents();
          return {
            status: "ok",
            message: `Telemetry service active (${events.length} events)`,
          };
        } catch (error) {
          return {
            status: "error",
            message: `Telemetry service error: ${error instanceof Error ? error.message : String(error)}`,
          };
        }
      },
      interval: 60000, // Check every minute
    });

    if (!this.checks.has("model_rotation")) {
        this.checks.set("model_rotation", {
            name: "model_rotation",
            check: async () => {
                // logic to check model rotation
                return { status: "ok" };
            },
            interval: 30000,
        });
    }
  }
}
