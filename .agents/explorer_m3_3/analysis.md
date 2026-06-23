# Analysis Report: Milestones 3, 4, 5 Automation & Verification

## Executive Summary
This report analyzes the Salesforce Agentforce workspace and details the design and implementation strategy for automating and verifying **Milestone 3 (Actions & Instructions - R3)**, **Milestone 4 (Integration - R4)**, and **Milestone 5 (Verify & Complete - R5)**. 

Our investigation of `trailhead_automation.py` and `trailhead_launch.py` revealed several critical gaps in the current implementation, including:
1. **Multi-Tab Handling Failures**: The script fails to track and switch to new browser tabs opened when clicking on Flows in Setup or clicking "Builder" in All Sites.
2. **Indiscriminate Input Selection**: Checkbox selectors check all checkboxes in Action parameters blindly instead of targeting specific rows like `experienceName`, `email`, or `memberNumber`.
3. **Typing and Editor Sync Fragility**: Typing into rich text/code editors using character-by-character keyboard input triggers auto-completions and auto-braces, leading to corrupted instruction syntax.
4. **Inefficient Navigation**: Navigating via UI clicks and Setup Quick Find introduces unnecessary latency and UI flake.

---

## 1. Pre-Verification Strategy (R3, R4, R5)
Before running the final Trailhead verification, we can run programmatic pre-checks to confirm the configuration in the Salesforce Org.

### R3: Actions & Instructions Pre-Verification
To verify R3 programmatically via the browser DOM before proceeding to R4/R5:
1. **Agent State Verification**: Open Agentforce Studio, locate `CC Service Agent` in the list, and verify its status badge text is `"Active"`.
2. **Subagent Verification**: Open `CC Service Agent`, inspect the Explorer panel on the left, and check that `Experience Management` is present under Subagents.
3. **Action List Verification**: Click on `Experience Management`, expand it, and verify that the 4 actions are present:
   - `Get Experience Details`
   - `Get Customer Details`
   - `Create Experience Session Booking`
   - `Get Sessions`
4. **Instructions Text Verification**: Click `Experience Management` subagent, verify the instructions field value contains the string references:
   - `{!@actions.Get_Experience_Details}`
   - `{!@actions.Get_Customer_Details}`
   - `{!@actions.Get_Sessions}`
   - `{!@actions.Create_Experience_Session_Booking}`

### R4: Integration Pre-Verification
1. **Flow Status Check**: Navigate directly to `{base_url}/lightning/setup/Flows/home` and verify that the "Route to ESA" flow is in the list with `Active Version` marked as active.
2. **Experience Site Integration Test (End-to-End)**: 
   - Navigate directly to the public Experience Cloud site home page: `{site_url}/s/` (or retrieve the URL from Setup).
   - Verify that the chat trigger button is visible: `.embeddedServiceHelpButton` or `.embedded-messaging-trigger`.
   - Click the button, wait for the chat pane to open, and send the first prompt: `"Can you let me know about the Underground Cave Exploration?"`.
   - Verify that the agent replies asking for verification details (email/member number), confirming the connection between the site, flow, and the active `CC Service Agent`.

### R5: Verify & Complete Pre-Verification
- Navigate to the Trailhead module page, scroll to the bottom, and assert that the "Check Challenge" button is visible and active.

---

## 2. Robust Exception Handling, Logging & Resume Recovery
To handle failures gracefully, the automation engine should support resuming from the last successful step instead of restarting the entire process.

### Storage State (Session Reuse)
Playwright allows saving the authentication context (cookies, localStorage) to a file:
```python
# Save authentication state after successful Salesforce login
context.storage_state(path="state.json")
```
When running the script or resuming:
```python
# Reuse session to skip login steps
if os.path.exists("state.json"):
    context = browser.new_context(storage_state="state.json", ...)
```

### Command Line Arguments for Step Checkpoints
We introduce a `--step` and `--resume` command line interface:
- `python trailhead_automation.py --step 3a`: Starts directly at Step 3a, assuming the browser session in `state.json` is active.
- `python trailhead_automation.py --resume`: Reads the last successful checkpoint from a local `checkpoint.txt` file and resumes from there.

