import type { WorldModel, PlannerOutput } from "../types/agent.js";
export declare class Planner {
    private readonly client;
    constructor();
    planNextStep(worldModel: WorldModel): Promise<PlannerOutput>;
}
//# sourceMappingURL=planner.d.ts.map