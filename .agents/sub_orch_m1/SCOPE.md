# Scope: Milestone 1 - Playground Launch & Frontdoor URL Retrieval

## Architecture
- **Automation Module**: Python-based browser automation (using Playwright in `.venv`) to login to Trailhead, open the target module, launch/create the Agentforce playground, and extract the session/frontdoor URL.
- **Interfaces**:
  - Trailhead Login UI: login with credentials `revanth@smartbridge.com` / `Salesforce@1`.
  - Trailhead Module Challenge Panel: launch playground.
  - Salesforce Org: extract active session/frontdoor URL.
- **Data Flow**: Credentials -> Trailhead Login -> Navigate to Module -> Launch/Create Playground -> Extract Session URL -> Write to `c:\Users\MANIKANTA\OneDrive\Desktop\Salesforce\frontdoor_url.txt`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1.1 | Python Script Setup | Prepare a python script using `.venv\Scripts\python.exe` based on the scratch `C:\Users\MANIKANTA\.gemini\antigravity\scratch\trailhead_launch.py`. | None | PLANNED |
| 1.2 | Execute & Extract URL | Run the python script to log in, launch the playground, and output the session URL. | 1.1 | PLANNED |
| 1.3 | Verify Output File | Verify that the frontdoor URL is successfully written to `c:\Users\MANIKANTA\OneDrive\Desktop\Salesforce\frontdoor_url.txt` and is non-empty. | 1.2 | PLANNED |

## Interface Contracts
- **Input**: Trailhead Credentials (`revanth@smartbridge.com` / `Salesforce@1`) and Module URL (`https://trailhead.salesforce.com/content/learn/modules/quick-start-assemble-a-service-agent-with-agentforce-builder/build-with-agentforce-builder`).
- **Output**: Frontdoor URL written as a single line string to `c:\Users\MANIKANTA\OneDrive\Desktop\Salesforce\frontdoor_url.txt`.