### Logging and Screenshot Capturing
- **Logging**: Use standard Python `logging` to write output to both the console and a file (`automation.log`).
- **Screenshot Capturing**: Implement a try-except wrapper that automatically captures a screenshot on failure, saving it with step name and timestamp:
```python
def capture_exception_ss(page: Page, step_name: str):
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    path = f"screenshots/FAIL_{step_name}_{ts}.png"
    page.screenshot(path=path, full_page=True)
    logging.error(f"Step {step_name} failed. Screenshot saved to {path}")
```

---

## 3. Recommended Python Environment, Dependencies & Command Lines

### Execution Environment
- **Python Version**: Python 3.10+
- **Virtual Environment**: `.venv` in the project root.

### Dependencies (`requirements.txt`)
```text
playwright>=1.40.0
pytest>=7.4.0
beautifulsoup4>=4.12.0
```

### Installation & Run Commands
```powershell
# 1. Activate Virtual Environment
.venv\Scripts\Activate.ps1

# 2. Install dependencies & browser binaries
pip install -r requirements.txt
playwright install chromium

# 3. Run full automation (Interactive or Automated)
python trailhead_automation.py

# 4. Resume from Step 4 (Instructions)
python trailhead_automation.py --step 4

# 5. Run Verification tests
pytest tests/test_verification.py
```

---

## 4. Concrete Step-by-Step Fix Strategy & Playwright Selectors

### Direct Navigation URLs
To avoid fragile Quick Find interactions in Setup:
- **Flows page**: `{base_url}/lightning/setup/Flows/home`
- **Embedded Deployments page**: `{base_url}/lightning/setup/EmbeddedServiceDeployments/home`
- **All Sites page**: `{base_url}/lightning/setup/ThirdPartyNetworks/home`

---

### Step-by-Step Selectors & Logic

#### Step 3a: Custom Action `Get Experience Details`
1. Navigate to Agentforce Studio and open `Experience Management` subagent.
2. Click **Select Action** -> **+Create a custom action**.
3. Name the Action: `Get Experience Details`.
4. Choose **Flow** as Reference Action Type, and **Get Experience Details** as Reference Action.
5. **Targeted Parameter Checkbox Selection**:
   - Locate the row for `experienceName` under Inputs:
     ```python
     row = page.locator("tr:has-text('experienceName'), .slds-hint-parent:has-text('experienceName')").first
     # Check the "Require Input to execute action" checkbox inside this row
     row.locator("input[type='checkbox']").first.check()
     ```
   - Locate the row for `experienceRecord` under Outputs:
     ```python
     row = page.locator("tr:has-text('experienceRecord'), .slds-hint-parent:has-text('experienceRecord')").first
     # Check the "Show in conversation" checkbox inside this row
     row.locator("input[type='checkbox']").first.check()
     ```
6. Click Save.

#### Step 3b: Custom Action `Get Customer Details`
1. Add custom action, Name: `Get Customer Details`.
2. Reference Action Type: **Flow**, Reference Action: **Get Customer Details**.
3. **Targeted Parameter Checkbox Selection**:
   - For input `email`:
     ```python
     row = page.locator("tr:has-text('email'), .slds-hint-parent:has-text('email')").first
     row.locator("input[type='checkbox']").first.check() # Require Input
     ```
   - For input `memberNumber`:
     ```python
     row = page.locator("tr:has-text('memberNumber'), .slds-hint-parent:has-text('memberNumber')").first
     row.locator("input[type='checkbox']").first.check() # Require Input
     ```
   - For output `contact`:
     ```python
     row = page.locator("tr:has-text('contact'), .slds-hint-parent:has-text('contact')").first
     row.locator("input[type='checkbox']").first.check() # Show in conversation
     ```
4. Click Save.

#### Step 3c: Add Asset Library Actions
1. Click Add Action (+) next to Subagent -> **Add from Asset Library**.
2. Search: `"session"`.
3. Check checkboxes for both:
   ```python
   page.locator("tr:has-text('Create Experience Session Booking') input[type='checkbox']").first.check()
   page.locator("tr:has-text('Get Sessions') input[type='checkbox']").first.check()
   ```
4. Click **Add to Agent**, then click **Save**.

