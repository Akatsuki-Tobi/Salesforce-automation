export class GoalManager {
  private goal: string;

  constructor(goal: string) {
    this.goal = goal;
  }

  public getGoal(): string {
    return this.goal;
  }
}