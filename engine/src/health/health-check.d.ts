import { HealthCheckResult } from "../types/monitoring.js";
export interface HealthCheck {
    name: string;
    check: () => Promise<{
        status: "ok" | "error";
        message?: string;
    }>;
    interval?: number;
}
export declare class HealthCheckService {
    private static instance;
    private checks;
    private checkIntervals;
    private telemetryService;
    private lastCheckResult;
    private constructor();
    static getInstance(): HealthCheckService;
    registerCheck(check: HealthCheck): void;
    unregisterCheck(name: string): void;
    runCheck(name: string): Promise<{
        status: "ok" | "error";
        message?: string;
    }>;
    runAllChecks(): Promise<HealthCheckResult>;
    getLastCheckResult(): HealthCheckResult | null;
    getCheckNames(): string[];
    clearChecks(): void;
    registerDefaultChecks(): void;
}
//# sourceMappingURL=health-check.d.ts.map