#### Step 4: Subagent Instructions (Robust Monaco Editor Manipulation)
Instead of trying to type `@` and click through fragile Resource Pickers in Canvas view, switch to **Script view** and paste the entire block. This bypasses keyboard auto-completions.
1. Click **Canvas** dropdown and select **Script**.
2. Focus the editor container: `page.locator(".monaco-editor, textarea").first.click()`
3. Select all: `page.keyboard.press("Control+A")`, then `page.keyboard.press("Delete")`
4. Paste instructions directly using `insert_text` to avoid triggering auto-bracket closures:
   ```python
   instructions = (
       "1.If a customer would like more information on Activities or Experiences, you should run {!@actions.Get_Experience_Details} and then summarize the results with improved readability. Always ensure you know the customer before running this action.\n"
       "2.If the customer is not known, you must always ask for their email address and their membership number to get their Contact record by running {!@actions.Get_Customer_Details} before running any other actions.\n"
       "3.If asked to get sessions for the experience use {!@actions.Get_Sessions}. Ask for the Date of the sessions if not provided. Use the Id of the Experience__c from {!@actions.Get_Experience_Details}. Do not use the experience name, this must be an ID.\n"
       "4.If asked to book, use {!@actions.Create_Experience_Session_Booking}. The Contact__c is the contact ID from the {!@actions.Get_Customer_Details}. The Session__c is the ID of the session from the action {!@actions.Get_Sessions}. If multiple sessions are present, ask to select one of the sessions and use that Session as the ID for the Session__c. Prompt for the Number of Guests and use that for the Number_of_Guests__c."
   )
   page.keyboard.insert_text(instructions)
   ```
5. Click **Save**.
6. Click **Commit Version**, confirm the commit, then click **Activate** and confirm activation.

#### Step 5a: Publish ESA Web Deployment
1. Navigate directly to `{base_url}/lightning/setup/EmbeddedServiceDeployments/home`.
2. Click `ESA Web Deployment` link.
3. Click `Publish` and confirm the dialog.

#### Step 5b: Route to ESA Flow Update (Multi-Tab Handling)
1. Navigate directly to `{base_url}/lightning/setup/Flows/home`.
2. **Open Flow Builder in a new tab**:
   ```python
   with context.expect_page() as new_page_info:
       page.locator("a:has-text('Route to ESA')").first.click()
   flow_page = new_page_info.value
   flow_page.wait_for_load_state("load")
   ```
3. On `flow_page`, click the canvas element `text=Route to ESA`.
4. In the configuration panel:
   - Click "Route To" combobox: `flow_page.locator("lightning-combobox:has-text('Route To') button").click()`
   - Select option: `flow_page.locator("lightning-base-combobox-item:has-text('Agentforce Service Agent')").click()`
   - Click "Agent" combobox: `flow_page.locator("lightning-combobox:has-text('Agent') button, lightning-combobox:has-text('Agentforce Service Agent') button").nth(1).click()`
   - Select option: `flow_page.locator("lightning-base-combobox-item:has-text('CC Service Agent')").click()`
5. Click **Save As New Version** -> **Save**.
6. Click **Activate**, then close the tab.

#### Step 5c: Add Embedded Messaging to Coral Cloud Site (Multi-Tab Handling)
1. Navigate directly to `{base_url}/lightning/setup/ThirdPartyNetworks/home`.
2. **Open Experience Builder in a new tab**:
   ```python
   with context.expect_page() as new_page_info:
       page.locator("tr:has-text('coral-cloud') a:has-text('Builder')").click()
   builder_page = new_page_info.value
   builder_page.wait_for_load_state("load")
   ```
3. Click Components widget: `builder_page.locator("button[title='Components'], .components-button").click()`
4. Search `"Embedded Messaging"`: `builder_page.locator("input[placeholder='Search components...']").fill("Embedded Messaging")`
5. Drag component or double-click to add: `builder_page.locator(".component-item:has-text('Embedded Messaging')").dblclick()`
6. Click **Publish** (top right) and confirm.
7. Click **Got It** in the success dialog, then close the tab.

#### Step 6: Verify Challenge on Trailhead
1. Navigate back to the Trailhead tab or open `{MODULE_URL}`.
2. Scroll to bottom: `page.evaluate("window.scrollTo(0, document.body.scrollHeight)")`
3. Click **Check Challenge**: `page.locator("button:has-text('Check Challenge'), button:has-text('Verify')").click()`
4. Wait for completion modal showing `"Congratulations"` or success status.
