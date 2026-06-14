declare class RecoverySystem {
    private retryCount;
    private maxRetries;
    private backoff;
    handleActionFailure(error: Error): Promise<void>;
    handleObservationFailure(error: Error): Promise<void>;
    private adjustObservationStrategy;
}
export default RecoverySystem;
//# sourceMappingURL=recoverySystem.d.ts.map