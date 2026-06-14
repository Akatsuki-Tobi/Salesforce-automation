"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryVectorStore = void 0;
class InMemoryVectorStore {
    constructor() {
        this.items = [];
    }
    add(chunks) {
        for (const chunk of chunks) {
            if (chunk.embedding) {
                this.items.push({ chunk, embedding: chunk.embedding });
            }
        }
    }
    query(embedding, topK) {
        if (this.items.length === 0)
            return [];
        const scores = this.items.map((item) => ({
            chunk: item.chunk,
            score: this.cosineSimilarity(embedding, item.embedding),
        }));
        scores.sort((a, b) => b.score - a.score);
        return scores.slice(0, topK).map((s) => s.chunk);
    }
    clear() {
        this.items = [];
    }
    size() {
        return this.items.length;
    }
    cosineSimilarity(a, b) {
        if (a.length !== b.length)
            return 0;
        let dot = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        const denom = Math.sqrt(normA) * Math.sqrt(normB);
        return denom === 0 ? 0 : dot / denom;
    }
}
exports.InMemoryVectorStore = InMemoryVectorStore;
