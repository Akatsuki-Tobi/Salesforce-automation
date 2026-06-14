export class Scraper {
    async scrapeUrl(url) {
        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (compatible; SalesforceProxyBot/1.0)",
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
            }
            const html = await response.text();
            return this.extractContent(html, url);
        }
        catch (error) {
            console.error(`Scraping error for ${url}:`, error);
            return {
                title: "",
                content: "",
                metadata: { error: error instanceof Error ? error.message : String(error), url },
            };
        }
    }
    extractContent(html, url) {
        // Try to use a simple readability-like extraction
        // Remove script, style, nav, footer, header, aside, ads
        const cleaned = html
            .replace(/<script\b[^<]*>(.*?)<\/script>/gis, "")
            .replace(/<style\b[^<]*>(.*?)<\/style>/gis, "")
            .replace(/<nav\b[^<]*>(.*?)<\/nav>/gis, "")
            .replace(/<footer\b[^<]*>(.*?)<\/footer>/gis, "")
            .replace(/<header\b[^<]*>(.*?)<\/header>/gis, "")
            .replace(/<aside\b[^<]*>(.*?)<\/aside>/gis, "")
            .replace(/<[^>]*class="[^"]*(?:ad|advertisement|sidebar|menu|nav)[^"]*"[^>]*>/gi, "")
            .replace(/<[^>]*id="[^"]*(?:ad|advertisement|sidebar|menu|nav)[^"]*"[^>]*>/gi, "");
        // Extract title
        const titleMatch = cleaned.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : "";
        // Extract main content: look for <main>, <article>, or the largest <div>
        let content = "";
        const mainMatch = cleaned.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
        const articleMatch = cleaned.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
        const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (mainMatch) {
            content = mainMatch[1];
        }
        else if (articleMatch) {
            content = articleMatch[1];
        }
        else if (bodyMatch) {
            content = bodyMatch[1];
        }
        else {
            content = cleaned;
        }
        // Strip remaining HTML tags but preserve some structure
        content = content
            .replace(/<h[1-6][^>]*>/gi, "\n\n=== HEADING ===\n")
            .replace(/<\/h[1-6]>/gi, "\n")
            .replace(/<p[^>]*>/gi, "\n")
            .replace(/<\/p>/gi, "\n")
            .replace(/<li[^>]*>/gi, "  - ")
            .replace(/<\/li>/gi, "\n")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s{2,}/g, " ")
            .trim();
        return {
            title,
            content,
            metadata: {
                url,
                scrapedAt: new Date().toISOString(),
                contentLength: content.length,
            },
        };
    }
}
//# sourceMappingURL=scraper.js.map