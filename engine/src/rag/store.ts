import type { KnowledgeChunk } from "../types/agent.js";

export interface VectorStore {
  add(chunks: KnowledgeChunk[]): void;
  query(embedding: number[], topK: number): KnowledgeChunk[];
  clear(): void;
  size(): number;
}

export class InMemoryVectorStore implements VectorStore {
  private items: Array<{ chunk: KnowledgeChunk; embedding: number[] }> = [];

  add(chunks: KnowledgeChunk[]): void {
    for (const chunk of chunks) {
      if (chunk.embedding) {
        this.items.push({ chunk, embedding: chunk.embedding });
      }
    }
  }

  query(embedding: number[], topK: number): KnowledgeChunk[] {
    if (this.items.length === 0) return [];

    const scores = this.items.map((item) => ({
      chunk: item.chunk,
      score: this.cosineSimilarity(embedding, item.embedding),
    }));

    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, topK).map((s) => s.chunk);
  }

  clear(): void {
    this.items = [];
  }

  size(): number {
    return this.items.length;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
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
