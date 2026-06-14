import { ExecutionPipeline } from "./executionPipeline";

export class AgentRuntime {
    private executionPipeline: ExecutionPipeline;

    constructor(executionPipeline: ExecutionPipeline) {
        this.executionPipeline = executionPipeline;
    }

    public run(): void {
        // Implement agent runtime logic here
    }
}