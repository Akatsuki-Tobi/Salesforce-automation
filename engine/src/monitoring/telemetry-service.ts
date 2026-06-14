import { TelemetryEvent, TelemetryEventType } from "../types/monitoring.js";

export class TelemetryService {
  private static instance: TelemetryService;
  private eventBuffer: TelemetryEvent[] = [];
  private eventListeners: ((event: TelemetryEvent) => void)[] = [];
  private maxBufferSize: number = 1000;

  private constructor() {}

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  // Emit an event
  public emitEvent(
    source: string,
    type: TelemetryEventType,
    payload: Record<string, unknown>
  ): void {
    const event: TelemetryEvent = {
      timestamp: new Date().toISOString(),
      source,
      type,
      payload,
    };

    // Buffer the event
    this.eventBuffer.push(event);
    if (this.eventBuffer.length > this.maxBufferSize) {
      this.eventBuffer.shift(); // Remove oldest event if buffer is full
    }

    // Notify listeners
    this.eventListeners.forEach((listener) => listener(event));
  }

  // Subscribe to events
  public subscribe(listener: (event: TelemetryEvent) => void): void {
    this.eventListeners.push(listener);
  }

  // Unsubscribe from events
  public unsubscribe(listener: (event: TelemetryEvent) => void): void {
    this.eventListeners = this.eventListeners.filter((l) => l !== listener);
  }

  // Get all buffered events
  public getEvents(): TelemetryEvent[] {
    return [...this.eventBuffer];
  }

  // Get events filtered by type
  public getEventsByType(type: TelemetryEventType): TelemetryEvent[] {
    return this.eventBuffer.filter((event) => event.type === type);
  }

  // Get events filtered by source
  public getEventsBySource(source: string): TelemetryEvent[] {
    return this.eventBuffer.filter((event) => event.source === source);
  }

  // Clear the event buffer
  public clearEvents(): void {
    this.eventBuffer = [];
  }

  // Set max buffer size
  public setMaxBufferSize(size: number): void {
    this.maxBufferSize = size;
    if (this.eventBuffer.length > this.maxBufferSize) {
      this.eventBuffer = this.eventBuffer.slice(-this.maxBufferSize);
    }
  }
}
