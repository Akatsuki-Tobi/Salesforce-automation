import {
  AuditRecord,
  FailureAnalysis,
  FailureCategory,
} from "../types/monitoring.js";
import { TelemetryService } from "./telemetry-service.js";
import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

export class AuditService {
  private static instance: AuditService;
  private auditRecords: AuditRecord[] = [];
  private failureAnalyses: FailureAnalysis[] = [];
  private auditDir: string;
  private telemetryService: TelemetryService;

  private constructor() {
    this.telemetryService = TelemetryService.getInstance();
    this.auditDir = join(process.cwd(), "logs", "audit");
    this.ensureAuditDir();
    this.setupEventListeners();
    this.loadExistingRecords();
  }

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  private ensureAuditDir(): void {
    if (!existsSync(this.auditDir)) {
      mkdirSync(this.auditDir, { recursive: true });
    }
  }

  private setupEventListeners(): void {
    this.telemetryService.subscribe((event) => {
      this.processEvent(event);
    });
  }

  private loadExistingRecords(): void {
    try {
      const files = readdirSync(this.auditDir);
      for (const file of files) {
        if (file.endsWith(".json")) {
          const filePath = join(this.auditDir, file);
          const content = readFileSync(filePath, "utf-8");
          const record = JSON.parse(content) as AuditRecord | FailureAnalysis;
          if ("timestamp" in record && "goal" in record) {
            this.auditRecords.push(record as AuditRecord);
          } else if ("failureCategory" in record) {
            this.failureAnalyses.push(record as FailureAnalysis);
          }
        }
      }
    } catch (error) {
      console.error("Error loading existing audit records:", error);
    }
  }

  private processEvent(event: {
    timestamp: string;
    source: string;
    type: string;
    payload: Record<string, unknown>;
  }): void {
    // Create an audit record for significant events
    if (
      event.type === "ACTION_EXECUTED" ||
      event.type === "VERIFICATION_FAILED" ||
      event.type === "RECOVERY_TRIGGERED" ||
      event.type === "ERROR_DETECTED"
    ) {
      const auditRecord: AuditRecord = {
        timestamp: event.timestamp,
        goal: (event.payload.goal as string) || "",
        action: (event.payload.action as string) || "",
        result: (event.payload.result as string) || "",
        verification: event.payload.verification as string | undefined,
        recovery: event.payload.recovery as string | undefined,
        snapshot: event.payload.snapshot as
          | {
              domSnapshot?: string;
              pageMetadata?: Record<string, unknown>;
              executionState?: Record<string, unknown>;
            }
          | undefined,
      };
      this.auditRecords.push(auditRecord);
      this.saveAuditRecord(auditRecord);
    }
  }

  private saveAuditRecord(record: AuditRecord): void {
    const fileName = `audit-${record.timestamp.replace(/[:.]/g, "-")}.json`;
    const filePath = join(this.auditDir, fileName);
    writeFileSync(filePath, JSON.stringify(record, null, 2));
  }

  public addFailureAnalysis(analysis: FailureAnalysis): void {
    this.failureAnalyses.push(analysis);
    const fileName = `failure-${analysis.rootCause.replace(/\s+/g, "-")}-${Date.now()}.json`;
    const filePath = join(this.auditDir, fileName);
    writeFileSync(filePath, JSON.stringify(analysis, null, 2));
  }

  public getAuditRecords(): AuditRecord[] {
    return [...this.auditRecords];
  }

  public getFailureAnalyses(): FailureAnalysis[] {
    return [...this.failureAnalyses];
  }

  public exportAuditRecords(format: "json" | "csv"): string {
    if (format === "json") {
      return JSON.stringify(this.auditRecords, null, 2);
    } else {
      // Convert to CSV
      const headers = [
        "timestamp",
        "goal",
        "action",
        "result",
        "verification",
        "recovery",
      ];
      const rows = this.auditRecords.map((record) =>
        headers
          .map((header) => {
            const value = (record as Record<string, unknown>)[header];
            return typeof value === "string"
              ? value.replace(/"/g, '""')
              : JSON.stringify(value);
          })
          .join(",")
      );
      return [headers.join(","), ...rows].join("\n");
    }
  }

  public redactSensitiveData(data: string): string {
    // Redact sensitive information (e.g., passwords, tokens, API keys)
    const sensitivePatterns = [
      /password=[^&\s]+/gi,
      /token=[^&\s]+/gi,
      /api[_-]?key=[^&\s]+/gi,
      /session[_-]?id=[^&\s]+/gi,
      /secret=[^&\s]+/gi,
      /auth=[^&\s]+/gi,
    ];
    return sensitivePatterns.reduce(
      (acc, pattern) => acc.replace(pattern, "[REDACTED]"),
      data
    );
  }

  public addSnapshot(
    auditRecordId: string,
    snapshot: {
      domSnapshot?: string;
      pageMetadata?: Record<string, unknown>;
      executionState?: Record<string, unknown>;
    }
  ): void {
    const record = this.auditRecords.find((r) => r.timestamp === auditRecordId);
    if (record) {
      record.snapshot = snapshot;
      this.saveAuditRecord(record);
    }
  }

  public clearAuditRecords(): void {
    this.auditRecords = [];
    this.failureAnalyses = [];
  }
}
