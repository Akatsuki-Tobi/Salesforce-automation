import { NemotronClient } from "./nemotron-client.js";
import { buildSystemPrompt, buildUserPrompt } from "../prompt/templates.js";
import { validateSchema } from "./schema-validator.js";
export class Planner {
    client;
    constructor() {
        this.client = new NemotronClient({
            apiKey: process.env.NVIDIA_API_KEY ?? "",
            model: process.env.NEMOTRON_MODEL,
        });
    }
    async planNextStep(worldModel) {
        const systemPrompt = buildSystemPrompt();
        const userPrompt = buildUserPrompt(worldModel);
        const rawJson = await this.client.generateAction(systemPrompt, userPrompt);
        const parsedAction = JSON.parse(rawJson);
        const validation = validateSchema(parsedAction);
        if (!validation.approved) {
            throw new Error(`Nemotron output failed schema validation: ${validation.reason}`);
        }
        return parsedAction;
    }
}
//# sourceMappingURL=planner.js.map