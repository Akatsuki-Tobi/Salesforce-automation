import { MemoryManager } from "../memory/memoryManager";

export interface VectorStore {
    addVector(vector: any): void;
    getVector(id: string): any;
    removeVector(id: string): void;
}