"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaywrightExecutor = void 0;
const playwright_1 = require("playwright");
const logger_js_1 = require("../utils/logger.js");
class PlaywrightExecutor {
    constructor() {
        this.browser = null;
        this.page = null;
    }
    async launch() {
        const headless = process.env.PLAYWRIGHT_HEADLESS !== "false";
        this.browser = await playwright_1.chromium.launch({ headless });
        const context = await this.browser.newContext();
        this.page = await context.newPage();
    }
    async close() {
        await this.page?.close();
        await this.browser?.close();
        this.page = null;
        this.browser = null;
    }
    async navigate(url) {
        if (!this.page)
            throw new Error("No Playwright page available.");
        await this.page.goto(url, { waitUntil: "domcontentloaded" });
        (0, logger_js_1.actionsLog)({ action: "navigate", target: url, result: "success" });
    }
    async click(selector) {
        if (!this.page)
            throw new Error("No Playwright page available.");
        await this.page.click(selector, { timeout: 10000 });
        (0, logger_js_1.actionsLog)({ action: "click", target: selector, result: "success" });
    }
    async type(selector, value) {
        if (!this.page)
            throw new Error("No Playwright page available.");
        await this.page.fill(selector, value, { timeout: 10000 });
        (0, logger_js_1.actionsLog)({ action: "type", target: selector, result: "success", text: value });
    }
    async hover(selector) {
        if (!this.page)
            throw new Error("No Playwright page available.");
        await this.page.hover(selector, { timeout: 10000 });
        (0, logger_js_1.actionsLog)({ action: "hover", target: selector, result: "success" });
    }
    async executeAction(plan) {
        if (!this.page)
            throw new Error("No Playwright page available.");
        const { action, params } = plan;
        switch (action) {
            case "navigate":
                if (typeof params.url !== "string")
                    throw new Error("navigate action missing url");
                await this.navigate(params.url);
                break;
            case "click":
                if (typeof params.selector !== "string")
                    throw new Error("click action missing selector");
                await this.click(params.selector);
                break;
            case "type":
                if (typeof params.selector !== "string" || typeof params.value !== "string") {
                    throw new Error("type action missing selector or value");
                }
                await this.type(params.selector, params.value);
                break;
            case "hover":
                if (typeof params.selector !== "string")
                    throw new Error("hover action missing selector");
                await this.hover(params.selector);
                break;
            case "refresh":
                await this.page.reload({ waitUntil: "domcontentloaded" });
                (0, logger_js_1.actionsLog)({ action: "refresh", result: "success" });
                break;
            default:
                throw new Error(`Unsupported action type: ${action}`);
        }
    }
}
exports.PlaywrightExecutor = PlaywrightExecutor;
