"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryPolicy = void 0;
class RetryPolicy {
    maxRetries;
    retryDelay;
    constructor(maxRetries, retryDelay) {
        this.maxRetries = maxRetries;
        this.retryDelay = retryDelay;
    }
    retry(action) {
        // Implement retry logic
    }
}
exports.RetryPolicy = RetryPolicy;
//# sourceMappingURL=retryPolicy.js.map