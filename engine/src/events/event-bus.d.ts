import { TelemetryEvent, TelemetryEventType } from "../types/monitoring.js";
export type EventListener<T = Record<string, unknown>> = (event: TelemetryEvent & {
    payload: T;
}) => void;
export interface EventBusConfig {
    maxListeners?: number;
    wildcardSupport?: boolean;
}
export declare class EventBus {
    private static instance;
    private listeners;
    private wildcardListeners;
    private maxListeners;
    private constructor();
    static getInstance(config?: EventBusConfig): EventBus;
    on<T = Record<string, unknown>>(eventType: TelemetryEventType | string, listener: EventListener<T>): void;
    once<T = Record<string, unknown>>(eventType: TelemetryEventType | string, listener: EventListener<T>): void;
    off<T = Record<string, unknown>>(eventType: TelemetryEventType | string, listener: EventListener<T>): void;
    emit<T = Record<string, unknown>>(eventType: TelemetryEventType | string, payload: T, source?: string): void;
    onAny(listener: EventListener): void;
    offAny(listener: EventListener): void;
    clear(): void;
    listenerCount(eventType: TelemetryEventType | string): number;
    getEventTypes(): string[];
    private enforceMaxListeners;
}
//# sourceMappingURL=event-bus.d.ts.map