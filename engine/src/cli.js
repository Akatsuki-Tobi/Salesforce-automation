#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const direct_conversation_js_1 = require("./direct/direct-conversation.js");
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Nemotron> ",
});
console.log("Nemotron direct CLI. Type your prompt and press Enter.");
rl.prompt();
rl.on("line", async (line) => {
    const prompt = line.trim();
    if (!prompt) {
        rl.prompt();
        return;
    }
    try {
        const response = await (0, direct_conversation_js_1.sendDirectPrompt)(prompt);
        console.log(`\nResponse:\n${response}\n`);
    }
    catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error);
    }
    rl.prompt();
}).on("close", () => {
    console.log("Goodbye.");
    process.exit(0);
});
