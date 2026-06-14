export interface OCROptions {
    languages?: string[];
    confidenceThreshold?: number;
    regions?: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
}
export interface OCRResult {
    text: string;
    confidence: number;
    bbox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export interface OCRVerificationResult {
    similarity: number;
    passed: boolean;
    threshold: number;
    matchedText: Array<{
        expected: string;
        actual: string;
        similarity: number;
    }>;
    missingText: string[];
    extraText: string[];
    details: {
        expectedText: string;
        actualText: string;
        confidence: number;
    };
}
/**
 * OCR Verifier - Step 5 of the visual verification pipeline
 * Extracts and compares text from screenshots
 * Useful for forms, invoices, tables, and documents
 */
export declare class OCRVerifier {
    private options;
    constructor(options?: OCROptions);
    /**
     * Extract text from a screenshot using basic OCR
     * Note: In production, this would use Tesseract.js or a cloud OCR service
     */
    extractText(screenshot: Buffer): Promise<OCRResult[]>;
    /**
     * Compare expected text with actual text extracted from screenshot
     */
    verifyText(screenshot: Buffer, expectedText: string, threshold?: number): Promise<OCRVerificationResult>;
    private detectTextRegions;
    private isTextPixel;
    private floodFillRegion;
    private extractTextFromRegion;
    private calculateTextSimilarity;
    private levenshteinDistance;
    private findTextDifferences;
}
export default OCRVerifier;
//# sourceMappingURL=ocr-verifier.d.ts.map