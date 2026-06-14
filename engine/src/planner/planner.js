"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Planner = void 0;
const nemotron_client_js_1 = require("./nemotron-client.js");
const templates_js_1 = require("../prompt/templates.js");
const schema_validator_js_1 = require("./schema-validator.js");
class Planner {
    constructor() {
        this.client = new nemotron_client_js_1.NemotronClient({
            apiKey: process.env.NVIDIA_API_KEY ?? "",
            model: process.env.NEMOTRON_MODEL,
        });
    }
    async planNextStep(worldModel) {
        const systemPrompt = (0, templates_js_1.buildSystemPrompt)();
        const userPrompt = (0, templates_js_1.buildUserPrompt)(worldModel);
        const rawJson = await this.client.generateAction(systemPrompt, userPrompt);
        const parsedAction = JSON.parse(rawJson);
        const validation = (0, schema_validator_js_1.validateSchema)(parsedAction);
        if (!validation.approved) {
            throw new Error(`Nemotron output failed schema validation: ${validation.reason}`);
        }
        return parsedAction;
    }
}
exports.Planner = Planner;
