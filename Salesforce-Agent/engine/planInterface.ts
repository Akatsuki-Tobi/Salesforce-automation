export interface Plan {
  thought: string;
  confidence: number;
  expectedOutcome: string;
  action: string;
  params: Record<string, unknown>;
  isComplete: boolean;
}