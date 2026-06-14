"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyActionOutcome = verifyActionOutcome;
const logger_js_1 = require("../utils/logger.js");
const difference_report_1 = require("./difference-report");
class VerificationEngine {
    async runVerification(pixelComparison, ssim, featureMatches, ocr, objectDetection, semanticVision, domVision) {
        const report = new difference_report_1.ExplainableDifferenceReport(pixelComparison, ssim, featureMatches, ocr, objectDetection, semanticVision, domVision);
        return report.generateReport();
    }
}
async function verifyActionOutcome(expectedOutcome, page) {
    if (!page) {
        (0, logger_js_1.verificationLog)({ expectedOutcome, success: false, reason: "No browser page available" });
        return false;
    }
    const location = page.url();
    const title = await page.title();
    const visibleText = await page.textContent("body");
    const success = typeof visibleText === "string" && visibleText.toLowerCase().includes(expectedOutcome.toLowerCase());
    (0, logger_js_1.verificationLog)({ expectedOutcome, success, currentUrl: location, title, snippet: visibleText?.slice(0, 200) });
    return success;
}
