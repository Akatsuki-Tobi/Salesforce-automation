import type { Observation, DOMNode, FormInfo } from "../types/agent.js";
import type { Page } from "playwright";
import { saveObservation } from "./snapshot.js";

function buildSelector(path: string[]): string {
  return path.join(" > ");
}

export async function observePage(page: Page): Promise<Observation> {
  const url = page.url();
  const title = await page.title();
  const timestamp = Date.now();
  const visibleText = (await page.textContent("body")) ?? "";

  const dom: DOMNode[] = await page.$$eval("button, a, input, textarea, select", (elements) => {
    return elements.map((el) => {
      const node = el as HTMLElement;
      const selector = node.id ? `#${node.id}` : node.tagName.toLowerCase();
      const xpath = "";
      return {
        tag: node.tagName.toLowerCase(),
        role: node.getAttribute("role") ?? undefined,
        text: node.innerText ?? undefined,
        ariaLabel: node.getAttribute("aria-label") ?? undefined,
        placeholder: node.getAttribute("placeholder") ?? undefined,
        visible: node.offsetParent !== null,
        disabled: (node as HTMLInputElement).disabled ?? false,
        selector,
        xpath,
      };
    });
  });

  const forms: FormInfo[] = await page.$$eval("form", (forms) => {
    return forms.map((form) => ({
      name: form.getAttribute("name") ?? undefined,
      action: form.getAttribute("action") ?? undefined,
      inputs: Array.from(form.querySelectorAll("input, textarea, select")).map((input) => ({
        name: input.getAttribute("name") ?? undefined,
        type: (input as HTMLInputElement).type ?? undefined,
        placeholder: input.getAttribute("placeholder") ?? undefined,
        label: (input as HTMLInputElement).labels?.[0]?.innerText ?? undefined,
      })),
    }));
  });

  const observation: Observation = {
    url,
    title,
    timestamp,
    screenshotPath: "",
    dom,
    accessibilityTree: {},
    visibleText,
    forms,
    breadcrumbs: [title],
  };

  saveObservation(observation);
  return observation;
}
