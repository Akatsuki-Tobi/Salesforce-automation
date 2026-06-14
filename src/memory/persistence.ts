import { MemoryManager } from "./memoryManager";

export class Persistence {
    private memoryManager: MemoryManager;

    constructor(memoryManager: MemoryManager) {
        this.memoryManager = memoryManager;
    }

    public persist(): void {
        // Implement persistence logic here
    }
}