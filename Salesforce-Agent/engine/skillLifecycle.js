"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillLifecycle = void 0;
const skill_1 = require("./skill");
const skillManager_1 = require("./skillManager");
class SkillLifecycle {
    skillManager;
    constructor() {
        this.skillManager = new skillManager_1.SkillManager();
    }
    manageSkillLifecycle(skill) {
        // Manage the skill lifecycle
    }
}
exports.SkillLifecycle = SkillLifecycle;
//# sourceMappingURL=skillLifecycle.js.map