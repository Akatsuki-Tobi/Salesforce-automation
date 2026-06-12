import { KnowledgeScore, KnowledgeType } from "../types/agent.js";
export class SearchProvider {
    serperApiKey;
    searchedQueries = new Set();
    constructor(serperApiKey) {
        this.serperApiKey = serperApiKey ?? process.env.SERPER_API_KEY ?? "";
    }
    async search(query) {
        if (this.searchedQueries.has(query)) {
            return []; // Prevent duplicate searches
        }
        this.searchedQueries.add(query);
        // Try Serper.dev first if API key is available
        if (this.serperApiKey) {
            try {
                const results = await this.searchSerper(query);
                return this.rankResults(results);
            }
            catch (error) {
                console.warn("Serper search failed, falling back to DuckDuckGo:", error);
            }
        }
        // Fallback to DuckDuckGo scraping
        return this.searchDuckDuckGo(query);
    }
    async searchSerper(query) {
        const response = await fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
                "X-API-KEY": this.serperApiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ q: query, num: 10 }),
        });
        if (!response.ok) {
            throw new Error(`Serper API error: ${response.statusText}`);
        }
        const data = await response.json();
        const organic = data.organic || [];
        return organic.map((item) => ({
            title: item.title,
            snippet: item.snippet,
            url: item.link,
        }));
    }
    async searchDuckDuckGo(query) {
        // Simple DuckDuckGo HTML scraping (no API key needed)
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; SalesforceProxyBot/1.0)",
            },
        });
        if (!response.ok) {
            throw new Error(`DuckDuckGo fetch failed: ${response.statusText}`);
        }
        const html = await response.text();
        const results = [];
        // Basic regex-based extraction (for MVP; consider a proper parser)
        const resultRegex = /<a rel="nofollow" class="result__url" href="([^"]+)".*?<a class="result__title".*?>(.*?)<\/a>.*?<a class="result__snippet".*?>(.*?)<\/a>/gs;
        let match;
        while ((match = resultRegex.exec(html)) !== null) {
            results.push({
                title: match[2].replace(/<[^>]*>/g, "").trim(),
                snippet: match[3].replace(/<[^>]*>/g, "").trim(),
                url: match[1],
            });
            if (results.length >= 10)
                break;
        }
        return results;
    }
    rankResults(results) {
        const domainWeights = (typeof DOMAIN_WEIGHTS !== "undefined" ? DOMAIN_WEIGHTS : {});
        return results
            .map((result) => {
            let score = 0;
            try {
                const url = new URL(result.url);
                const hostname = url.hostname.replace(/^www\./, "");
                score += domainWeights[hostname] ?? 1;
            }
            catch {
                // ignore invalid URLs
            }
            // Simple relevance: snippet length and title presence
            score += result.snippet.length > 0 ? 1 : 0;
            score += result.title.length > 0 ? 1 : 0;
            return { ...result, _score: score };
        })
            .sort((a, b) => b._score - a._score)
            .map(({ _score, ...rest }) => rest);
    }
    getSearchedQueries() {
        return Array.from(this.searchedQueries);
    }
}
//# sourceMappingURL=search.js.map