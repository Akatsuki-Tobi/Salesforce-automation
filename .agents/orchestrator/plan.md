# Execution Plan: Trailhead Module Completion (Python-Only)

## Objective
Complete the Trailhead module "Quick Start: Assemble a Service Agent with Agentforce Builder" using credentials (Username: `revanth@smartbridge.com`, Password: `Salesforce@1`).

## Constraints & Requirements
- **Python-Only**: Node/npm is not installed. All automation scripts, checks, and E2E tests must be written and executed in Python using `.venv\Scripts\python.exe` or `.venv\Scripts\pytest`.
- **Pre-existing Helpers**: Reference and reuse logic from:
  - `C:\Users\MANIKANTA\.gemini\antigravity\scratch\trailhead_launch.py`
  - `C:\Users\MANIKANTA\.gemini\antigravity\scratch\trailhead_automation.py`
- **Output Artifacts**: Save Salesforce Org session URL to `C:\Users\MANIKANTA\.gemini\antigravity\scratch\sf_url.txt`.

## Milestones

### Milestone 1: Playground Prep & Launch (R1)
- **Task 1.1**: Run `C:\Users\MANIKANTA\.gemini\antigravity\scratch\trailhead_launch.py` to log in, launch the playground, and save the frontdoor session URL to `C:\Users\MANIKANTA\.gemini\antigravity\scratch\sf_url.txt`.
- **Verification**: Verify `C:\Users\MANIKANTA\.gemini\antigravity\scratch\sf_url.txt` contains a valid Salesforce frontdoor URL.

### Milestone 2: Agent and Subagent Creation (R2)
- **Task 2.1**: Write Python Playwright script to launch browser and navigate to the frontdoor URL from `sf_url.txt`.
- **Task 2.2**: Navigate to Agentforce Studio (App Launcher -> Agentforce Studio).
- **Task 2.3**: Create service agent `CC Service Agent` and subagent `Experience Management` with the specified descriptions.
- **Verification**: Check if the agent and subagent exist in the org.

### Milestone 3: Actions and Instructions Configuration (R3)
- **Task 3.1**: Create custom actions: `Get Experience Details` and `Get Customer Details` (referencing respective flows).
- **Task 3.2**: Add asset library actions `Create Experience Session Booking` and `Get Sessions`.
- **Task 3.3**: Configure canvas and script instructions exactly as requested.
- **Task 3.4**: Save, commit, and activate the agent.
- **Verification**: Verify actions and instructions are active.

### Milestone 4: Flow Routing and Experience Site Integration (R4)
- **Task 4.1**: Update the `Route to ESA` flow: Route To: `Agentforce Service Agent`, Service Agent: `CC Service Agent`. Save as new version and activate.
- **Task 4.2**: Publish `ESA Web Deployment`.
- **Task 4.3**: Open Experience Builder for `coral-cloud` site, drag the `Embedded Messaging` component over "Book an Experience of a Lifetime" section, and publish.
- **Verification**: Confirm flow, deployment, and site are published.

### Milestone 5: Trailhead Challenge Verification (R5)
- **Task 5.1**: Navigate back to the Trailhead challenge page and click the verify button.
- **Task 5.2**: Confirm the completion of the badge.
