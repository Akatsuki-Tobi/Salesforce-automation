# Original User Request

## Initial Request — 2026-06-22T20:09:50+05:30

Complete the "Quick Start: Assemble a Service Agent with Agentforce Builder" module on Salesforce Trailhead using credentials (Username: revanth@smartbridge.com, Password: Salesforce@1).

Working directory: c:\Users\MANIKANTA\OneDrive\Desktop\Salesforce
Integrity mode: development

## Requirements

### R1. Trailhead Login and Playground Launch
- Log in to Trailhead and navigate to the module page: `https://trailhead.salesforce.com/content/learn/modules/quick-start-assemble-a-service-agent-with-agentforce-builder/build-with-agentforce-builder`.
- Create or launch the required Agentforce playground.
- Retrieve the session/frontdoor URL of the launched Salesforce Org and save it.

### R2. Service Agent and Subagent Creation
- Open App Launcher -> Agentforce Studio.
- Create a new service agent:
  - Name: `CC Service Agent`
  - What do you want your agent to do: `You are a customer service representative, helping our guests make reservations, update bookings, and navigate all that Coral Cloud Resorts has to offer.`
  - Assign User: `EinsteinServiceAgent User`
- In the CC Service Agent:
  - Create a new subagent named `Experience Management` with description: `This subagent addresses customer inquiries and issues related to booking experiences at Coral Cloud Resorts, including making reservations, modifying session bookings, and answering queries about experience details.`

### R3. Actions and Instructions Setup
- Within the `Experience Management` subagent:
  - Create a custom action `Get Experience Details`:
    - Reference Action Type: Flow
    - Reference Action: `Get Experience Details`
    - Inputs: `experienceName` (Require Input to execute action)
    - Outputs: `experienceRecord` (Show in conversation)
  - Create a custom action `Get Customer Details`:
    - Reference Action Type: Flow
    - Reference Action: `Get Customer Details`
    - Inputs: `email` (Require Input to execute action), `memberNumber` (Require Input to execute action)
    - Outputs: `contact` (Show in conversation)
  - Add two actions from Asset Library: `Create Experience Session Booking` and `Get Sessions`.
  - Add the specified instructions in Canvas and Script views:
    1. `If a customer would like more information on Activities or Experiences, you should run the Get Experience Details action and then summarize the results with improved readability. Always ensure you know the customer before running this action.` (Make sure to type `@` and select the action from the Resource Picker).
    2. `If the customer is not known, you must always ask for their email address and their membership number to get their Contact record by running {!@actions.Get_Customer_Details} before running any other actions.`
    3. `If asked to get sessions for the experience use {!@actions.Get_Sessions}. Ask for the Date of the sessions if not provided. Use the Id of the Experience__c from {!@actions.Get_Experience_Details}. Do not use the experience name, this must be an ID.`
    4. In Script view, add: `If asked to book, use {!@actions.Create_Experience_Session_Booking}. The Contact__c is the contact ID from the {!@actions.Get_Customer_Details}. The Session__c is the ID of the session from the action {!@actions.Get_Sessions}. If multiple sessions are present, ask to select one of the sessions and use that Session as the ID for the Session__c. Prompt for the Number of Guests and use that for the Number_of_Guests__c.`
  - Save, Commit Version, and Activate the agent.

### R4. Flow Routing and Web Integration
- Go to Setup -> Flows -> `Route to ESA` flow.
- Update the Set Input Values:
  - Route To: `Agentforce Service Agent`
  - Agentforce Service Agent: `CC Service Agent`
- Save as new version and Activate the flow.
- Go to Setup -> Embedded Service Deployments, select `ESA Web Deployment`, click Publish.
- Go to Setup -> All Sites, open Builder next to `coral-cloud` site. Drag `Embedded Messaging` component over "Book an Experience of a Lifetime" section. Leave default settings. Click Publish.

### R5. Verify and Complete
- Navigate back to the Trailhead module page, and click the check/verify challenge button to complete the badge.

## Acceptance Criteria

### Challenge Completion
- [ ] The Trailhead challenge is completed successfully (returns success message or points awarded).
- [ ] Verify script runs without errors.
