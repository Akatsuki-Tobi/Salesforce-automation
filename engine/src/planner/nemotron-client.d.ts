export interface NemotronConfig {
    apiKey: string;
    baseUrl?: string;
    model?: string;
    temperature?: number;
}
export declare class NemotronClient {
    private readonly openai;
    private readonly model;
    private readonly temperature;
    constructor(config: NemotronConfig);
    generateAction(systemPrompt: string, userPrompt: string): Promise<string>;
    chat(prompt: string, maxTokens?: number): Promise<string>;
}
//# sourceMappingURL=nemotron-client.d.ts.map