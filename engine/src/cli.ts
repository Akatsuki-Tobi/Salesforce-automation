#!/usr/bin/env node
import readline from "readline";
import { sendDirectPrompt } from "./direct/direct-conversation.js";

const rl = readline.createInterface({
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
    const response = await sendDirectPrompt(prompt);
    console.log(`\nResponse:\n${response}\n`);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
  }

  rl.prompt();
}).on("close", () => {
  console.log("Goodbye.");
  process.exit(0);
});
