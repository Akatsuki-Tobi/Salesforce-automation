import type { PlannerOutput } from "../types/agent.js";
import type { Page } from "playwright";

export interface ValidationResult {
  approved: boolean;
  reason?: string;
}

export async function validatePlannedAction(plan: PlannerOutput, page: Page | null): Promise<ValidationResult> {
  if (!page) {
    return { approved: false, reason: "No browser page available for validation." };
  }

  const { action, params } = plan;

  if (typeof plan.thought !== "string" || plan.thought.length === 0) {
    return { approved: false, reason: "Planner output missing a thought." };
  }

  if (action === "navigate") {
    if (typeof params.url !== "string") {
      return { approved: false, reason: "navigate action requires a url." };
    }
    return { approved: true };
  }

  if (["click", "type", "hover"].includes(action)) {
    if (typeof params.selector !== "string") {
      return { approved: false, reason: `${action} action requires a selector.` };
    }

    const element = await page.$(params.selector);
    if (!element) {
      return { approved: false, reason: `Selector not found: ${params.selector}` };
    }

    if (!(await element.isVisible())) {
      return { approved: false, reason: `Selector not visible: ${params.selector}` };
    }

    return { approved: true };
  }

  if (action === "refresh") {
    return { approved: true };
  }

  return { approved: false, reason: `Unsupported action type: ${action}` };
}
