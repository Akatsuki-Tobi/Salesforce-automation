"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletionEngine = void 0;
class CompletionEngine {
    completionLogic;
    constructor(completionLogic) {
        this.completionLogic = completionLogic;
    }
    isComplete() {
        return this.completionLogic.isComplete();
    }
}
exports.CompletionEngine = CompletionEngine;
//# sourceMappingURL=completionEngine.js.map