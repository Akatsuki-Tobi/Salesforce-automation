import { KnowledgeScore, KnowledgeType } from "../types/agent.js";
export declare const CONFIDENCE_THRESHOLD = 0.7;
export interface ValidationResult {
    approved: boolean;
    score: KnowledgeScore;
    knowledgeType: KnowledgeType;
    reason?: string;
}
export declare class KnowledgeValidator {
    validate(content: string, source: string, url?: string): ValidationResult;
    private computeScore;
    private classifyKnowledgeType;
}
//# sourceMappingURL=validator.d.ts.map