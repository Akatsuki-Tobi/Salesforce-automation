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
}