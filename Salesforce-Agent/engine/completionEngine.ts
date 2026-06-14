export class CompletionEngine {
  private completionLogic: CompletionLogic;

  constructor(completionLogic: CompletionLogic) {
    this.completionLogic = completionLogic;
  }

  public isComplete(): boolean {
    return this.completionLogic.isComplete();
  }
}