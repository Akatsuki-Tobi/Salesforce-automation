import type { KnowledgeChunk, KnowledgeType } from "../types/agent.js";

export interface ChunkOptions {
  chunkSize?: number; // tokens (approx 4 chars per token)
  overlap?: number;   // tokens
}

export class Chunker {
  private readonly chunkSize: number;
  private readonly overlap: number;

  constructor(options: ChunkOptions = {}) {
    this.chunkSize = options.chunkSize ?? 750; // ~3000 chars
    this.overlap = options.overlap ?? 100;    // ~400 chars
  }

  chunk(
    content: string,
    metadata: {
      source: string;
      url?: string;
      title?: string;
      timestamp: number;
      knowledgeType: KnowledgeType;
    }
  ): KnowledgeChunk[] {
    const chunks: KnowledgeChunk[] = [];
    const text = content.trim();
    if (!text) return chunks;

    // Simple character-based chunking (approx tokens)
    const charSize = this.chunkSize * 4;
    const charOverlap = this.overlap * 4;

    let start = 0;
    let chunkIndex = 0;

    while (start < text.length) {
      let end = Math.min(start + charSize, text.length);

      // Try to break at paragraph or sentence boundary
      if (end < text.length) {
        const paragraphBreak = text.lastIndexOf("\n\n", end);
        const sentenceBreak = text.lastIndexOf(". ", end);
        const breakPoint = paragraphBreak > start ? paragraphBreak : sentenceBreak > start ? sentenceBreak : end;
        end = breakPoint;
      }

      const chunkContent = text.slice(start, end).trim();
      if (chunkContent.length > 50) {
        chunks.push({
          chunkId: `chunk-${Date.now()}-${chunkIndex++}`,
          content: chunkContent,
          source: metadata.source,
          url: metadata.url,
          title: metadata.title,
          timestamp: metadata.timestamp,
          knowledgeType: metadata.knowledgeType,
        });
      }

      start = end - charOverlap;
      if (start < 0) start = 0;
      if (start >= text.length) break;
    }

    return chunks;
  }
}
