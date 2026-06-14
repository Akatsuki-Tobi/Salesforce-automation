import type { RetrievedContext } from "../types/agent.js";
export declare class RAGService {
    private readonly store;
    private readonly retriever;
    private readonly searchProvider;
    private readonly scraper;
    private readonly validator;
    private readonly chunker;
    constructor();
    fillKnowledgeGap(query: string): Promise<RetrievedContext>;
}
//# sourceMappingURL=service.d.ts.map