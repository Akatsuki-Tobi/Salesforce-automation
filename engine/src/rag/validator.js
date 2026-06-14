import { KnowledgeScore, KnowledgeType } from "../types/agent.js";
export const CONFIDENCE_THRESHOLD = 0.70;
export class KnowledgeValidator {
    validate(content, source, url) {
        const score = this.computeScore(content, source, url);
        const knowledgeType = this.classifyKnowledgeType(content, source);
        const approved = score.confidence >= CONFIDENCE_THRESHOLD;
        return {
            approved,
            score,
            knowledgeType,
            reason: approved ? undefined : `Confidence ${score.confidence} below threshold ${CONFIDENCE_THRESHOLD}`,
        };
    }
    computeScore(content, source, url) {
        const domainWeights = (typeof DOMAIN_WEIGHTS !== "undefined" ? DOMAIN_WEIGHTS : {});
        // Source authority based on domain
        let sourceAuthority = 1;
        if (url) {
            try {
                const hostname = new URL(url).hostname.replace(/^www\./, "");
                sourceAuthority = domainWeights[hostname] ?? 1;
            }
            catch {
                // ignore
            }
        }
        // Relevance: content length and structure
        const hasInstructions = /step|instruction|how to|guide|tutorial/i.test(content);
        const hasCode = /```|\bfunction\b|\bclass\b|\bimport\b|\bexport\b/i.test(content);
        const relevance = content.length > 200 ? (hasInstructions ? 2 : hasCode ? 1.5 : 1) : 0.5;
        // Freshness: could check publication date if available; default to 1
        const freshness = 1;
        // Overall confidence (simple weighted sum, normalized)
        const confidence = Math.min(1, (sourceAuthority + relevance + freshness) / 12);
        return { sourceAuthority, relevance, freshness, confidence };
    }
    classifyKnowledgeType(content, source) {
        const lower = content.toLowerCase();
        if (/error|exception|stack trace|debug|fix|resolve|troubleshoot/i.test(lower)) {
            return KnowledgeType.ERROR_FIX;
        }
        if (/configuration|settings|preferences|setup|install|deploy/i.test(lower)) {
            return KnowledgeType.CONFIGURATION;
        }
        if (/workflow|process|procedure|step-by-step|guide/i.test(lower)) {
            return KnowledgeType.WORKFLOW;
        }
        if (/ui|interface|button|click|field|label|screen/i.test(lower)) {
            return KnowledgeType.UI_PATTERN;
        }
        if (/api|reference|documentation|spec|parameter|return/i.test(lower)) {
            return KnowledgeType.REFERENCE;
        }
        return KnowledgeType.DOCUMENTATION;
    }
}
//# sourceMappingURL=validator.js.map