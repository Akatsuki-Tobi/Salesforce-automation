"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Planner = void 0;
class Planner {
    observation;
    retryPolicy;
    constructor(observation, retryPolicy) {
        this.observation = observation;
        this.retryPolicy = retryPolicy;
    }
    plan() {
        // Implement planning logic
    }
}
exports.Planner = Planner;
//# sourceMappingURL=planner.js.map