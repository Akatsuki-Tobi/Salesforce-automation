"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryService = void 0;
class TelemetryService {
    constructor() {
        this.eventBuffer = [];
        this.eventListeners = [];
        this.maxBufferSize = 1000;
    }
    static getInstance() {
        if (!TelemetryService.instance) {
            TelemetryService.instance = new TelemetryService();
        }
        return TelemetryService.instance;
    }
    // Emit an event
    emitEvent(source, type, payload) {
        const event = {
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
    subscribe(listener) {
        this.eventListeners.push(listener);
    }
    // Unsubscribe from events
    unsubscribe(listener) {
        this.eventListeners = this.eventListeners.filter((l) => l !== listener);
    }
    // Get all buffered events
    getEvents() {
        return [...this.eventBuffer];
    }
    // Get events filtered by type
    getEventsByType(type) {
        return this.eventBuffer.filter((event) => event.type === type);
    }
    // Get events filtered by source
    getEventsBySource(source) {
        return this.eventBuffer.filter((event) => event.source === source);
    }
    // Clear the event buffer
    clearEvents() {
        this.eventBuffer = [];
    }
    // Set max buffer size
    setMaxBufferSize(size) {
        this.maxBufferSize = size;
        if (this.eventBuffer.length > this.maxBufferSize) {
            this.eventBuffer = this.eventBuffer.slice(-this.maxBufferSize);
        }
    }
}
exports.TelemetryService = TelemetryService;
