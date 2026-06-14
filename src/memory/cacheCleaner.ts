import { MemoryManager } from "./memoryManager";

export class CacheCleaner {
    private memoryManager: MemoryManager;

    constructor(memoryManager: MemoryManager) {
        this.memoryManager = memoryManager;
    }

    public cleanCache(): void {
        // Implement cache cleaning logic here
    }
}