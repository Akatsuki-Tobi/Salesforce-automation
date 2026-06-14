import { ScreenshotComparator } from './screenshotComparator';
import { SecurityAnalyzer } from './securityAnalyzer';
declare class VerificationSystem {
    private screenshotComparator;
    private securityAnalyzer;
    constructor(screenshotComparator: ScreenshotComparator, securityAnalyzer: SecurityAnalyzer);
    verifyAction(action: string, expectedOutcome: any): Promise<boolean>;
}
export default VerificationSystem;
//# sourceMappingURL=verificationSystem.d.ts.map