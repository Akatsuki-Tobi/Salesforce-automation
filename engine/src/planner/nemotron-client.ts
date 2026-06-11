import OpenAI from "openai";

export interface NemotronConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
}

export class NemotronClient {
  private readonly openai: OpenAI;
  private readonly model: string;
  private readonly temperature: number;

  constructor(config: NemotronConfig) {
    if (!config.apiKey) {
      throw new Error("NVIDIA_API_KEY is required to initialize the Nemotron client.");
    }

    this.openai = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl || "https://integrate.api.nvidia.com/v1",
    });

    this.model = config.model || "nvidia/llama-3.1-nemotron-70b-instruct";
    this.temperature = config.temperature ?? 0.1;
  }

  async generateAction(systemPrompt: string, userPrompt: string): Promise<string> {
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
}
