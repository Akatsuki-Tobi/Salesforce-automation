export declare class Planner {
    private observation;
    private retryPolicy;
    constructor(observation: Observation, retryPolicy: RetryPolicy);
    plan(): Promise<string>;
}
//# sourceMappingURL=planner.d.ts.map