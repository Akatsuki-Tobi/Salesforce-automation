import { TelemetryEvent, TelemetryEventType } from "../types/monitoring.js";

export type EventListener<T = Record<string, unknown>> = (event: TelemetryEvent & { payload: T }) => void;

export interface EventBusConfig {
  maxListeners?: number;
  wildcardSupport?: boolean;
}

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, Set<EventListener>> = new Map();
  private wildcardListeners: Set<EventListener> = new Set();
  private maxListeners: number = 100;

  private constructor(config: EventBusConfig = {}) {
    this.maxListeners = config.maxListeners ?? this.maxListeners;
  }

  public static getInstance(config?: EventBusConfig): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus(config);
    }
    return EventBus.instance;
  }

  public on<T = Record<string, unknown>>(
    eventType: TelemetryEventType | string,
    listener: EventListener<T>
  ): void {
    const key = eventType.toString();
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    const listenerSet = this.listeners.get(key)!;
    listenerSet.add(listener as EventListener);
    this.enforceMaxListeners();
  }

  public once<T = Record<string, unknown>>(
    eventType: TelemetryEventType | string,
    listener: EventListener<T>
  ): void {
    const onceListener: EventListener<T> = (event) => {
      listener(event);
      this.off(eventType, onceListener);
    };
    this.on(eventType, onceListener);
  }

  public off<T = Record<string, unknown>>(
    eventType: TelemetryEventType | string,
    listener: EventListener<T>
  ): void {
    const key = eventType.toString();
    const listenerSet = this.listeners.get(key);
    if (listenerSet) {
      listenerSet.delete(listener as EventListener);
    }
  }

  public emit<T = Record<string, unknown>>(
    eventType: TelemetryEventType | string,
    payload: T,
    source: string = "unknown"
  ): void {
    const event: TelemetryEvent = {
      timestamp: new Date().toISOString(),
      source,
      type: eventType as TelemetryEventType,
      payload,
    };

    // Notify specific listeners
    const key = eventType.toString();
    const listenerSet = this.listeners.get(key);
    if (listenerSet) {
      listenerSet.forEach((listener) => {
        try {
          listener(event as TelemetryEvent & { payload: T });
        } catch (error) {
          console.error(`Error in event listener for ${key}:`, error);
        }
      });
    }

    // Notify wildcard listeners
    this.wildcardListeners.forEach((listener) => {
      try {
        listener(event as TelemetryEvent & { payload: T });
      } catch (error) {
        console.error("Error in wildcard event listener:", error);
      }
    });
  }

  public onAny(listener: EventListener): void {
    this.wildcardListeners.add(listener);
    this.enforceMaxListeners();
  }

  public offAny(listener: EventListener): void {
    this.wildcardListeners.delete(listener);
  }

  public clear(): void {
    this.listeners.clear();
    this.wildcardListeners.clear();
  }

  public listenerCount(eventType: TelemetryEventType | string): number {
    const key = eventType.toString();
    const listenerSet = this.listeners.get(key);
    return listenerSet ? listenerSet.size : 0;
  }

  public getEventTypes(): string[] {
    return Array.from(this.listeners.keys());
  }

  private enforceMaxListeners(): void {
    for (const [key, listenerSet] of this.listeners) {
      if (listenerSet.size > this.maxListeners) {
        console.warn(
          `Possible EventBus memory leak detected: ${listenerSet.size} listeners for event type "${key}".`
        );
      }
    }
    if (this.wildcardListeners.size > this.maxListeners) {
      console.warn(
        `Possible EventBus memory leak detected: ${this.wildcardListeners.size} wildcard listeners.`
      );
    }
  }
}
