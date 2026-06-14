import { Page } from "playwright";
import type { PlannerOutput } from "../types/agent.js";
export declare class PlaywrightExecutor {
    private browser;
    page: Page | null;
    launch(): Promise<void>;
    close(): Promise<void>;
    navigate(url: string): Promise<void>;
    click(selector: string): Promise<void>;
    type(selector: string, value: string): Promise<void>;
    hover(selector: string): Promise<void>;
    executeAction(plan: PlannerOutput): Promise<void>;
}
//# sourceMappingURL=playwright-executor.d.ts.map