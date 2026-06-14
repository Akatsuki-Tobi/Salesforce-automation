import { verificationLog } from "../utils/logger.js";
import { ExplainableDifferenceReport } from "./difference-report";
import { PixelComparisonResult } from "./pixel-comparator";
import { SSIMResult } from "./ssim-comparator";
import { FeatureMatchResult } from "./feature-matcher";
import { OCRVerificationResult } from "./ocr-verifier";
import { ObjectDetectionResult } from "./object-detector";
import { SemanticVisionResult } from "./semantic-vision";
import { DOMVisionFusionResult } from "./dom-vision-fusion";
class VerificationEngine {
    async runVerification(pixelComparison, ssim, featureMatches, ocr, objectDetection, semanticVision, domVision) {
        const report = new ExplainableDifferenceReport(pixelComparison, ssim, featureMatches, ocr, objectDetection, semanticVision, domVision);
        return report.generateReport();
    }
}
export async function verifyActionOutcome(expectedOutcome, page) {
    if (!page) {
        verificationLog({ expectedOutcome, success: false, reason: "No browser page available" });
        return false;
    }
    const location = page.url();
    const title = await page.title();
    const visibleText = await page.textContent("body");
    const success = typeof visibleText === "string" && visibleText.toLowerCase().includes(expectedOutcome.toLowerCase());
    verificationLog({ expectedOutcome, success, currentUrl: location, title, snippet: visibleText?.slice(0, 200) });
    return success;
}
//# sourceMappingURL=verification-engine.js.map