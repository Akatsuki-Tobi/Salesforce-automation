import type { RetrievedContext } from "../types/agent.js";
import { VectorStore } from "./store.js";
export declare class Retriever {
    private readonly store;
    private readonly embedder;
    constructor(store: VectorStore);
    retrieve(query: string, topK?: number): Promise<RetrievedContext>;
    private rerank;
}
//# sourceMappingURL=retriever.d.ts.map