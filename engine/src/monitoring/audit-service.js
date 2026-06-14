"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const telemetry_service_js_1 = require("./telemetry-service.js");
const fs_1 = require("fs");
const path_1 = require("path");
class AuditService {
    constructor() {
        this.auditRecords = [];
        this.failureAnalyses = [];
        this.telemetryService = telemetry_service_js_1.TelemetryService.getInstance();
        this.auditDir = (0, path_1.join)(process.cwd(), "logs", "audit");
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
        if (!(0, fs_1.existsSync)(this.auditDir)) {
            (0, fs_1.mkdirSync)(this.auditDir, { recursive: true });
        }
    }
    setupEventListeners() {
        this.telemetryService.subscribe((event) => {
            this.processEvent(event);
        });
    }
    loadExistingRecords() {
        try {
            const files = (0, fs_1.readdirSync)(this.auditDir);
            for (const file of files) {
                if (file.endsWith(".json")) {
                    const filePath = (0, path_1.join)(this.auditDir, file);
                    const content = (0, fs_1.readFileSync)(filePath, "utf-8");
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
        const filePath = (0, path_1.join)(this.auditDir, fileName);
        (0, fs_1.writeFileSync)(filePath, JSON.stringify(record, null, 2));
    }
    addFailureAnalysis(analysis) {
        this.failureAnalyses.push(analysis);
        const fileName = `failure-${analysis.rootCause.replace(/\s+/g, "-")}-${Date.now()}.json`;
        const filePath = (0, path_1.join)(this.auditDir, fileName);
        (0, fs_1.writeFileSync)(filePath, JSON.stringify(analysis, null, 2));
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
exports.AuditService = AuditService;
