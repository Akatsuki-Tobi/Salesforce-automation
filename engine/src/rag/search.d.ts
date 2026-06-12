export declare class SearchProvider {
    private readonly serperApiKey;
    private readonly searchedQueries;
    constructor(serperApiKey?: string);
    search(query: string): Promise<SearchResult[]>;
    private searchSerper;
    private searchDuckDuckGo;
    private rankResults;
    getSearchedQueries(): string[];
}
//# sourceMappingURL=search.d.ts.map