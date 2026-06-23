# Project: Quick Start: Assemble a Service Agent with Agentforce Builder

## Architecture
- **Automation Engine**: Browser automation via Playwright in Python only (no Node/npm).
- **Data Flow**: Log in to Trailhead -> Open Salesforce Org -> Configure Agentforce -> Configure Flows -> Integrate with Experience Site -> Verify Challenge.
- **Interfaces**:
  - Trailhead Login Interface
  - Agentforce Studio Builder Interface
  - Salesforce Flow Builder Interface
  - Experience Site Builder Interface

## Code Layout
- `tests/missions/`: Mission script templates and automation scripts.
- `.venv/`: Python virtual environment with Playwright and dependencies.
- `c:\Users\MANIKANTA\OneDrive\Desktop\Salesforce\`: Project root directory.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1 | Playground Prep (R1) | Log in to Trailhead, launch Agentforce playground, retrieve frontdoor URL | None | IN_PROGRESS (Conv ID: fa6f9b69-c72c-4f62-8c8c-81b51f25d07c) |
| 2 | Agent Creation (R2) | Create CC Service Agent and Experience Management subagent | 1 | PLANNED |
| 3 | Actions & Instructions (R3) | Add custom actions, asset actions, and setup canvas/script instructions; activate agent | 2 | PLANNED |
| 4 | Integration (R4) | Route to ESA Flow update, ESA Web Deployment publish, Site Builder messaging component | 3 | PLANNED |
| 5 | Verify & Complete (R5) | Navigate to Trailhead, verify challenge, complete badge | 4 | PLANNED |

## Interface Contracts
### Automation Script ↔ Salesforce Org
- Interacts via browser DOM elements and selectors.
- Frontdoor URL is the entry point for Salesforce Org configuration.
