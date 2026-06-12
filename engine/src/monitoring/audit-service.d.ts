import { AuditRecord, FailureAnalysis } from "../types/monitoring.js";
export declare class AuditService {
    private static instance;
    private auditRecords;
    private failureAnalyses;
    private auditDir;
    private telemetryService;
    private constructor();
    static getInstance(): AuditService;
    private ensureAuditDir;
    private setupEventListeners;
    private loadExistingRecords;
    private processEvent;
    private saveAuditRecord;
    addFailureAnalysis(analysis: FailureAnalysis): void;
    getAuditRecords(): AuditRecord[];
    getFailureAnalyses(): FailureAnalysis[];
    exportAuditRecords(format: "json" | "csv"): string;
    redactSensitiveData(data: string): string;
    addSnapshot(auditRecordId: string, snapshot: {
        domSnapshot?: string;
        pageMetadata?: Record<string, unknown>;
        executionState?: Record<string, unknown>;
    }): void;
    clearAuditRecords(): void;
}
//# sourceMappingURL=audit-service.d.ts.map