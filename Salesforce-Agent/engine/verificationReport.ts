export interface VerificationReport {
  success: boolean;
  expectedOutcome: string;
  actualOutcome: string;
  evidence: string[];
}