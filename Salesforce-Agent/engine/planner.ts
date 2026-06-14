export class Planner {
  private observation: Observation;
  private retryPolicy: RetryPolicy;

  constructor(observation: Observation, retryPolicy: RetryPolicy) {
    this.observation = observation;
    this.retryPolicy = retryPolicy;
  }

  public plan(): Promise<string> {
    // Implement planning logic
  }
}