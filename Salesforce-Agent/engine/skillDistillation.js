"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillDistillation = void 0;
const skill_1 = require("./skill");
const skillManager_1 = require("./skillManager");
class SkillDistillation {
    skillManager;
    constructor() {
        this.skillManager = new skillManager_1.SkillManager();
    }
    distillSkill(skill) {
        // Distill the skill
    }
}
exports.SkillDistillation = SkillDistillation;
//# sourceMappingURL=skillDistillation.js.map