import { TelemetryEvent, TelemetryEventType } from "../types/monitoring.js";
export class EventBus {
    static instance;
    listeners = new Map();
    wildcardListeners = new Set();
    maxListeners = 100;
    constructor(config = {}) {
        this.maxListeners = config.maxListeners ?? this.maxListeners;
    }
    static getInstance(config) {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus(config);
        }
        return EventBus.instance;
    }
    on(eventType, listener) {
        const key = eventType.toString();
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        const listenerSet = this.listeners.get(key);
        listenerSet.add(listener);
        this.enforceMaxListeners();
    }
    once(eventType, listener) {
        const onceListener = (event) => {
            listener(event);
            this.off(eventType, onceListener);
        };
        this.on(eventType, onceListener);
    }
    off(eventType, listener) {
        const key = eventType.toString();
        const listenerSet = this.listeners.get(key);
        if (listenerSet) {
            listenerSet.delete(listener);
        }
    }
    emit(eventType, payload, source = "unknown") {
        const event = {
            timestamp: new Date().toISOString(),
            source,
            type: eventType,
            payload,
        };
        // Notify specific listeners
        const key = eventType.toString();
        const listenerSet = this.listeners.get(key);
        if (listenerSet) {
            listenerSet.forEach((listener) => {
                try {
                    listener(event);
                }
                catch (error) {
                    console.error(`Error in event listener for ${key}:`, error);
                }
            });
        }
        // Notify wildcard listeners
        this.wildcardListeners.forEach((listener) => {
            try {
                listener(event);
            }
            catch (error) {
                console.error("Error in wildcard event listener:", error);
            }
        });
    }
    onAny(listener) {
        this.wildcardListeners.add(listener);
        this.enforceMaxListeners();
    }
    offAny(listener) {
        this.wildcardListeners.delete(listener);
    }
    clear() {
        this.listeners.clear();
        this.wildcardListeners.clear();
    }
    listenerCount(eventType) {
        const key = eventType.toString();
        const listenerSet = this.listeners.get(key);
        return listenerSet ? listenerSet.size : 0;
    }
    getEventTypes() {
        return Array.from(this.listeners.keys());
    }
    enforceMaxListeners() {
        for (const [key, listenerSet] of this.listeners) {
            if (listenerSet.size > this.maxListeners) {
                console.warn(`Possible EventBus memory leak detected: ${listenerSet.size} listeners for event type "${key}".`);
            }
        }
        if (this.wildcardListeners.size > this.maxListeners) {
            console.warn(`Possible EventBus memory leak detected: ${this.wildcardListeners.size} wildcard listeners.`);
        }
    }
}
//# sourceMappingURL=event-bus.js.map