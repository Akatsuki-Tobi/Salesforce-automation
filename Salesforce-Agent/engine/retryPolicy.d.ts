export declare class RetryPolicy {
    private maxRetries;
    private retryDelay;
    constructor(maxRetries: number, retryDelay: number);
    retry(action: string): Promise<boolean>;
}
//# sourceMappingURL=retryPolicy.d.ts.map