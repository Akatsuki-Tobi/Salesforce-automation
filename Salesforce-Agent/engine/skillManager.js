"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillManager = void 0;
const skill_1 = require("./skill");
const skillStorage_1 = require("./skillStorage");
class SkillManager {
    skillStorage;
    constructor() {
        this.skillStorage = new skillStorage_1.SkillStorage();
    }
    loadSkills() {
        return this.skillStorage.getSkills();
    }
    saveSkill(skill) {
        this.skillStorage.addSkill(skill);
    }
}
exports.SkillManager = SkillManager;
//# sourceMappingURL=skillManager.js.map