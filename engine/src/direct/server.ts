import express from "express";
import { sendDirectPrompt } from "./direct-conversation.js";

const app = express();
const port = process.env.DIRECT_PROXY_PORT ? Number(process.env.DIRECT_PROXY_PORT) : 4000;

app.use(express.json());

app.post("/prompt", async (req, res) => {
  const { prompt, maxTokens } = req.body;
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "prompt is required" });
  }

  try {
    const response = await sendDirectPrompt(prompt, typeof maxTokens === "number" ? maxTokens : 1024);
    res.json({ prompt, response });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", model: process.env.NEMOTRON_MODEL ?? null });
});

app.listen(port, () => {
  console.log(`Direct Nemotron proxy listening on http://localhost:${port}`);
});
