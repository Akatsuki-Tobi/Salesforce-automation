"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillConfidence = void 0;
const skill_1 = require("./skill");
const skillManager_1 = require("./skillManager");
class SkillConfidence {
    skillManager;
    constructor() {
        this.skillManager = new skillManager_1.SkillManager();
    }
    calculateConfidence(skill) {
        // Calculate the confidence
    }
}
exports.SkillConfidence = SkillConfidence;
//# sourceMappingURL=skillConfidence.js.map