export class TaskQueue {
  private tasks: string[];

  constructor() {
    this.tasks = [];
  }

  public addTask(task: string): void {
    this.tasks.push(task);
  }

  public getTasks(): string[] {
    return this.tasks;
  }
}