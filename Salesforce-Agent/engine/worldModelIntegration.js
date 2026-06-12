"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldModelIntegration = void 0;
const skill_1 = require("./skill");
const skillManager_1 = require("./skillManager");
const worldModel_1 = require("./worldModel");
class WorldModelIntegration {
    skillManager;
    worldModel;
    constructor() {
        this.skillManager = new skillManager_1.SkillManager();
        this.worldModel = new worldModel_1.WorldModel();
    }
    integrateSkill(skill) {
        // Integrate the skill with the world model
    }
}
exports.WorldModelIntegration = WorldModelIntegration;
//# sourceMappingURL=worldModelIntegration.js.map