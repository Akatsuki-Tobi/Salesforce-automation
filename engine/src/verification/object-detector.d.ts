export interface DetectedObject {
    type: string;
    bbox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    confidence: number;
    attributes: Record<string, unknown>;
}
export interface ObjectDetectionResult {
    objects: DetectedObject[];
    counts: Record<string, number>;
    hierarchy: Array<{
        parent: string;
        children: string[];
    }>;
}
export interface ObjectVerificationResult {
    similarity: number;
    passed: boolean;
    threshold: number;
    matchedObjects: Array<{
        expected: DetectedObject;
        actual: DetectedObject;
        similarity: number;
    }>;
    missingObjects: DetectedObject[];
    extraObjects: DetectedObject[];
    positionChanges: Array<{
        object: string;
        expectedPos: {
            x: number;
            y: number;
        };
        actualPos: {
            x: number;
            y: number;
        };
        distance: number;
    }>;
    details: {
        expectedCount: number;
        actualCount: number;
        type: string;
    };
}
/**
 * Object Detector - Step 6 of the visual verification pipeline
 * Detects UI elements like buttons, textboxes, dropdowns, images, icons, checkboxes, modals
 * Verifies position, count, hierarchy, and visibility
 */
export declare class ObjectDetector {
    private objectTypes;
    /**
     * Detect objects in a screenshot
     * Note: In production, this would use a trained ML model like YOLO or DETR
     */
    detectObjects(screenshot: Buffer): Promise<ObjectDetectionResult>;
    /**
     * Compare expected objects with actual detected objects
     */
    verifyObjects(screenshot: Buffer, expectedObjects: DetectedObject[], threshold?: number): Promise<ObjectVerificationResult>;
    private detectObjectsHeuristic;
    private detectRectangularRegions;
    private findRectangularRegion;
    MEA: any;
    private isRegionStart;
    private isEdge;
    private detectImageRegions;
    private calculateColorVariation;
    private buildHierarchy;
    private isContained;
    private calculateObjectSimilarity;
    private calculateDistance;
}
export default ObjectDetector;
//# sourceMappingURL=object-detector.d.ts.map