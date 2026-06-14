import { Skill } from './skill';
import { SkillStorage } from './skillStorage';

export class SkillManager {
  private skillStorage: SkillStorage;

  constructor() {
    this.skillStorage = new SkillStorage();
  }

  public loadSkills(): Skill[] {
    return this.skillStorage.getSkills();
  }

  public saveSkill(skill: Skill): void {
    this.skillStorage.addSkill(skill);
  }
}