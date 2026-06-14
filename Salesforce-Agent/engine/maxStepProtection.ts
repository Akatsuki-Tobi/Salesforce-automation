export class MaxStepProtection {
  private maxSteps: number;

  constructor(maxSteps: number) {
    this.maxSteps = maxSteps;
  }

  public isMaxStepsReached(): boolean {
    return this.maxSteps <= 0;
  }
}