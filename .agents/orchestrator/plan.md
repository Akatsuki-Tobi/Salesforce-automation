# Execution Plan: Trailhead Module Completion (R3, R4, R5)

## Objective
Complete the Trailhead module "Quick Start: Assemble a Service Agent with Agentforce Builder" starting from R3 (Milestone 3) configuration, then R4 (Integration), and R5 (Verify).

## Constraints & Requirements
- **Python-Only**: All automation scripts, checks, and E2E tests must be written and executed in Python using `.venv` environment.
- **Pre-existing Helpers**: Reference and adapt the existing `trailhead_automation.py` in the workspace root.
- **Skip R1 & R2**: Do not recreate the agent or subagent since they already exist, but handle playground launch to get browser context/session.
- **Output Artifacts**: Save Salesforce Org session URL or status update in `.agents/` as needed.

## Milestones

### Milestone 3: Actions and Instructions Configuration (R3)
- **Task 3.1**: Check if playground is running; launch it via python script to establish browser context.
- **Task 3.2**: Open Experience Management subagent in Agentforce Studio.
- **Task 3.3**: Create custom flow actions: `Get Experience Details` and `Get Customer Details`.
- **Task 3.4**: Add asset library actions `Create Experience Session Booking` and `Get Sessions`.
- **Task 3.5**: Configure canvas and script instructions exactly as requested.
- **Task 3.6**: Save, commit version, and activate the agent.
- **Verification**: Verify subagent is activated and contains the 4 configured actions.

### Milestone 4: Flow Routing and Experience Site Integration (R4)
- **Task 4.1**: Update the `Route to ESA` flow to route to `Agentforce Service Agent` -> `CC Service Agent`, then activate.
- **Task 4.2**: Publish `ESA Web Deployment`.
- **Task 4.3**: Open Site Builder for `coral-cloud` site, drag the `Embedded Messaging` component, and publish.
- **Verification**: Confirm flow is active, web deployment is published, and site is published.

### Milestone 5: Trailhead Challenge Verification (R5)
- **Task 5.1**: Navigate to the Trailhead challenge page and click the check challenge button.
- **Task 5.2**: Confirm completion of the badge.
- **Verification**: Check for congratulations message or success output.
