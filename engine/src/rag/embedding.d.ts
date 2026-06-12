export interface EmbeddingClient {
    embed(text: string): Promise<number[]>;
    embedBatch(texts: string[]): Promise<number[][]>;
}
export declare class OpenAICompatibleEmbedding implements EmbeddingClient {
    private readonly apiKey;
    private readonly model;
    private readonly baseUrl;
    constructor(options?: {
        apiKey?: string;
        model?: string;
        baseUrl?: string;
    });
    embed(text: string): Promise<number[]>;
    embedBatch(texts: string[]): Promise<number[][]>;
}
export declare class LocalEmbedding implements EmbeddingClient {
    embed(text: string): Promise<number[]>;
    embedBatch(texts: string[]): Promise<number[][]>;
}
export declare function createEmbeddingClient(): EmbeddingClient;
//# sourceMappingURL=embedding.d.ts.map