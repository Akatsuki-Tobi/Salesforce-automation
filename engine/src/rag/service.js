"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGService = void 0;
const search_js_1 = require("./search.js");
const scraper_js_1 = require("./scraper.js");
const validator_js_1 = require("./validator.js");
const chunker_js_1 = require("./chunker.js");
const embedding_js_1 = require("./embedding.js");
const retriever_js_1 = require("./retriever.js");
const agent_js_1 = require("../types/agent.js");
const state_manager_js_1 = require("../world-model/state-manager.js");
class RAGService {
    constructor() {
        this.store = new store_js_1.VectorStore();
        this.retriever = new retriever_js_1.Retriever(this.store);
        this.searchProvider = new search_js_1.SearchProvider();
        this.scraper = new scraper_js_1.Scraper();
        this.validator = new validator_js_1.KnowledgeValidator();
        this.chunker = new chunker_js_1.Chunker();
    }
    async fillKnowledgeGap(query) {
        // Record that we are searching for this query
        (0, state_manager_js_1.recordSearchedQuery)(query);
        (0, state_manager_js_1.consumeRagBudget)({ searches: 1 });
        // Perform search
        const searchResults = await this.searchProvider.search(query);
        if (searchResults.length === 0) {
            return { chunks: [], query, retrievalLatencyMs: 0 };
        }
        // Scrape, validate, chunk, embed, and store
        let pagesScraped = 0;
        let documentsAdded = 0;
        for (const result of searchResults.slice(0, agent_js_1.RAG_MAX_SEARCHES)) {
            if (pagesScraped >= agent_js_1.RAG_MAX_SCRAPED_PAGES)
                break;
            try {
                const scraped = await this.scraper.scrapeUrl(result.url);
                const validation = this.validator.validate(scraped, query);
                if (validation.approved) {
                    pagesScraped++;
                    (0, state_manager_js_1.consumeRagBudget)({ pages: 1 });
                    // Chunk the content
                    const chunks = this.chunker.chunk(scraped.content, {
                        source: scraped.title || result.title,
                        url: result.url,
                        timestamp: scraped.metadata.timestamp,
                        knowledgeType: validation.knowledgeType,
                    });
                    // Embed and store each chunk
                    const embedder = (0, embedding_js_1.createEmbeddingClient)();
                    for (const chunk of chunks) {
                        if (documentsAdded >= agent_js_1.RAG_MAX_RAG_DOCUMENTS)
                            break;
                        try {
                            const embedding = await embedder.embed(chunk.content);
                            const knowledgeChunk = {
                                ...chunk,
                                embedding,
                            };
                            this.store.add([knowledgeChunk]);
                            documentsAdded++;
                            (0, state_manager_js_1.consumeRagBudget)({ documents: 1 });
                        }
                        catch (embedError) {
                            console.error("Failed to embed chunk:", embedError);
                        }
                    }
                }
            }
            catch (scrapeError) {
                console.error("Failed to scrape URL:", result.url, scrapeError);
            }
        }
        // Retrieve relevant context from the store
        const context = await this.retriever.retrieve(query);
        return context;
    }
}
exports.RAGService = RAGService;
