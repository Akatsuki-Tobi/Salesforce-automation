import type { PlannerOutput } from "../types/agent.js";
import type { Page } from "playwright";
export interface ValidationResult {
    approved: boolean;
    reason?: string;
}
export declare function validatePlannedAction(plan: PlannerOutput, page: Page | null): Promise<ValidationResult>;
//# sourceMappingURL=action-validator.d.ts.map