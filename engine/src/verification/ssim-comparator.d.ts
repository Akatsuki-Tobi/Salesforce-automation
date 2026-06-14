export interface SSIMOptions {
    windowSize?: number;
    k1?: number;
    k2?: number;
    bitDepth?: number;
}
export interface SSIMResult {
    ssimIndex: number;
    similarity: number;
    passed: boolean;
    threshold: number;
    details: {
        luminance: number;
        contrast: number;
        structure: number;
        meanX: number;
        meanY: number;
        varianceX: number;
        varianceY: number;
        covariance: number;
    };
}
/**
 * SSIM (Structural Similarity Index) - Step 3 of the visual verification pipeline
 * Compares structure, contrast, and brightness rather than raw pixels
 * Removes many false positives from pixel-perfect comparison
 */
export declare class SSIMComparator {
    private options;
    constructor(options?: SSIMOptions);
    /**
     * Compare two screenshots using SSIM
     */
    compare(screenshotA: Buffer, screenshotB: Buffer, threshold?: number): Promise<SSIMResult>;
    private toGrayscale;
    private calculateSSIM;
}
export default SSIMComparator;
//# sourceMappingURL=ssim-comparator.d.ts.map