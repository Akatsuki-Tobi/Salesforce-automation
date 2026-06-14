import type { WorldModel, Observation, ActionRecord, RetrievedContext, KnowledgeGap } from "../types/agent.js";
export declare function getWorldModel(): WorldModel;
export declare function updateGoal(goal: string): void;
export declare function updateBrowserState(browser: Partial<WorldModel["browser"]>): void;
export declare function addObservation(observation: Observation): void;
export declare function addCompletedAction(action: ActionRecord): void;
export declare function addFailedAction(action: ActionRecord): void;
export declare function addDiscoveredFact(fact: string): void;
export declare function updateEnvironment(environment: Partial<WorldModel["environment"]>): void;
export declare function updateStatus(status: Partial<WorldModel["status"]>): void;
export declare function setWorldModel(state: WorldModel): void;
export declare function setKnowledgeContext(chunks: RetrievedContext[]): void;
export declare function addKnowledgeGap(gap: KnowledgeGap): void;
export declare function resolveKnowledgeGap(query: string): void;
export declare function recordSearchedQuery(query: string): void;
export declare function consumeRagBudget(amount: number): void;
export declare function resetRagBudget(): void;
//# sourceMappingURL=state-manager.d.ts.map