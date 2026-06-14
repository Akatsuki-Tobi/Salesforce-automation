import { Skill } from './skill';
import { SkillManager } from './skillManager';

export class SkillExecution {
  private skillManager: SkillManager;

  constructor() {
    this.skillManager = new SkillManager();
  }

  public executeSkill(skill: Skill): void {
    // Execute the skill
  }
}