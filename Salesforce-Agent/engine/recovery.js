"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recovery = void 0;
class Recovery {
    observation;
    retryPolicy;
    constructor(observation, retryPolicy) {
        this.observation = observation;
        this.retryPolicy = retryPolicy;
    }
    recover() {
        // Implement recovery logic
    }
}
exports.Recovery = Recovery;
//# sourceMappingURL=recovery.js.map