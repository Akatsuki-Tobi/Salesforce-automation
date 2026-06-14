"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceManager = void 0;
const uuid_1 = require("uuid");
class TraceManager {
    constructor() {
        this.traces = new Map();
        this.contextStack = [];
    }
    static getInstance() {
        if (!TraceManager.instance) {
            TraceManager.instance = new TraceManager();
        }
        return TraceManager.instance;
    }
    startTrace(name, metadata) {
        const trace = {
            id: (0, uuid_1.v4)(),
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
    endTrace(traceId) {
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
    getCurrentTrace() {
        const currentContext = this.contextStack[this.contextStack.length - 1];
        return currentContext?.currentTrace;
    }
    getTrace(traceId) {
        return this.traces.get(traceId);
    }
    getAllTraces() {
        return Array.from(this.traces.values());
    }
    getRootTraces() {
        return Array.from(this.traces.values()).filter((trace) => !trace.parentTraceId);
    }
    getChildTraces(parentTraceId) {
        const parentTrace = this.traces.get(parentTraceId);
        return parentTrace ? parentTrace.children : [];
    }
    addMetadataToTrace(traceId, metadata) {
        const trace = this.traces.get(traceId);
        if (trace) {
            trace.metadata = { ...trace.metadata, ...metadata };
        }
    }
    clearTraces() {
        this.traces.clear();
        this.contextStack = [];
    }
    async withTrace(name, metadata = {}, fn) {
        const trace = this.startTrace(name, metadata);
        try {
            const result = await fn();
            this.endTrace(trace.id);
            return result;
        }
        catch (error) {
            this.endTrace(trace.id);
            throw error;
        }
    }
    exportTraces(format = "json") {
        if (format === "json") {
            return JSON.stringify(this.getAllTraces(), null, 2);
        }
        else {
            return this.buildTraceTree();
        }
    }
    buildTraceTree() {
        const rootTraces = this.getRootTraces();
        return rootTraces.map((trace) => this.formatTrace(trace, 0)).join("\n");
    }
    formatTrace(trace, indent) {
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
exports.TraceManager = TraceManager;
