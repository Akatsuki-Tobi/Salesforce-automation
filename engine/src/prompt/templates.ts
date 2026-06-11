import type { WorldModel } from "../types/agent.js";

export function buildSystemPrompt(): string {
  return `You are a web automation planning agent. Use only observed page elements and state from the world model. Never invent selectors. Prefer visible interactive elements and explain expected outcomes clearly. Always return valid JSON in the defined planner output schema.`;
}

export function buildUserPrompt(worldModel: WorldModel): string {
  const observation = worldModel.observations[worldModel.observations.length - 1];
  return `Goal: ${worldModel.goal}\n` +
    `Current URL: ${worldModel.browser.currentUrl}\n` +
    `Title: ${worldModel.browser.pageTitle}\n` +
    `Visible text snippet: ${observation?.visibleText ?? ""}\n` +
    `Recent completed actions: ${worldModel.memory.completedActions.map((action) => action.action).join(", ")}\n` +
    `Recent failed actions: ${worldModel.memory.failedActions.map((action) => action.action).join(", ")}\n` +
    `Discovered facts: ${worldModel.memory.discoveredFacts.join("; ")}\n` +
    `Elements: ${JSON.stringify(observation?.dom ?? [], null, 2)}\n` +
    `Return a planner output JSON object with thought, confidence, expected_outcome, action, params, and is_complete.`;
}
