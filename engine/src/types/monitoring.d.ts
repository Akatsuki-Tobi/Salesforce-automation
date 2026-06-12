export declare enum AgentState {
    IDLE = "Idle",
    PLANNING = "Planning",
    EXECUTING = "Executing",
    VERIFYING = "Verifying",
    RECOVERING = "Recovering",
    LEARNING = "Learning",
    COMPLETED = "Completed",
    FAILED = "Failed",
    BLOCKED = "Blocked"
}
export declare enum TaskState {
    NOT_STARTED = "Not Started",
    IN_PROGRESS = "In Progress",
    COMPLETED = "Completed",
    BLOCKED = "Blocked",
    FAILED = "Failed"
}
export declare enum TelemetryEventType {
    PLANNER_DECISION = "PLANNER_DECISION",
    ACTION_EXECUTED = "ACTION_EXECUTED",
    VERIFICATION_PASSED = "VERIFICATION_PASSED",
    VERIFICATION_FAILED = "VERIFICATION_FAILED",
    SKILL_EXECUTED = "SKILL_EXECUTED",
    SKILL_CREATED = "SKILL_CREATED",
    RECOVERY_TRIGGERED = "RECOVERY_TRIGGERED",
    ERROR_DETECTED = "ERROR_DETECTED",
    OBSERVATION_CAPTURED = "OBSERVATION_CAPTURED",
    KNOWLEDGE_RETRIEVED = "KNOWLEDGE_RETRIEVED"
}
export interface TelemetryEvent {
    timestamp: string;
    source: string;
    type: TelemetryEventType;
    payload: Record<string, unknown>;
}
export interface SystemMetrics {
    executionSuccessRate: number;
    verificationSuccessRate: number;
    recoverySuccessRate: number;
    averageExecutionTime: number;
    averagePlanningTime: number;
    skillReuseRate: number;
    knowledgeRetrievalRate: number;
}
export interface SkillMetrics {
    skillId: string;
    usageCount: number;
    successCount: number;
    failureCount: number;
    averageRuntime: number;
    confidenceScore: number;
    lastUsed: string;
}
export interface AuditRecord {
    timestamp: string;
    goal: string;
    action: string;
    result: string;
    verification?: string;
    recovery?: string;
    snapshot?: {
        domSnapshot?: string;
        pageMetadata?: Record<string, unknown>;
        executionState?: Record<string, unknown>;
    };
}
export declare enum FailureCategory {
    SELECTOR_FAILURE = "SELECTOR_FAILURE",
    EXECUTION_FAILURE = "EXECUTION_FAILURE",
    VERIFICATION_FAILURE = "VERIFICATION_FAILURE",
    RECOVERY_FAILURE = "RECOVERY_FAILURE",
    KNOWLEDGE_FAILURE = "KNOWLEDGE_FAILURE",
    UNKNOWN = "UNKNOWN"
}
export interface FailureAnalysis {
    failureCategory: FailureCategory;
    rootCause: string;
    improvementProposal: string;
    validation: boolean;
    knowledgeUpdate?: Record<string, unknown>;
}
export interface WorkflowProgress {
    totalTasks: number;
    completedTasks: number;
    remainingTasks: number;
    blockedTasks: number;
    successRate: number;
}
export interface DashboardData {
    agentStatus: AgentState;
    currentGoal: string;
    currentTask: string;
    currentStep: number;
    workflowProgress: WorkflowProgress;
    activityFeed: TelemetryEvent[];
    skillUsage: SkillMetrics[];
    systemMetrics: SystemMetrics;
}
export interface Trace {
    id: string;
    name: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    metadata?: Record<string, unknown>;
    children: Trace[];
}
export interface HealthCheckResult {
    status: "healthy" | "degraded" | "unhealthy";
    timestamp: string;
    checks: Record<string, {
        status: "ok" | "error";
        message?: string;
    }>;
}
//# sourceMappingURL=monitoring.d.ts.map