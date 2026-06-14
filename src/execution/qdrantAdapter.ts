import { VectorStore } from "./vectorStore";

export class QdrantAdapter implements VectorStore {
    private vectorStore: VectorStore;

    constructor(vectorStore: VectorStore) {
        this.vectorStore = vectorStore;
    }

    public addVector(vector: any): void {
        // Implement add vector logic here
    }

    public getVector(id: string): any {
        // Implement get vector logic here
    }

    public removeVector(id: string): void {
        // Implement remove vector logic here
    }
}