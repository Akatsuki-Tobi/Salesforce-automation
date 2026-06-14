import { Memory } from "./memory";

export class MemoryManager {
    private memory: Memory;

    constructor(memory: Memory) {
        this.memory = memory;
    }

    public persist(): void {
        // Implement memory persistence logic here
    }
}