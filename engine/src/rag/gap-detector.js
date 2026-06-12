export class GapDetector {
    detect(worldModel, plan, verificationSuccess) {
        const step = worldModel.status.stepCount;
        const searchedQueries = new Set(worldModel.searchedQueries ?? []);
        // Already have a gap recorded and not resolved? Continue with that.
        const existingGap = worldModel.knowledgeGaps?.find((g) => !g.resolved);
        if (existingGap) {
            return { gap: existingGap, reason: "existing unresolved gap" };
        }
        // High confidence and verification succeeded => no gap
        if (plan.confidence >= 0.7 && verificationSuccess) {
            return { gap: null, reason: "high confidence and verification success" };
        }
        // Low confidence indicates uncertainty
        if (plan.confidence < 0.6) {
            const query = this.buildQuery(plan, worldModel);
            if (query && !searchedQueries.has(query)) {
                return {
                    gap: {
                        description: `Low planner confidence (${plan.confidence})`,
                        query,
                        detectedAtStep: step,
                        resolved: false,
                    },
                    reason: "low confidence",
                };
            }
        }
        // Verification failure suggests missing knowledge
        if (!verificationSuccess) {
            const query = this.buildQueryFromFailure(plan, worldModel);
            if (query && !searchedQueries.has(query)) {
                return {
                    gap: {
                        description: `Verification failed: expected "${plan.expected_outcome}" not found`,
                        query,
                        detectedAtStep: step,
                        resolved: false,
                    },
                    reason: "verification failure",
                };
            }
        }
        // Unknown action (not in allow-list) could indicate missing workflow knowledge
        // This would be caught by schema validation earlier, but we can also check
        // if the action is not in the known executor actions
        // For MVP, we rely on confidence and verification
        return { gap: null, reason: "no gap detected" };
    }
    buildQuery(plan, worldModel) {
        const goal = worldModel.goal;
        const action = plan.action;
        const thought = plan.thought;
        // Construct a concise search query
        if (plan.knowledgeQuery) {
            return plan.knowledgeQuery;
        }
        if (thought && thought.length > 10) {
            return `${goal} ${action} ${thought.slice(0, 100)}`;
        }
        return `${goal} ${action}`;
    }
    buildQueryFromFailure(plan, worldModel) {
        const goal = worldModel.goal;
        const action = plan.action;
        const expected = plan.expected_outcome;
        // Focus on why the expected outcome didn't appear
        return `${goal} ${action} why didn't I see "${expected}"`;
    }
}
//# sourceMappingURL=gap-detector.js.map