export interface ScrapedContent {
    title: string;
    content: string;
    metadata: Record<string, unknown>;
}
export declare class Scraper {
    scrapeUrl(url: string): Promise<ScrapedContent>;
    private extractContent;
}
//# sourceMappingURL=scraper.d.ts.map