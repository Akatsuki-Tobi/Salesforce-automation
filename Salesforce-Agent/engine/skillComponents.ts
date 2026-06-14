export class SkillComponents {
  private metadata: {
    id: string;
    name: string;
    description: string;
    version: number;
  };
  private preconditions: {
    urlContains: string;
    requiredElements: string[];
  };
  private variables: string[];
  private steps: {
    action: string;
    selector: string;
  }[];
  private verification: {
    type: string;
    value: string;
  };
  private fallback: string;

  constructor(skill: Skill) {
    this.metadata = skill.metadata;
    this.preconditions = skill.preconditions;
    this.variables = skill.variables;
    this.steps = skill.steps;
    this.verification = skill.verification;
    this.fallback = skill.fallback;
  }
}