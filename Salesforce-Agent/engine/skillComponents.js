"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillComponents = void 0;
class SkillComponents {
    metadata;
    preconditions;
    variables;
    steps;
    verification;
    fallback;
    constructor(skill) {
        this.metadata = skill.metadata;
        this.preconditions = skill.preconditions;
        this.variables = skill.variables;
        this.steps = skill.steps;
        this.verification = skill.verification;
        this.fallback = skill.fallback;
    }
}
exports.SkillComponents = SkillComponents;
//# sourceMappingURL=skillComponents.js.map