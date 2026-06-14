export interface EmbeddingClient {
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}

export class OpenAICompatibleEmbedding implements EmbeddingClient {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl: string;

  constructor(options: {
    apiKey?: string;
    model?: string;
    baseUrl?: string;
  } = {}) {
    this.apiKey = options.apiKey ?? process.env.RAG_EMBEDDING_API_KEY ?? process.env.OPENAI_API_KEY ?? "";
    this.model = options.model ?? process.env.RAG_EMBEDDING_MODEL ?? "text-embedding-3-small";
    this.baseUrl = options.baseUrl ?? process.env.RAG_EMBEDDING_BASE_URL ?? "https://integrate.api.nvidia.com/v1";
  }

  async embed(text: string): Promise<number[]> {
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

  async embedBatch(texts: string[]): Promise<number[][]> {
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
    return data.data.map((item: any) => item.embedding);
  }
}

// Local embedding fallback (stub for now; would integrate sentence-transformers via ONNX or API)
export class LocalEmbedding implements EmbeddingClient {
  async embed(text: string): Promise<number[]> {
    // In a real implementation, this would load a local model
    throw new Error("Local embedding not implemented; set RAG_EMBEDDING_BASE_URL to use cloud provider");
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    throw new Error("Local embedding not implemented; set RAG_EMBEDDING_BASE_URL to use cloud provider");
  }
}

export function createEmbeddingClient(): EmbeddingClient {
  const useLocal = process.env.RAG_USE_LOCAL_EMBEDDING === "true";
  if (useLocal) {
    return new LocalEmbedding();
  }
  return new OpenAICompatibleEmbedding();
}
