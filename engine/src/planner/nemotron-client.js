"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NemotronClient = void 0;
const openai_1 = __importDefault(require("openai"));
class NemotronClient {
    constructor(config) {
        if (!config.apiKey) {
            throw new Error("NVIDIA_API_KEY is required to initialize the Nemotron client.");
        }
        this.openai = new openai_1.default({
            apiKey: config.apiKey,
            baseURL: config.baseUrl || "https://integrate.api.nvidia.com/v1",
        });
        this.model = config.model || "nvidia/llama-3.1-nemotron-70b-instruct";
        this.temperature = config.temperature ?? 0.1;
    }
    async generateAction(systemPrompt, userPrompt) {
        const response = await this.openai.chat.completions.create({
            model: this.model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: this.temperature,
            max_tokens: 1024,
            response_format: { type: "json_object" },
        });
        const content = response.choices?.[0]?.message?.content;
        if (!content) {
            throw new Error("Nemotron returned an empty response.");
        }
        return content;
    }
    async chat(prompt, maxTokens = 1024) {
        const response = await this.openai.chat.completions.create({
            model: this.model,
            messages: [
                { role: "user", content: prompt },
            ],
            temperature: this.temperature,
            max_tokens: maxTokens,
        });
        const content = response.choices?.[0]?.message?.content;
        if (!content) {
            throw new Error("Nemotron returned an empty response.");
        }
        return content;
    }
}
exports.NemotronClient = NemotronClient;
