"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const screenshotComparator_1 = require("./screenshotComparator");
const securityAnalyzer_1 = require("./securityAnalyzer");
class VerificationSystem {
    screenshotComparator;
    securityAnalyzer;
    constructor(screenshotComparator, securityAnalyzer) {
        this.screenshotComparator = screenshotComparator;
        this.securityAnalyzer = securityAnalyzer;
    }
    async verifyAction(action, expectedOutcome) {
        try {
            // 1. Visual Verification
            const currentScreenshot = await this.executionLayer.takeScreenshot();
            const visualDiff = await this.screenshotComparator.compare(expectedOutcome.screenshot, currentScreenshot);
            if (visualDiff > 0.2) {
                throw new Error('Visual mismatch exceeds threshold');
            }
            // 2. Security Verification
            const securityIssues = await this.securityAnalyzer.scanCurrentPage();
            if (securityIssues.length > 0) {
                console.warn('Security issues detected:', securityIssues);
                // Optionally throw if critical issues found
            }
            // 3. State Verification
            const currentState = await this.executionLayer.observe();
            const stateMatch = this.compareState(currentState, expectedOutcome.state);
            if (!stateMatch) {
                throw new Error('State mismatch');
            }
            return true;
        }
        catch (error) {
            console.error('Verification failed:', error);
            return false;
        }
    }
}
exports.default = VerificationSystem;
//# sourceMappingURL=verificationSystem.js.map