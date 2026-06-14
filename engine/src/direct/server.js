"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const direct_conversation_js_1 = require("./direct-conversation.js");
const app = (0, express_1.default)();
const port = process.env.DIRECT_PROXY_PORT ? Number(process.env.DIRECT_PROXY_PORT) : 4000;
app.use(express_1.default.json());
app.post("/prompt", async (req, res) => {
    const { prompt, maxTokens } = req.body;
    if (typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({ error: "prompt is required" });
    }
    try {
        const response = await (0, direct_conversation_js_1.sendDirectPrompt)(prompt, typeof maxTokens === "number" ? maxTokens : 1024);
        res.json({ prompt, response });
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
});
app.get("/health", (_req, res) => {
    res.json({ status: "ok", model: process.env.NEMOTRON_MODEL ?? null });
});
app.listen(port, () => {
    console.log(`Direct Nemotron proxy listening on http://localhost:${port}`);
});
