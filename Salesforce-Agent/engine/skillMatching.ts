import { Skill } from './skill';
import { SkillManager } from './skillManager';

export class SkillMatching {
  private skillManager: SkillManager;

  constructor() {
    this.skillManager = new SkillManager();
  }

  public findBestMatch(goal: string): Skill | null {
    const skills = this.skillManager.loadSkills();
    for (const skill of skills) {
      if (skill.metadata.name === goal) {
        return skill;
      }
    }
    return null;
  }
}