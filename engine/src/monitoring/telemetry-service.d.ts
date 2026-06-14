import { TelemetryEvent, TelemetryEventType } from "../types/monitoring.js";
export declare class TelemetryService {
    private static instance;
    private eventBuffer;
    private eventListeners;
    private maxBufferSize;
    private constructor();
    static getInstance(): TelemetryService;
    emitEvent(source: string, type: TelemetryEventType, payload: Record<string, unknown>): void;
    subscribe(listener: (event: TelemetryEvent) => void): void;
    unsubscribe(listener: (event: TelemetryEvent) => void): void;
    getEvents(): TelemetryEvent[];
    getEventsByType(type: TelemetryEventType): TelemetryEvent[];
    getEventsBySource(source: string): TelemetryEvent[];
    clearEvents(): void;
    setMaxBufferSize(size: number): void;
}
//# sourceMappingURL=telemetry-service.d.ts.map