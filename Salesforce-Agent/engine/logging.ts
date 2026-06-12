import { Skill } from './skill';
import { SkillManager } from './skillManager';

export class Logging {
  private skillManager: SkillManager;

  constructor() {
    this.skillManager = new SkillManager();
  }

  public logSkill(skill: Skill): void {
    // Log the skill
  }
}