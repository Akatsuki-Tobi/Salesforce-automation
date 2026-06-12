export class Verification {
  private observation: Observation;
  private verificationReport: VerificationReport;

  constructor(observation: Observation, verificationReport: VerificationReport) {
    this.observation = observation;
    this.verificationReport = verificationReport;
  }

  public verify(): Promise<boolean> {
    // Implement verification logic
  }
}