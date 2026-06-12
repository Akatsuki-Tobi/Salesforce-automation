import { AuditRecord, FailureAnalysis, FailureCategory, } from "../types/monitoring.js";
import { TelemetryService } from "./telemetry-service.js";
import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
export class AuditService {
    static instance;
    auditRecords = [];
    failureAnalyses = [];
    auditDir;
    telemetryService;
    constructor() {
        this.telemetryService = TelemetryService.getInstance();
        this.auditDir = join(process.cwd(), "logs", "audit");
        this.ensureAuditDir();
        this.setupEventListeners();
        this.loadExistingRecords();
    }
    static getInstance() {
        if (!AuditService.instance) {
            AuditService.instance = new AuditService();
        }
        return AuditService.instance;
    }
    ensureAuditDir() {
        if (!existsSync(this.auditDir)) {
            mkdirSync(this.auditDir, { recursive: true });
        }
    }
    setupEventListeners() {
        this.telemetryService.subscribe((event) => {
            this.processEvent(event);
        });
    }
    loadExistingRecords() {
        try {
            const files = readdirSync(this.auditDir);
            for (const file of files) {
                if (file.endsWith(".json")) {
                    const filePath = join(this.auditDir, file);
                    const content = readFileSync(filePath, "utf-8");
                    const record = JSON.parse(content);
                    if ("timestamp" in record && "goal" in record) {
                        this.auditRecords.push(record);
                    }
                    else if ("failureCategory" in record) {
                        this.failureAnalyses.push(record);
                    }
                }
            }
        }
        catch (error) {
            console.error("Error loading existing audit records:", error);
        }
    }
    processEvent(event) {
        // Create an audit record for significant events
        if (event.type === "ACTION_EXECUTED" ||
            event.type === "VERIFICATION_FAILED" ||
            event.type === "RECOVERY_TRIGGERED" ||
            event.type === "ERROR_DETECTED") {
            const auditRecord = {
                timestamp: event.timestamp,
                goal: event.payload.goal || "",
                action: event.payload.action || "",
                result: event.payload.result || "",
                verification: event.payload.verification,
                recovery: event.payload.recovery,
                snapshot: event.payload.snapshot,
            };
            this.auditRecords.push(auditRecord);
            this.saveAuditRecord(auditRecord);
        }
    }
    saveAuditRecord(record) {
        const fileName = `audit-${record.timestamp.replace(/[:.]/g, "-")}.json`;
        const filePath = join(this.auditDir, fileName);
        writeFileSync(filePath, JSON.stringify(record, null, 2));
    }
    addFailureAnalysis(analysis) {
        this.failureAnalyses.push(analysis);
        const fileName = `failure-${analysis.rootCause.replace(/\s+/g, "-")}-${Date.now()}.json`;
        const filePath = join(this.auditDir, fileName);
        writeFileSync(filePath, JSON.stringify(analysis, null, 2));
    }
    getAuditRecords() {
        return [...this.auditRecords];
    }
    getFailureAnalyses() {
        return [...this.failureAnalyses];
    }
    exportAuditRecords(format) {
        if (format === "json") {
            return JSON.stringify(this.auditRecords, null, 2);
        }
        else {
            // Convert to CSV
            const headers = [
                "timestamp",
                "goal",
                "action",
                "result",
                "verification",
                "recovery",
            ];
            const rows = this.auditRecords.map((record) => headers
                .map((header) => {
                const value = record[header];
                return typeof value === "string"
                    ? value.replace(/"/g, '""')
                    : JSON.stringify(value);
            })
                .join(","));
            return [headers.join(","), ...rows].join("\n");
        }
    }
    redactSensitiveData(data) {
        // Redact sensitive information (e.g., passwords, tokens, API keys)
        const sensitivePatterns = [
            /password=[^&\s]+/gi,
            /token=[^&\s]+/gi,
            /api[_-]?key=[^&\s]+/gi,
            /session[_-]?id=[^&\s]+/gi,
            /secret=[^&\s]+/gi,
            /auth=[^&\s]+/gi,
        ];
        return sensitivePatterns.reduce((acc, pattern) => acc.replace(pattern, "[REDACTED]"), data);
    }
    addSnapshot(auditRecordId, snapshot) {
        const record = this.auditRecords.find((r) => r.timestamp === auditRecordId);
        if (record) {
            record.snapshot = snapshot;
            this.saveAuditRecord(record);
        }
    }
    clearAuditRecords() {
        this.auditRecords = [];
        this.failureAnalyses = [];
    }
}
//# sourceMappingURL=audit-service.js.map