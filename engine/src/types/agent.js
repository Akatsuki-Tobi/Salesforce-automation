export var AgentState;
(function (AgentState) {
    AgentState["OBSERVE"] = "OBSERVE";
    AgentState["PLAN"] = "PLAN";
    AgentState["VALIDATE"] = "VALIDATE";
    AgentState["EXECUTE"] = "EXECUTE";
    AgentState["VERIFY"] = "VERIFY";
    AgentState["REFLECT"] = "REFLECT";
    AgentState["RECOVER"] = "RECOVER";
    AgentState["COMPLETE"] = "COMPLETE";
    AgentState["FAILED"] = "FAILED";
})(AgentState || (AgentState = {}));
// ==================== RAG Types ====================
export var LearningState;
(function (LearningState) {
    LearningState["KNOWN"] = "KNOWN";
    LearningState["UNKNOWN"] = "UNKNOWN";
    LearningState["SEARCHING"] = "SEARCHING";
    LearningState["LEARNING"] = "LEARNING";
    LearningState["VERIFIED"] = "VERIFIED";
    LearningState["REJECTED"] = "REJECTED";
})(LearningState || (LearningState = {}));
export var KnowledgeType;
(function (KnowledgeType) {
    KnowledgeType["DOCUMENTATION"] = "DOCUMENTATION";
    KnowledgeType["WORKFLOW"] = "WORKFLOW";
    KnowledgeType["CONFIGURATION"] = "CONFIGURATION";
    KnowledgeType["ERROR_FIX"] = "ERROR_FIX";
    KnowledgeType["UI_PATTERN"] = "UI_PATTERN";
    KnowledgeType["REFERENCE"] = "REFERENCE";
})(KnowledgeType || (KnowledgeType = {}));
// ==================== RAG Budget Constants ====================
export const RAG_MAX_SEARCHES = 3;
export const RAG_MAX_SCRAPED_PAGES = 10;
export const RAG_MAX_RAG_DOCUMENTS = 20;
export const RAG_MAX_CONTEXT_TOKENS = 15000;
export const RAG_MAX_RESEARCH_TIME = 120000; // ms
export const RAG_CONFIDENCE_THRESHOLD = 0.70;
export const RAG_TOP_K = 5;
// Domain authority weights
export const DOMAIN_WEIGHTS = {
    "trailhead.salesforce.com": 10,
    "developer.salesforce.com": 10,
    "salesforce.com": 10,
    "help.salesforce.com": 10,
    "github.com": 7,
    "stackoverflow.com": 6,
    "community.salesforce.com": 6
};
//# sourceMappingURL=agent.js.map