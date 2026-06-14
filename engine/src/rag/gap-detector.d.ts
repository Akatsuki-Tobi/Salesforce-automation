import type { WorldModel, PlannerOutput, KnowledgeGap } from "../types/agent.js";
export interface GapDetectionResult {
    gap: KnowledgeGap | null;
    reason: string;
}
export declare class GapDetector {
    detect(worldModel: WorldModel, plan: PlannerOutput, verificationSuccess: boolean): GapDetectionResult;
    private buildQuery;
    private buildQueryFromFailure;
}
//# sourceMappingURL=gap-detector.d.ts.map