export interface NormalizationOptions {
    targetWidth?: number;
    targetHeight?: number;
    theme?: "light" | "dark" | "auto";
    fontFamily?: string;
    removeAnimations?: boolean;
    normalizeTimezone?: boolean;
    removeRandomIds?: boolean;
    outputFormat?: "png" | "jpeg";
    quality?: number;
}
export interface NormalizedScreenshot {
    buffer: Buffer;
    metadata: {
        originalWidth: number;
        originalHeight: number;
        normalizedWidth: number;
        normalizedHeight: number;
        theme: string;
        processingSteps: string[];
    };
}
/**
 * Screenshot Normalizer - Step 1 of the visual verification pipeline
 * Normalizes screenshots to reduce false positives from environmental differences
 */
export declare class ScreenshotNormalizer {
    private options;
    constructor(options?: NormalizationOptions);
    /**
     * Normalize a screenshot buffer
     */
    normalize(screenshotBuffer: Buffer): Promise<NormalizedScreenshot>;
    /**
     * Normalize theme by adjusting brightness/contrast to standard levels
     */
    private normalizeTheme;
    /**
     * Remove animation artifacts by applying slight blur to reduce flicker
     */
    private removeAnimationArtifacts;
    /**
     * Normalize fonts by ensuring consistent rendering
     */
    private normalizeFonts;
    /**
     * Remove random ID artifacts by detecting and smoothing high-frequency noise
     */
    private removeRandomIdArtifacts;
    private median;
    /**
     * Normalize two screenshots for comparison
     */
    normalizePair(screenshotA: Buffer, screenshotB: Buffer): Promise<{
        normalizedA: NormalizedScreenshot;
        normalizedB: NormalizedScreenshot;
    }>;
    /**
     * Save normalized screenshot to file
     */
    saveToFile(normalizedScreenshot: NormalizedScreenshot, filePath: string): Promise<void>;
}
export default ScreenshotNormalizer;
//# sourceMappingURL=screenshot-normalizer.d.ts.map