export declare class Recovery {
    private observation;
    private retryPolicy;
    constructor(observation: Observation, retryPolicy: RetryPolicy);
    recover(): Promise<boolean>;
}
//# sourceMappingURL=recovery.d.ts.map