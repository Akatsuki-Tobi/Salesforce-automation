"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logging = void 0;
const skill_1 = require("./skill");
const skillManager_1 = require("./skillManager");
class Logging {
    skillManager;
    constructor() {
        this.skillManager = new skillManager_1.SkillManager();
    }
    logSkill(skill) {
        // Log the skill
    }
}
exports.Logging = Logging;
//# sourceMappingURL=logging.js.map