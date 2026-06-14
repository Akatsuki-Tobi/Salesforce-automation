"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observePage = observePage;
const snapshot_js_1 = require("./snapshot.js");
function buildSelector(path) {
    return path.join(" > ");
}
async function observePage(page) {
    const url = page.url();
    const title = await page.title();
    const timestamp = Date.now();
    const visibleText = (await page.textContent("body")) ?? "";
    const dom = await page.$$eval("button, a, input, textarea, select", (elements) => {
        return elements.map((el) => {
            const node = el;
            const selector = node.id ? `#${node.id}` : node.tagName.toLowerCase();
            const xpath = "";
            return {
                tag: node.tagName.toLowerCase(),
                role: node.getAttribute("role") ?? undefined,
                text: node.innerText ?? undefined,
                ariaLabel: node.getAttribute("aria-label") ?? undefined,
                placeholder: node.getAttribute("placeholder") ?? undefined,
                visible: node.offsetParent !== null,
                disabled: node.disabled ?? false,
                selector,
                xpath,
            };
        });
    });
    const forms = await page.$$eval("form", (forms) => {
        return forms.map((form) => ({
            name: form.getAttribute("name") ?? undefined,
            action: form.getAttribute("action") ?? undefined,
            inputs: Array.from(form.querySelectorAll("input, textarea, select")).map((input) => ({
                name: input.getAttribute("name") ?? undefined,
                type: input.type ?? undefined,
                placeholder: input.getAttribute("placeholder") ?? undefined,
                label: input.labels?.[0]?.innerText ?? undefined,
            })),
        }));
    });
    const observation = {
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
    (0, snapshot_js_1.saveObservation)(observation);
    return observation;
}
