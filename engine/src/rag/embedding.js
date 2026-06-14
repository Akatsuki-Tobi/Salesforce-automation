"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalEmbedding = exports.OpenAICompatibleEmbedding = void 0;
exports.createEmbeddingClient = createEmbeddingClient;
class OpenAICompatibleEmbedding {
    constructor(options = {}) {
        this.apiKey = options.apiKey ?? process.env.RAG_EMBEDDING_API_KEY ?? process.env.OPENAI_API_KEY ?? "";
        this.model = options.model ?? process.env.RAG_EMBEDDING_MODEL ?? "text-embedding-3-small";
        this.baseUrl = options.baseUrl ?? process.env.RAG_EMBEDDING_BASE_URL ?? "https://integrate.api.nvidia.com/v1";
    }
    async embed(text) {
        const response = await fetch(`${this.baseUrl}/embeddings`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: this.model,
                input: text,
                encoding_format: "float",
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Embedding API error: ${response.status} ${error}`);
        }
        const data = await response.json();
        return data.data[0].embedding;
    }
    async embedBatch(texts) {
        const response = await fetch(`${this.baseUrl}/embeddings`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: this.model,
                input: texts,
                encoding_format: "float",
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Embedding batch API error: ${response.status} ${error}`);
        }
        const data = await response.json();
        return data.data.map((item) => item.embedding);
    }
}
exports.OpenAICompatibleEmbedding = OpenAICompatibleEmbedding;
// Local embedding fallback (stub for now; would integrate sentence-transformers via ONNX or API)
class LocalEmbedding {
    async embed(text) {
        // In a real implementation, this would load a local model
        throw new Error("Local embedding not implemented; set RAG_EMBEDDING_BASE_URL to use cloud provider");
    }
    async embedBatch(texts) {
        throw new Error("Local embedding not implemented; set RAG_EMBEDDING_BASE_URL to use cloud provider");
    }
}
exports.LocalEmbedding = LocalEmbedding;
function createEmbeddingClient() {
    const useLocal = process.env.RAG_USE_LOCAL_EMBEDDING === "true";
    if (useLocal) {
        return new LocalEmbedding();
    }
    return new OpenAICompatibleEmbedding();
}
