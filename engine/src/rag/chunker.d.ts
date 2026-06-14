import type { KnowledgeChunk, KnowledgeType } from "../types/agent.js";
export interface ChunkOptions {
    chunkSize?: number;
    overlap?: number;
}
export declare class Chunker {
    private readonly chunkSize;
    private readonly overlap;
    constructor(options?: ChunkOptions);
    chunk(content: string, metadata: {
        source: string;
        url?: string;
        title?: string;
        timestamp: number;
        knowledgeType: KnowledgeType;
    }): KnowledgeChunk[];
}
//# sourceMappingURL=chunker.d.ts.map