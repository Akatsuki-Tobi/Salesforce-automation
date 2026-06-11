export enum AgentState {
  OBSERVE = "OBSERVE",
  PLAN = "PLAN",
  VALIDATE = "VALIDATE",
  EXECUTE = "EXECUTE",
  VERIFY = "VERIFY",
  REFLECT = "REFLECT",
  RECOVER = "RECOVER",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
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
}

export interface PlannerOutput {
  thought: string;
  confidence: number;
  expected_outcome: string;
  action: string;
  params: Record<string, unknown>;
  is_complete: boolean;
}
