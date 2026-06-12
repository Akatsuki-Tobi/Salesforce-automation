import { HealthCheckResult } from "../types/monitoring.js";
import { TelemetryService } from "../monitoring/telemetry-service.js";
export class HealthCheckService {
    static instance;
    checks = new Map();
    checkIntervals = new Map();
    telemetryService;
    lastCheckResult = null;
    constructor() {
        this.telemetryService = TelemetryService.getInstance();
    }
    static getInstance() {
        if (!HealthCheckService.instance) {
            HealthCheckService.instance = new HealthCheckService();
        }
        return HealthCheckService.instance;
    }
    registerCheck(check) {
        this.checks.set(check.name, check);
        // If an interval is specified, set up periodic checking
        if (check.interval) {
            const intervalId = setInterval(async () => {
                await this.runCheck(check.name);
            }, check.interval);
            this.checkIntervals.set(check.name, intervalId);
        }
    }
    unregisterCheck(name) {
        this.checks.delete(name);
        const intervalId = this.checkIntervals.get(name);
        if (intervalId) {
            clearInterval(intervalId);
            this.checkIntervals.delete(name);
        }
    }
    async runCheck(name) {
        const check = this.checks.get(name);
        if (!check) {
            return { status: "error", message: `Check "${name}" not found` };
        }
        try {
            const result = await check.check();
            this.telemetryService.emitEvent("HealthCheckService", "HEALTH_CHECK", { check: name, status: result.status, message: result.message });
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.telemetryService.emitEvent("HealthCheckService", "HEALTH_CHECK", { check: name, status: "error", message: errorMessage });
            return { status: "error", message: errorMessage };
        }
    }
    async runAllChecks() {
        const results = {};
        let overallStatus = "healthy";
        for (const [name, check] of this.checks) {
            const result = await this.runCheck(name);
            results[name] = result;
            if (result.status === "error") {
                overallStatus = "unhealthy";
            }
            else if (overallStatus === "healthy") {
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
    getLastCheckResult() {
        return this.lastCheckResult;
    }
    getCheckNames() {
        return Array.from(this.checks.keys());
    }
    clearChecks() {
        this.checks.clear();
        for (const intervalId of this.checkIntervals.values()) {
            clearInterval(intervalId);
        }
        this.checkIntervals.clear();
    }
    // Built-in health checks
    registerDefaultChecks() {
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
                        }
                        else {
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
                }
                catch (error) {
                    return {
                        status: "error",
                        message: `Telemetry service error: ${error instanceof Error ? error.message : String(error)}`,
                    };
                }
            },
            interval: 60000, // Check every minute
        });
    }
}
//# sourceMappingURL=health-check.js.map