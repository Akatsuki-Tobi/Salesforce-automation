"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxStepProtection = void 0;
class MaxStepProtection {
    maxSteps;
    constructor(maxSteps) {
        this.maxSteps = maxSteps;
    }
    isMaxStepsReached() {
        return this.maxSteps <= 0;
    }
}
exports.MaxStepProtection = MaxStepProtection;
//# sourceMappingURL=maxStepProtection.js.map