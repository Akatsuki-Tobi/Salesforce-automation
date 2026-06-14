export interface SemanticVisionOptions {
    model?: string;
    apiKey?: string;
    endpoint?: string;
}
export interface SemanticDescription {
    elements: Array<{
        type: string;
        description: string;
        position: {
            x: number;
            y: number;
        };
        confidence: number;
    }>;
    layout: string;
    colorScheme: string;
    overallDescription: string;
}
export interface SemanticComparisonResult {
    similarity: number;
    passed: boolean;
    threshold: number;
    semanticMatch: number;
    intentMatch: number;
    elementMatches: Array<{
        expected: string;
        actual: string;
        similarity: number;
    }>;
    details: {
        expectedDescription: string;
        actualDescription: string;
        confidence: number;
    };
}
/**
 * Semantic Vision - Step 7 of the visual verification pipeline
 * Uses Vision Language Models to describe UI and compare intent
 * Example: "Blue login button" vs "Blue sign-in button" = Pass
 */
export declare class SemanticVision {
    private options;
    constructor(options?: SemanticVisionOptions);
    /**
     * Describe a screenshot using semantic vision
     * Note: In production, this would call a VLM API (OpenAI, Anthropic, etc.)
     */
    describeScreenshot(screenshot: Buffer): Promise<SemanticDescription>;
    /**
     * Compare two screenshots semantically
     */
    compareSemantic(screenshotA: Buffer, screenshotB: Buffer, expectedIntent: string, threshold?: number): Promise<SemanticComparisonResult>;
    private detectSemanticElements;
    private analyzeLayout;
    private analyzeColorScheme;
    private calculateSemanticSimilarity;
    private calculateIntentMatch;
    private compareElements;
    private findButtonRegions;
    private isButtonRegion;
    private findInputRegions;
    private isInputRegion;
    private findImageRegions;
    private isImageRegion;
    private detectHeader;
    private detectSidebar;
    private detectFooter;
}
export default SemanticVision;
//# sourceMappingURL=semantic-vision.d.ts.map