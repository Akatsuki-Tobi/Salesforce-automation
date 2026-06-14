import * as dotenv from "dotenv";
import { NemotronClient } from "../planner/nemotron-client.js";
dotenv.config();
const client = new NemotronClient({
    apiKey: process.env.NVIDIA_API_KEY ?? "",
    model: process.env.NEMOTRON_MODEL,
});
export async function sendDirectPrompt(prompt, maxTokens = 1024) {
    if (!prompt || prompt.trim().length === 0) {
        throw new Error("Prompt is required.");
    }
    return client.chat(prompt, maxTokens);
}
//# sourceMappingURL=direct-conversation.js.map