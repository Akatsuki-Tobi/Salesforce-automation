"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorldModel = getWorldModel;
exports.updateGoal = updateGoal;
exports.updateBrowserState = updateBrowserState;
exports.addObservation = addObservation;
exports.addCompletedAction = addCompletedAction;
exports.addFailedAction = addFailedAction;
exports.addDiscoveredFact = addDiscoveredFact;
exports.updateEnvironment = updateEnvironment;
exports.updateStatus = updateStatus;
exports.setWorldModel = setWorldModel;
exports.setKnowledgeContext = setKnowledgeContext;
exports.addKnowledgeGap = addKnowledgeGap;
exports.resolveKnowledgeGap = resolveKnowledgeGap;
exports.recordSearchedQuery = recordSearchedQuery;
exports.consumeRagBudget = consumeRagBudget;
exports.resetRagBudget = resetRagBudget;
const agent_js_1 = require("../types/agent.js");
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
        state: agent_js_1.AgentState.OBSERVE,
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
function getWorldModel() {
    return JSON.parse(JSON.stringify(worldState));
}
function updateGoal(goal) {
    worldState.goal = goal;
}
function updateBrowserState(browser) {
    worldState.browser = { ...worldState.browser, ...browser };
}
function addObservation(observation) {
    worldState.observations.push(observation);
}
function addCompletedAction(action) {
    worldState.memory.completedActions.push(action);
}
function addFailedAction(action) {
    worldState.memory.failedActions.push(action);
}
function addDiscoveredFact(fact) {
    worldState.memory.discoveredFacts.push(fact);
}
function updateEnvironment(environment) {
    worldState.environment = { ...worldState.environment, ...environment };
}
function updateStatus(status) {
    worldState.status = { ...worldState.status, ...status };
}
function setWorldModel(state) {
    worldState = { ...state, observations: [...state.observations], memory: { ...state.memory, completedActions: [...state.memory.completedActions], failedActions: [...state.memory.failedActions], discoveredFacts: [...state.memory.discoveredFacts] }, browser: { ...state.browser, openTabs: [...state.browser.openTabs] } };
}
// RAG state management
function setKnowledgeContext(chunks) {
    worldState.knowledgeContext = chunks;
}
function addKnowledgeGap(gap) {
    worldState.knowledgeGaps = worldState.knowledgeGaps ?? [];
    worldState.knowledgeGaps.push(gap);
}
function resolveKnowledgeGap(query) {
    worldState.knowledgeGaps = worldState.knowledgeGaps?.map((gap) => gap.query === query ? { ...gap, resolved: true } : gap);
}
function recordSearchedQuery(query) {
    worldState.searchedQueries = worldState.searchedQueries ?? [];
    if (!worldState.searchedQueries.includes(query)) {
        worldState.searchedQueries.push(query);
    }
}
function consumeRagBudget(amount) {
    if (!worldState.ragBudget) {
        worldState.ragBudget = { searchesUsed: 0, pagesScraped: 0, documentsStored: 0, startTime: Date.now() };
    }
    worldState.ragBudget.searchesUsed += amount;
}
function resetRagBudget() {
    worldState.ragBudget = {
        searchesUsed: 0,
        pagesScraped: 0,
        documentsStored: 0,
        startTime: Date.now(),
    };
}
