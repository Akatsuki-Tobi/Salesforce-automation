import { Trace } from "../types/monitoring.js";
import { v4 as uuidv4 } from "uuid";

export interface TraceContext {
  currentTrace?: Trace;
  parentTraceId?: string;
}

export class TraceManager {
  private static instance: TraceManager;
  private traces: Map<string, Trace> = new Map();
  private contextStack: TraceContext[] = [];

  private constructor() {}

  public static getInstance(): TraceManager {
    if (!TraceManager.instance) {
      TraceManager.instance = new TraceManager();
    }
    return TraceManager.instance;
  }

  public startTrace(name: string, metadata?: Record<string, unknown>): Trace {
    const trace: Trace = {
      id: uuidv4(),
      name,
      startTime: Date.now(),
      metadata,
      children: [],
    };

    const currentContext = this.contextStack[this.contextStack.length - 1];
    if (currentContext?.currentTrace) {
      trace.parentTraceId = currentContext.currentTrace.id;
      currentContext.currentTrace.children.push(trace);
    }

    this.traces.set(trace.id, trace);

    // Push new context
    this.contextStack.push({
      currentTrace: trace,
      parentTraceId: currentContext?.currentTrace?.id,
    });

    return trace;
  }

  public endTrace(traceId?: string): Trace | undefined {
    const currentContext = this.contextStack.pop();
    if (!currentContext?.currentTrace) {
      return undefined;
    }

    const trace = this.traces.get(currentContext.currentTrace.id);
    if (!trace) {
      return undefined;
    }

    trace.endTime = Date.now();
    trace.duration = trace.endTime - trace.startTime;

    // If a specific traceId was provided, verify it matches
    if (traceId && trace.id !== traceId) {
      this.contextStack.push(currentContext); // Restore context
      return undefined;
    }

    return trace;
  }

  public getCurrentTrace(): Trace | undefined {
    const currentContext = this.contextStack[this.contextStack.length - 1];
    return currentContext?.currentTrace;
  }

  public getTrace(traceId: string): Trace | undefined {
    return this.traces.get(traceId);
  }

  public getAllTraces(): Trace[] {
    return Array.from(this.traces.values());
  }

  public getRootTraces(): Trace[] {
    return Array.from(this.traces.values()).filter((trace) => !trace.parentTraceId);
  }

  public getChildTraces(parentTraceId: string): Trace[] {
    const parentTrace = this.traces.get(parentTraceId);
    return parentTrace ? parentTrace.children : [];
  }

  public addMetadataToTrace(
    traceId: string,
    metadata: Record<string, unknown>
  ): void {
    const trace = this.traces.get(traceId);
    if (trace) {
      trace.metadata = { ...trace.metadata, ...metadata };
    }
  }

  public clearTraces(): void {
    this.traces.clear();
    this.contextStack = [];
  }

  public async withTrace<T>(
    name: string,
    metadata: Record<string, unknown> = {},
    fn: () => Promise<T>
  ): Promise<T> {
    const trace = this.startTrace(name, metadata);
    try {
      const result = await fn();
      this.endTrace(trace.id);
      return result;
    } catch (error) {
      this.endTrace(trace.id);
      throw error;
    }
  }

  public exportTraces(format: "json" | "tree" = "json"): string {
    if (format === "json") {
      return JSON.stringify(this.getAllTraces(), null, 2);
    } else {
      return this.buildTraceTree();
    }
  }

  private buildTraceTree(): string {
    const rootTraces = this.getRootTraces();
    return rootTraces.map((trace) => this.formatTrace(trace, 0)).join("\n");
  }

  private formatTrace(trace: Trace, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const duration = trace.duration ? ` (${trace.duration}ms)` : "";
    let result = `${indentStr}- ${trace.name}${duration}`;
    if (trace.metadata && Object.keys(trace.metadata).length > 0) {
      result += ` ${JSON.stringify(trace.metadata)}`;
    }
    trace.children.forEach((child) => {
      result += "\n" + this.formatTrace(child, indent + 1);
    });
    return result;
  }
}
