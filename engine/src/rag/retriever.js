import { VectorStore } from "./store.js";
import { createEmbeddingClient } from "./embedding.js";
export class Retriever {
    store;
    embedder;
    constructor(store) {
        this.store = store;
        this.embedder = createEmbeddingClient();
    }
    async retrieve(query, topK = 5) {
        const start = Date.now();
        try {
            const queryEmbedding = await this.embedder.embed(query);
            const candidates = this.store.query(queryEmbedding, topK * 2); // retrieve more for re-ranking
            if (candidates.length === 0) {
                return { chunks: [], query, retrievalLatencyMs: Date.now() - start };
            }
            const reranked = this.rerank(candidates, query).slice(0, topK);
            return { chunks: reranked, query, retrievalLatencyMs: Date.now() - start };
        }
        catch (error) {
            console.error("Retrieval error:", error);
            return { chunks: [], query, retrievalLatencyMs: Date.now() - start };
        }
    }
    rerank(chunks, query) {
        const domainWeights = (typeof DOMAIN_WEIGHTS !== "undefined" ? DOMAIN_WEIGHTS : {});
        return chunks
            .map((chunk) => {
            let score = 0;
            // Vector similarity is already the primary sort; we add adjustments
            // Use the existing order as base (higher similarity first)
            score += 1; // placeholder; actual similarity is implicit by order
            // Authority boost from domain
            if (chunk.url) {
                try {
                    const hostname = new URL(chunk.url).hostname.replace(/^www\./, "");
                    score += (domainWeights[hostname] ?? 1) * 0.5;
                }
                catch {
                    // ignore
                }
            }
            // Freshness boost (newer content)
            const ageHours = (Date.now() - chunk.timestamp) / (1000 * 60 * 60);
            const freshness = ageHours < 24 ? 1 : ageHours < 168 ? 0.5 : 0.1;
            score += freshness;
            // Relevance: query term presence in content
            const queryLower = query.toLowerCase();
            const contentLower = chunk.content.toLowerCase();
            const termMatches = queryLower.split(/\s+/).filter((term) => contentLower.includes(term)).length;
            score += termMatches * 0.2;
            return { ...chunk, _rerankScore: score };
        })
            .sort((a, b) => b._rerankScore - a._rerankScore)
            .map(({ _rerankScore, ...rest }) => rest);
    }
}
//# sourceMappingURL=retriever.js.map