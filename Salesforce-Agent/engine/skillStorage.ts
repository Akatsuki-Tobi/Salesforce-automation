import { Skill } from './skill';

export class SkillStorage {
  private skills: Skill[];

  constructor() {
    this.skills = [];
  }

  public addSkill(skill: Skill): void {
    this.skills.push(skill);
  }

  public getSkills(): Skill[] {
    return this.skills;
  }
}