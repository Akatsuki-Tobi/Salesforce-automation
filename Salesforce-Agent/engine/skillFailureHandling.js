"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillFailureHandling = void 0;
const skill_1 = require("./skill");
const skillManager_1 = require("./skillManager");
class SkillFailureHandling {
    skillManager;
    constructor() {
        this.skillManager = new skillManager_1.SkillManager();
    }
    handleFailure(skill) {
        // Handle the failure
    }
}
exports.SkillFailureHandling = SkillFailureHandling;
//# sourceMappingURL=skillFailureHandling.js.map