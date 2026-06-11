import type { Page } from "playwright";
import { verificationLog } from "../utils/logger.js";

export async function verifyActionOutcome(expectedOutcome: string, page: Page | null): Promise<boolean> {
  if (!page) {
    verificationLog({ expectedOutcome, success: false, reason: "No browser page available" });
    return false;
  }

  const location = page.url();
  const title = await page.title();
  const visibleText = await page.textContent("body");

  const success = typeof visibleText === "string" && visibleText.toLowerCase().includes(expectedOutcome.toLowerCase());

  verificationLog({ expectedOutcome, success, currentUrl: location, title, snippet: visibleText?.slice(0, 200) });
  return success;
}
