import { SearchProvider } from "./search.js";
import { Scraper } from "./scraper.js";
import { KnowledgeValidator } from "./validator.js";
import { Chunker } from "./chunker.js";
import { createEmbeddingClient } from "./embedding.js";
import { VectorStore } from "./store.js";
import { Retriever } from "./retriever.js";
import type { KnowledgeChunk, RetrievedContext } from "../types/agent.js";
import { RAG_MAX_SEARCHES, RAG_MAX_SCRAPED_PAGES, RAG_MAX_RAG_DOCUMENTS } from "../types/agent.js";
import { recordSearchedQuery, consumeRagBudget } from "../world-model/state-manager.js";

export class RAGService {
  private readonly store: VectorStore;
  private readonly retriever: Retriever;
  private readonly searchProvider: SearchProvider;
  private readonly scraper: Scraper;
  private readonly validator: KnowledgeValidator;
  private readonly chunker: Chunker;

  constructor() {
    this.store = new VectorStore();
    this.retriever = new Retriever(this.store);
    this.searchProvider = new SearchProvider();
    this.scraper = new Scraper();
    this.validator = new KnowledgeValidator();
    this.chunker = new Chunker();
  }

  async fillKnowledgeGap(query: string): Promise<RetrievedContext> {
    // Record that we are searching for this query
    recordSearchedQuery(query);
    consumeRagBudget({ searches: 1 });

    // Perform search
    const searchResults = await this.searchProvider.search(query);
    if (searchResults.length === 0) {
      return { chunks: [], query, retrievalLatencyMs: 0 };
    }

    // Scrape, validate, chunk, embed, and store
    let pagesScraped = 0;
    let documentsAdded = 0;

    for (const result of searchResults.slice(0, RAG_MAX_SEARCHES)) {
      if (pagesScraped >= RAG_MAX_SCRAPED_PAGES) break;

      try {
        const scraped = await this.scraper.scrapeUrl(result.url);
        const validation = this.validator.validate(scraped, query);

        if (validation.approved) {
          pagesScraped++;
          consumeRagBudget({ pages: 1 });

          // Chunk the content
          const chunks = this.chunker.chunk(scraped.content, {
            source: scraped.title || result.title,
            url: result.url,
            timestamp: scraped.metadata.timestamp,
            knowledgeType: validation.knowledgeType,
          });

          // Embed and store each chunk
          const embedder = createEmbeddingClient();
          for (const chunk of chunks) {
            if (documentsAdded >= RAG_MAX_RAG_DOCUMENTS) break;

            try {
              const embedding = await embedder.embed(chunk.content);
              const knowledgeChunk: KnowledgeChunk = {
                ...chunk,
                embedding,
              };
              this.store.add([knowledgeChunk]);
              documentsAdded++;
              consumeRagBudget({ documents: 1 });
            } catch (embedError) {
              console.error("Failed to embed chunk:", embedError);
            }
          }
        }
      } catch (scrapeError) {
        console.error("Failed to scrape URL:", result.url, scrapeError);
      }
    }

    // Retrieve relevant context from the store
    const context = await this.retriever.retrieve(query);
    return context;
  }
}
