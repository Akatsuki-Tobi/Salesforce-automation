import type { WorldModel, Observation, ActionRecord, BrowserTab } from "../types/agent.js";
import { AgentState } from "../types/agent.js";

const initialState: WorldModel = {
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
};

let worldState: WorldModel = { ...initialState };

export function getWorldModel(): WorldModel {
  return JSON.parse(JSON.stringify(worldState));
}

export function updateGoal(goal: string): void {
  worldState.goal = goal;
}

export function updateBrowserState(browser: Partial<WorldModel["browser"]>): void {
  worldState.browser = { ...worldState.browser, ...browser };
}

export function addObservation(observation: Observation): void {
  worldState.observations.push(observation);
}

export function addCompletedAction(action: ActionRecord): void {
  worldState.memory.completedActions.push(action);
}

export function addFailedAction(action: ActionRecord): void {
  worldState.memory.failedActions.push(action);
}

export function addDiscoveredFact(fact: string): void {
  worldState.memory.discoveredFacts.push(fact);
}

export function updateEnvironment(environment: Partial<WorldModel["environment"]>): void {
  worldState.environment = { ...worldState.environment, ...environment };
}

export function updateStatus(status: Partial<WorldModel["status"]>): void {
  worldState.status = { ...worldState.status, ...status };
}

export function setWorldModel(state: WorldModel): void {
  worldState = { ...state, observations: [...state.observations], memory: { ...state.memory, completedActions: [...state.memory.completedActions], failedActions: [...state.memory.failedActions], discoveredFacts: [...state.memory.discoveredFacts] }, browser: { ...state.browser, openTabs: [...state.browser.openTabs] } };
}
