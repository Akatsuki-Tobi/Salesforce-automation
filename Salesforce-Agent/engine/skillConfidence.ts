import { Skill } from './skill';
import { SkillManager } from './skillManager';

export class SkillConfidence {
  private skillManager: SkillManager;

  constructor() {
    this.skillManager = new SkillManager();
  }

  public calculateConfidence(skill: Skill): number {
    // Calculate the confidence
  }
}