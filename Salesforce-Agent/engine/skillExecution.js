"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillExecution = void 0;
const skill_1 = require("./skill");
const skillManager_1 = require("./skillManager");
class SkillExecution {
    skillManager;
    constructor() {
        this.skillManager = new skillManager_1.SkillManager();
    }
    executeSkill(skill) {
        // Execute the skill
    }
}
exports.SkillExecution = SkillExecution;
//# sourceMappingURL=skillExecution.js.map