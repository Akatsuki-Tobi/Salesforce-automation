"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backoffStrategy_1 = require("./backoffStrategy");
class RecoverySystem {
    retryCount = 0;
    maxRetries = 5;
    backoff = new ExponentialBackoff();
    async handleActionFailure(error) {
        if (this.retryCount >= this.maxRetries) {
            throw new Error('Max retries exceeded');
        }
        const delay = this.backoff.calculateDelay(this.retryCount);
        console.log(`Retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        this.retryCount++;
    }
    async handleObservationFailure(error) {
        // Implement specific recovery for observation failures
        if (error.message.includes('timeout')) {
            await this.adjustObservationStrategy();
        }
    }
    async adjustObservationStrategy() {
        // Switch to more robust observation method
        this.executionLayer.setObservationStrategy('fallback');
    }
}
exports.default = RecoverySystem;
//# sourceMappingURL=recoverySystem.js.map