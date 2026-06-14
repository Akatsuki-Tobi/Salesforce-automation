export interface PixelComparisonOptions {
    threshold?: number;
    ignoreRegions?: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
    generateDiffImage?: boolean;
}
export interface PixelComparisonResult {
    similarity: number;
    diffPercentage: number;
    boundingBoxes: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
    diffImage?: Buffer;
    passed: boolean;
    details: {
        totalPixels: number;
        differentPixels: number;
        maxChannelDiff: number;
    };
}
/**
 * Pixel Comparison - Step 2 of the visual verification pipeline
 * Fast pixel-level comparison for detecting UI regressions, missing elements, and broken layouts
 */
export declare class PixelComparator {
    private options;
    constructor(options?: PixelComparisonOptions);
    /**
     * Compare two screenshot buffers pixel by pixel
     */
    compare(screenshotA: Buffer, screenshotB: Buffer): Promise<PixelComparisonResult>;
    private isIgnoredRegion;
    private findBoundingBoxes;
    private floodFill;
    private generateDiffImage;
}
export default PixelComparator;
//# sourceMappingURL=pixel-comparator.d.ts.map