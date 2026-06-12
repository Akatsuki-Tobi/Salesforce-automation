"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillVersioning = void 0;
const skill_1 = require("./skill");
const skillManager_1 = require("./skillManager");
class SkillVersioning {
    skillManager;
    constructor() {
        this.skillManager = new skillManager_1.SkillManager();
    }
    versionSkill(skill) {
        // Version the skill
    }
}
exports.SkillVersioning = SkillVersioning;
//# sourceMappingURL=skillVersioning.js.map