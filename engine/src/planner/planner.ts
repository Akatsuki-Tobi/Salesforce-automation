import { NemotronClient } from "./nemotron-client.js";
import { buildSystemPrompt, buildUserPrompt } from "../prompt/templates.js";
import { validateSchema } from "./schema-validator.js";
import type { WorldModel, PlannerOutput } from "../types/agent.js";

export class Planner {
  private readonly client: NemotronClient;

  constructor() {
    this.client = new NemotronClient({
      apiKey: process.env.NVIDIA_API_KEY ?? "",
      model: process.env.NEMOTRON_MODEL,
    });
  }

  async planNextStep(worldModel: WorldModel): Promise<PlannerOutput> {
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(worldModel);
    const rawJson = await this.client.generateAction(systemPrompt, userPrompt);
    const parsedAction = JSON.parse(rawJson) as PlannerOutput;
    const validation = validateSchema(parsedAction);

    if (!validation.approved) {
      throw new Error(`Nemotron output failed schema validation: ${validation.reason}`);
    }

    return parsedAction;
  }
}
