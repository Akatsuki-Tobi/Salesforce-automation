export interface Skill {
  id: string;
  name: string;
  description: string;
  version: number;
  preconditions: {
    urlContains: string;
    requiredElements: string[];
  };
  variables: string[];
  steps: {
    action: string;
    selector: string;
  }[];
  verification: {
    type: string;
    value: string;
  };
  fallback: string;
}