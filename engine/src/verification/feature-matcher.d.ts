export interface FeatureMatchOptions {
    algorithm?: "orb" | "sift" | "akaze";
    maxFeatures?: number;
    matchThreshold?: number;
    ratioThreshold?: number;
}
export interface FeatureMatchResult {
    similarity: number;
    matchedFeatures: number;
    totalFeaturesA: number;
    totalFeaturesB: number;
    passed: boolean;
    threshold: number;
    details: {
        algorithm: string;
        keypointsA: number;
        keypointsB: number;
        goodMatches: number;
        homographyInliers?: number;
    };
}
/**
 * Feature Matcher - Step 4 of the visual verification pipeline
 * Uses ORB, SIFT, and AKAZE algorithms to compare keypoints, corners, logos, icons, and buttons
 * Useful after responsive layout changes
 */
export declare class FeatureMatcher {
    private options;
    constructor(options?: FeatureMatchOptions);
    /**
     * Compare two screenshots using feature matching
     */
    compare(screenshotA: Buffer, screenshotB: Buffer, threshold?: number): Promise<FeatureMatchResult>;
    private extractKeypoints;
    private computeDescriptor;
    private matchKeypoints;
    private calculateDistance;
}
export default FeatureMatcher;
//# sourceMappingURL=feature-matcher.d.ts.map