export declare class EngineLoop {
    private readonly planner;
    private readonly executor;
    private readonly gapDetector;
    private readonly ragService;
    private failureCount;
    private stepCount;
    start(goal: string): Promise<void>;
    private observe;
    private recover;
}
//# sourceMappingURL=engine-loop.d.ts.map