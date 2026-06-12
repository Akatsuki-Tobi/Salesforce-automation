"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillStorage = void 0;
const skill_1 = require("./skill");
class SkillStorage {
    skills;
    constructor() {
        this.skills = [];
    }
    addSkill(skill) {
        this.skills.push(skill);
    }
    getSkills() {
        return this.skills;
    }
}
exports.SkillStorage = SkillStorage;
//# sourceMappingURL=skillStorage.js.map