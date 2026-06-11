# Salesforce Proxy Engine

This folder contains the local Node.js engine for the Salesforce Proxy automation system.

## Setup

1. Install dependencies:

```bash
cd /workspaces/Salesforce-proxy/engine
npm install
```

2. Copy the example env file:

```bash
cp .env.example .env
```

3. Paste your NVIDIA Nemotron API key into `engine/.env`:

```env
NVIDIA_API_KEY=nvapi-prod-YOUR_REAL_KEY
NEMOTRON_MODEL=nvidia/nemotron-3-ultra-550b-a55b
```

4. Build the engine:

```bash
npm run build
```

5. Run the engine directly:

```bash
npm run start
```

## Direct Nemotron proxy

After building, you can run a simple HTTP proxy that forwards prompts directly to Nemotron:

```bash
npm run direct-server
```

Then POST JSON to:

```text
http://localhost:4000/prompt
```

Example using `curl`:

```bash
curl -X POST http://localhost:4000/prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Explain the next automation step for Salesforce Trailhead.","maxTokens":512}'
```

You can also use a direct CLI:

```bash
npm run direct-cli
```

Type a prompt and press Enter to send it directly to Nemotron.

## Notes

- The engine will load environment variables from `engine/.env`.
- Do not commit `engine/.env` to source control.
- Use `engine/launcher.sh` or `engine/launcher.bat` as a cross-platform entrypoint.
