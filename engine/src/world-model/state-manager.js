import { AgentState } from "../types/agent.js";
const initialState = {
    goal: "",
    browser: {
        currentUrl: "",
        pageTitle: "",
        activeTab: "",
        openTabs: [],
    },
    memory: {
        completedActions: [],
        failedActions: [],
        discoveredFacts: [],
    },
    environment: {
        authenticated: false,
        blocked: false,
    },
    observations: [],
    status: {
        state: AgentState.OBSERVE,
        stepCount: 0,
    },
    // RAG state
    knowledgeContext: [],
    knowledgeGaps: [],
    searchedQueries: [],
    ragBudget: {
        searchesUsed: 0,
        pagesScraped: 0,
        documentsStored: 0,
        startTime: Date.now(),
    },
};
let worldState = { ...initialState };
export function getWorldModel() {
    return JSON.parse(JSON.stringify(worldState));
}
export function updateGoal(goal) {
    worldState.goal = goal;
}
export function updateBrowserState(browser) {
    worldState.browser = { ...worldState.browser, ...browser };
}
export function addObservation(observation) {
    worldState.observations.push(observation);
}
export function addCompletedAction(action) {
    worldState.memory.completedActions.push(action);
}
export function addFailedAction(action) {
    worldState.memory.failedActions.push(action);
}
export function addDiscoveredFact(fact) {
    worldState.memory.discoveredFacts.push(fact);
}
export function updateEnvironment(environment) {
    worldState.environment = { ...worldState.environment, ...environment };
}
export function updateStatus(status) {
    worldState.status = { ...worldState.status, ...status };
}
export function setWorldModel(state) {
    worldState = { ...state, observations: [...state.observations], memory: { ...state.memory, completedActions: [...state.memory.completedActions], failedActions: [...state.memory.failedActions], discoveredFacts: [...state.memory.discoveredFacts] }, browser: { ...state.browser, openTabs: [...state.browser.openTabs] } };
}
// RAG state management
export function setKnowledgeContext(chunks) {
    worldState.knowledgeContext = chunks;
}
export function addKnowledgeGap(gap) {
    worldState.knowledgeGaps = worldState.knowledgeGaps ?? [];
    worldState.knowledgeGaps.push(gap);
}
export function resolveKnowledgeGap(query) {
    worldState.knowledgeGaps = worldState.knowledgeGaps?.map((gap) => gap.query === query ? { ...gap, resolved: true } : gap);
}
export function recordSearchedQuery(query) {
    worldState.searchedQueries = worldState.searchedQueries ?? [];
    if (!worldState.searchedQueries.includes(query)) {
        worldState.searchedQueries.push(query);
    }
}
export function consumeRagBudget(amount) {
    if (!worldState.ragBudget) {
        worldState.ragBudget = { searchesUsed: 0, pagesScraped: 0, documentsStored: 0, startTime: Date.now() };
    }
    worldState.ragBudget.searchesUsed += amount;
}
export function resetRagBudget() {
    worldState.ragBudget = {
        searchesUsed: 0,
        pagesScraped: 0,
        documentsStored: 0,
        startTime: Date.now(),
    };
}
//# sourceMappingURL=state-manager.js.map