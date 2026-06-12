// Agent Status
export var AgentState;
(function (AgentState) {
    AgentState["IDLE"] = "Idle";
    AgentState["PLANNING"] = "Planning";
    AgentState["EXECUTING"] = "Executing";
    AgentState["VERIFYING"] = "Verifying";
    AgentState["RECOVERING"] = "Recovering";
    AgentState["LEARNING"] = "Learning";
    AgentState["COMPLETED"] = "Completed";
    AgentState["FAILED"] = "Failed";
    AgentState["BLOCKED"] = "Blocked";
})(AgentState || (AgentState = {}));
// Task State
export var TaskState;
(function (TaskState) {
    TaskState["NOT_STARTED"] = "Not Started";
    TaskState["IN_PROGRESS"] = "In Progress";
    TaskState["COMPLETED"] = "Completed";
    TaskState["BLOCKED"] = "Blocked";
    TaskState["FAILED"] = "Failed";
})(TaskState || (TaskState = {}));
// Event Types
export var TelemetryEventType;
(function (TelemetryEventType) {
    TelemetryEventType["PLANNER_DECISION"] = "PLANNER_DECISION";
    TelemetryEventType["ACTION_EXECUTED"] = "ACTION_EXECUTED";
    TelemetryEventType["VERIFICATION_PASSED"] = "VERIFICATION_PASSED";
    TelemetryEventType["VERIFICATION_FAILED"] = "VERIFICATION_FAILED";
    TelemetryEventType["SKILL_EXECUTED"] = "SKILL_EXECUTED";
    TelemetryEventType["SKILL_CREATED"] = "SKILL_CREATED";
    TelemetryEventType["RECOVERY_TRIGGERED"] = "RECOVERY_TRIGGERED";
    TelemetryEventType["ERROR_DETECTED"] = "ERROR_DETECTED";
    TelemetryEventType["OBSERVATION_CAPTURED"] = "OBSERVATION_CAPTURED";
    TelemetryEventType["KNOWLEDGE_RETRIEVED"] = "KNOWLEDGE_RETRIEVED";
})(TelemetryEventType || (TelemetryEventType = {}));
// Failure Categories
export var FailureCategory;
(function (FailureCategory) {
    FailureCategory["SELECTOR_FAILURE"] = "SELECTOR_FAILURE";
    FailureCategory["EXECUTION_FAILURE"] = "EXECUTION_FAILURE";
    FailureCategory["VERIFICATION_FAILURE"] = "VERIFICATION_FAILURE";
    FailureCategory["RECOVERY_FAILURE"] = "RECOVERY_FAILURE";
    FailureCategory["KNOWLEDGE_FAILURE"] = "KNOWLEDGE_FAILURE";
    FailureCategory["UNKNOWN"] = "UNKNOWN";
})(FailureCategory || (FailureCategory = {}));
//# sourceMappingURL=monitoring.js.map