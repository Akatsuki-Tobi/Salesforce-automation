import { Skill } from './skill';
import { SkillManager } from './skillManager';

export class SkillVersioning {
  private skillManager: SkillManager;

  constructor() {
    this.skillManager = new SkillManager();
  }

  public versionSkill(skill: Skill): void {
    // Version the skill
  }
}