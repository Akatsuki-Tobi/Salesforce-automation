"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillMatching = void 0;
const skill_1 = require("./skill");
const skillManager_1 = require("./skillManager");
class SkillMatching {
    skillManager;
    constructor() {
        this.skillManager = new skillManager_1.SkillManager();
    }
    findBestMatch(goal) {
        const skills = this.skillManager.loadSkills();
        for (const skill of skills) {
            if (skill.metadata.name === goal) {
                return skill;
            }
        }
        return null;
    }
}
exports.SkillMatching = SkillMatching;
//# sourceMappingURL=skillMatching.js.map