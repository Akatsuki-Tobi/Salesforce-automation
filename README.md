# Salesforce-proxy
## Project Overview
Salesforce-proxy is a Salesforce automation system with AI-powered browser agent. It is built using TypeScript/Node.js, Playwright, NVIDIA Nemotron-3-Ultra LLM, ChromaDB/Qdrant (vector memory), Jest, and Python (some tooling).

## Architecture
The project consists of the following components:
* [engine](https://github.com/proxystar4u/Salesforce-proxy/tree/main/engine): Core Node.js automation engine (browser observation, planning, execution, verification)
* [Salesforce-Agent](https://github.com/proxystar4u/Salesforce-proxy/tree/main/Salesforce-Agent): Salesforce-specific automation logic
* [memory](https://github.com/proxystar4u/Salesforce-proxy/tree/main/memory): Vector memory adapters (ChromaDB, Qdrant)
* [extension](https://github.com/proxystar4u/Salesforce-proxy/tree/main/extension): Browser extension (popup UI)
* [tests](https://github.com/proxystar4u/Salesforce-proxy/tree/main/tests): Unit, integration, browser, benchmark tests

## Features
* Browser automation
* AI-driven planning
* Visual verification (OCR, object detection)
* Self-healing/recovery
* Audit logging
* Health monitoring

## Prerequisites
* Node.js
* TypeScript
* Playwright
* NVIDIA Nemotron-3-Ultra LLM
* ChromaDB/Qdrant (vector memory)
* Jest
* Python (some tooling)

## Installation
* Root: `npm install`
* Engine: `npm install --prefix engine`
* Salesforce-Agent: `npm install --prefix Salesforce-Agent`

## Configuration
* .env files: `cp .env.example .env`
* API keys: `npm run setup-api-keys`

## Usage Examples
* CLI: `npm run cli`
* HTTP proxy: `npm run http-proxy`
* Direct API: `npm run api`

## Project Structure Overview
The project is organized into the following folders:
* `engine`: Core Node.js automation engine
* `Salesforce-Agent`: Salesforce-specific automation logic
* `memory`: Vector memory adapters (ChromaDB, Qdrant)
* `extension`: Browser extension (popup UI)
* `tests`: Unit, integration, browser, benchmark tests

## Testing Commands
* Unit tests: `npm run test:unit`
* Integration tests: `npm run test:integration`
* Browser tests: `npm run test:browser`
* Benchmark tests: `npm run test:benchmark`

## Building/Deployment
* Build: `npm run build`
* Deploy: `npm run deploy`

## Contributing Guidelines
* Fork the repository
* Create a new branch
* Make changes
* Submit a pull request

## License
* MIT License

## Links to Docs/Contracts
* [Documentation](https://github.com/proxystar4u/Salesforce-proxy/blob/main/docs/README.md)
* [Contracts](https://github.com/proxystar4u/Salesforce-proxy/blob/main/contracts/README.md)

## Language Switcher
* <a href="#english">English</a>
* <a href="#spanish">Spanish</a>
* <a href="#french">French</a>
* <a href="#german">German</a>
* <a href="#chinese">Chinese (Simplified)</a>
* <a href="#japanese">Japanese</a>
* <a href="#portuguese">Portuguese</a>
* <a href="#korean">Korean</a>

## English
... (rest of the README content in English)

## Spanish
... (rest of the README content in Spanish)

## French
... (rest of the README content in French)

## German
... (rest of the README content in German)

## Chinese (Simplified)
... (rest of the README content in Chinese (Simplified))

## Japanese
... (rest of the README content in Japanese)

## Portuguese
... (rest of the README content in Portuguese)

## Korean
... (rest of the README content in Korean)