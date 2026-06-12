export declare enum AgentState {
    OBSERVE = "OBSERVE",
    PLAN = "PLAN",
    VALIDATE = "VALIDATE",
    EXECUTE = "EXECUTE",
    VERIFY = "VERIFY",
    REFLECT = "REFLECT",
    RECOVER = "RECOVER",
    COMPLETE = "COMPLETE",
    FAILED = "FAILED"
}
export interface BrowserTab {
    tabId: string;
    title: string;
    url: string;
    purpose: string;
}
export interface ActionRecord {
    id: string;
    action: string;
    params: Record<string, unknown>;
    result: string;
    timestamp: number;
}
export interface Observation {
    url: string;
    title: string;
    timestamp: number;
    screenshotPath: string;
    dom: DOMNode[];
    accessibilityTree: unknown;
    visibleText: string;
    forms: FormInfo[];
    breadcrumbs: string[];
}
export interface DOMNode {
    tag: string;
    role?: string;
    text?: string;
    ariaLabel?: string;
    placeholder?: string;
    visible: boolean;
    disabled: boolean;
    selector: string;
    xpath: string;
}
export interface FormInfo {
    name?: string;
    action?: string;
    inputs: Array<{
        name?: string;
        type?: string;
        placeholder?: string;
        label?: string;
    }>;
}
export interface WorldModel {
    goal: string;
    browser: {
        currentUrl: string;
        pageTitle: string;
        activeTab: string;
        openTabs: BrowserTab[];
    };
    memory: {
        completedActions: ActionRecord[];
        failedActions: ActionRecord[];
        discoveredFacts: string[];
    };
    environment: {
        authenticated: boolean;
        blocked: boolean;
        blockingReason?: string;
    };
    observations: Observation[];
    status: {
        state: AgentState;
        stepCount: number;
    };
    knowledgeContext?: RetrievedContext[];
    knowledgeGaps?: KnowledgeGap[];
    searchedQueries?: string[];
    ragBudget?: {
        searchesUsed: number;
        pagesScraped: number;
        documentsStored: number;
        startTime: number;
    };
}
export interface PlannerOutput {
    thought: string;
    confidence: number;
    expected_outcome: string;
    action: string;
    params: Record<string, unknown>;
    is_complete: boolean;
    knowledgeQuery?: string;
    retrievedContextUsed?: boolean;
}
export declare enum LearningState {
    KNOWN = "KNOWN",
    UNKNOWN = "UNKNOWN",
    SEARCHING = "SEARCHING",
    LEARNING = "LEARNING",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED"
}
export declare enum KnowledgeType {
    DOCUMENTATION = "DOCUMENTATION",
    WORKFLOW = "WORKFLOW",
    CONFIGURATION = "CONFIGURATION",
    ERROR_FIX = "ERROR_FIX",
    UI_PATTERN = "UI_PATTERN",
    REFERENCE = "REFERENCE"
}
export interface SearchResult {
    title: string;
    snippet: string;
    url: string;
}
export interface KnowledgeScore {
    sourceAuthority: number;
    relevance: number;
    freshness: number;
    confidence: number;
}
export interface KnowledgeChunk {
    chunkId: string;
    content: string;
    source: string;
    url?: string;
    title?: string;
    timestamp: number;
    knowledgeType: KnowledgeType;
    embedding?: number[];
    metadata?: Record<string, unknown>;
}
export interface KnowledgeGap {
    description: string;
    query: string;
    detectedAtStep: number;
    resolved: boolean;
}
export interface RetrievedContext {
    chunks: KnowledgeChunk[];
    query: string;
    retrievalLatencyMs: number;
}
export declare const RAG_MAX_SEARCHES = 3;
export declare const RAG_MAX_SCRAPED_PAGES = 10;
export declare const RAG_MAX_RAG_DOCUMENTS = 20;
export declare const RAG_MAX_CONTEXT_TOKENS = 15000;
export declare const RAG_MAX_RESEARCH_TIME = 120000;
export declare const RAG_CONFIDENCE_THRESHOLD = 0.7;
export declare const RAG_TOP_K = 5;
export declare const DOMAIN_WEIGHTS: Record<string, number>;
//# sourceMappingURL=agent.d.ts.map