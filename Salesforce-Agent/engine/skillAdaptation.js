"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAdaptation = void 0;
const skill_1 = require("./skill");
const skillManager_1 = require("./skillManager");
class SkillAdaptation {
    skillManager;
    constructor() {
        this.skillManager = new skillManager_1.SkillManager();
    }
    adaptSkill(skill) {
        // Adapt the skill
    }
}
exports.SkillAdaptation = SkillAdaptation;
//# sourceMappingURL=skillAdaptation.js.map