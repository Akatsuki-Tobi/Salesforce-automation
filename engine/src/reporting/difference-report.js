import { Difference } from './types';
import { PixelComparisonResult } from './pixel-comparator';
import { SSIMResult } from './ssim-comparator';
import { FeatureMatchResult } from './feature-matcher';
import { OCRVerificationResult } from './ocr-verifier';
import { ObjectDetectionResult } from './object-detector';
import { SemanticVisionResult } from './semantic-vision';
import { DOMVisionFusionResult } from './dom-vision-fusion';
class ExplainableDifferenceReport {
    pixelComparison;
    ssim;
    featureMatches;
    ocr;
    objectDetection;
    semanticVision;
    domVision;
    constructor(pixelComparison, ssim, featureMatches, ocr, objectDetection, semanticVision, domVision) {
        this.pixelComparison = pixelComparison;
        this.ssim = ssim;
        this.featureMatches = featureMatches;
        this.ocr = ocr;
        this.objectDetection = objectDetection;
        this.semanticVision = semanticVision;
        this.domVision = domVision;
    }
    generateReport() {
        let report = "";
        // End of file
        report += `\n[Pixel Comparison] Threshold: ${this.pixelComparison.threshold},
Match: ${this.pixelComparison.match ? '✅' : '❌'}\n`;
        report += `\n[SSIM] Similarity Index: ${this.ssim.index}\n`;
        report += `\n[Feature Matching] Keypoints: ${this.featureMatches.keypoints} matches\n`;
        report += `\n[OCR Verification] Text Match: ${this.ocr.match ? '✅' : '❌'}\n`;
        report += `\n[Object Detection] Elements Detected: ${this.objectDetection.elements.length}\n`;
        report += `\n[Semantic Vision] Labels: ${this.semanticVision.labels.join(', ')}\n`;
        report += `\n[DOM-Vision Fusion] Mapped Elements: ${this.domVision.mappedElements.length}\n`;
        return report;
    }
}
//# sourceMappingURL=difference-report.js.map