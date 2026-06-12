import type { KnowledgeChunk } from "../types/agent.js";
export interface VectorStore {
    add(chunks: KnowledgeChunk[]): void;
    query(embedding: number[], topK: number): KnowledgeChunk[];
    clear(): void;
    size(): number;
}
export declare class InMemoryVectorStore implements VectorStore {
    private items;
    add(chunks: KnowledgeChunk[]): void;
    query(embedding: number[], topK: number): KnowledgeChunk[];
    clear(): void;
    size(): number;
    private cosineSimilarity;
}
//# sourceMappingURL=store.d.ts.map