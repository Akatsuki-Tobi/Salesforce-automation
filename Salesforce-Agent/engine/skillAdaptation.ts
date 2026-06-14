import { Skill } from './skill';
import { SkillManager } from './skillManager';

export class SkillAdaptation {
  private skillManager: SkillManager;

  constructor() {
    this.skillManager = new SkillManager();
  }

  public adaptSkill(skill: Skill): void {
    // Adapt the skill
  }
}