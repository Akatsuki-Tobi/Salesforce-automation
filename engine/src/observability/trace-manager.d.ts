import { Trace } from "../types/monitoring.js";
export interface TraceContext {
    currentTrace?: Trace;
    parentTraceId?: string;
}
export declare class TraceManager {
    private static instance;
    private traces;
    private contextStack;
    private constructor();
    static getInstance(): TraceManager;
    startTrace(name: string, metadata?: Record<string, unknown>): Trace;
    endTrace(traceId?: string): Trace | undefined;
    getCurrentTrace(): Trace | undefined;
    getTrace(traceId: string): Trace | undefined;
    getAllTraces(): Trace[];
    getRootTraces(): Trace[];
    getChildTraces(parentTraceId: string): Trace[];
    addMetadataToTrace(traceId: string, metadata: Record<string, unknown>): void;
    clearTraces(): void;
    withTrace<T>(name: string, metadata: Record<string, unknown> | undefined, fn: () => Promise<T>): Promise<T>;
    exportTraces(format?: "json" | "tree"): string;
    private buildTraceTree;
    private formatTrace;
}
//# sourceMappingURL=trace-manager.d.ts.map