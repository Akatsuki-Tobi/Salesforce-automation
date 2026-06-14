"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = validateSchema;
const allowedActions = new Set([
    "click",
    "type",
    "navigate",
    "scroll",
    "hover",
    "select",
    "keypress",
    "switchTab",
    "refresh",
    "goBack",
    "waitForElement",
]);
function validateSchema(value) {
    if (!value || typeof value !== "object") {
        return { approved: false, reason: "Output is not an object" };
    }
    const actionPayload = value;
    if (typeof actionPayload.thought !== "string") {
        return { approved: false, reason: "Missing or invalid 'thought' field" };
    }
    if (typeof actionPayload.confidence !== "number") {
        return { approved: false, reason: "Missing or invalid 'confidence' field" };
    }
    if (typeof actionPayload.expected_outcome !== "string") {
        return { approved: false, reason: "Missing or invalid 'expected_outcome' field" };
    }
    if (typeof actionPayload.action !== "string" || !allowedActions.has(actionPayload.action)) {
        return { approved: false, reason: "Missing or invalid 'action' field" };
    }
    if (typeof actionPayload.params !== "object" || actionPayload.params === null) {
        return { approved: false, reason: "Missing or invalid 'params' field" };
    }
    if (typeof actionPayload.is_complete !== "boolean") {
        return { approved: false, reason: "Missing or invalid 'is_complete' field" };
    }
    return { approved: true };
}
