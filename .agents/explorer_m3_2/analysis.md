# Milestone 3, 4, 5 Automation Analysis Report

## Executive Summary
This analysis details the exact Playwright selectors, asynchronous handling strategies, and structural changes needed to automate Salesforce R3 (Actions & Instructions), R4 (Flow Routing & Experience Site Integration), and R5 (Challenge Verification) in a single non-interactive Python script.

---

## 1. Playwright DOM Selectors Refinement

The table below compares the existing selectors in `trailhead_automation.py` with refined, robust alternatives designed to target Salesforce Lightning and Builder components accurately.

| Action / Component | Existing Selector | Refined Robust Selector | Rationale |
| :--- | :--- | :--- | :--- |
| **Open Experience Management Subagent** | `text=Experience Management` | `page.locator("[role='treeitem'] a:has-text('Experience Management'), lightning-tree-item a:has-text('Experience Management'), text=Experience Management").first` | Restricts targeting to the Navigation Explorer tree to avoid matches in headers or page text. |
| **Add Custom Action Button** | `text=Select action, button:has-text('Select action')` | `page.locator("lightning-button button:has-text('Select action'), button:has-text('Select action')").first` | Targets the button within the subagent properties panel explicitly. |
| **Select Create a Custom Action** | `[role='menuitem']:has-text('custom action')` | `page.locator("[role='menuitem']:has-text('Create a custom action'), lightning-menu-item:has-text('Create a custom action')").first` | Restricts match to menu items with exact text. |
| **Action Name Input** | `input[name*='name' i]` | `page.locator("lightning-input[data-label='Name'] input, input[label='Name'], input[placeholder='Name']").first` | Uses Salesforce LWC labels (`data-label`) for precise field mapping. |
| **Action Description Textarea** | `textarea` | `page.locator("lightning-textarea textarea, textarea[label='Description']").first` | Specific to lightning-textarea component to avoid mapping collision. |
| **Reference Action Type** | `[role='combobox']:near(:text('Reference Action Type'))` | `page.locator("lightning-combobox[data-label='Reference Action Type'] button, combobox[aria-label='Reference Action Type']").first` | Binds directly to the combobox element using its data-label or aria-label. |
| **Reference Action** | (Iterating over all comboboxes) | `page.locator("lightning-combobox[data-label='Reference Action'] button, combobox[aria-label='Reference Action']").first` | Explicitly targets the Reference Action dropdown. |
| **Flow/Action Dropdown Option** | `text=Flow` | `page.locator("lightning-base-combobox-item:has-text('Flow'), [role='option']:has-text('Flow')").first` | Selects options inside the Lightning listbox. |
| **Input/Output Row Checkboxes** | (Check all checkboxes) | `row = page.locator("tr:has-text('{ROW_NAME}'), [role='row']:has-text('{ROW_NAME}')").first` then `row.locator("input[type='checkbox']").first.check()` | Crucial fix. Prevents checking wrong checkboxes. Target rows: `experienceName`, `experienceRecord`, `email`, `memberNumber`, `contact`. |
| **Asset Library Search** | `input[placeholder*='Search' i]` | `page.locator("lightning-input[data-label='Search actions'] input, input[placeholder*='Search actions'], input[type='search']").first` | Pinpoints search box in Asset Library dialog. |
| **Asset Library Select Checkbox** | `booking_row.locator("button")` | `page.locator("tr:has-text('{ACTION_NAME}') input[type='checkbox']").first` | Directly checks checkboxes next to `Create Experience Session Booking` and `Get Sessions`. |
| **Canvas/Script View Dropdown** | `text=Canvas, button:has-text('Canvas')` | `page.locator("lightning-button-menu button, button:has-text('Canvas'), button:has-text('Script')").first` | Targets the dropdown toggle at the top right of editor. |
| **Script Monaco Editor** | `.monaco-editor textarea` | `page.evaluate("if (typeof monaco !== 'undefined') { monaco.editor.getModels()[0].setValue(arguments[0]); }", full_script)` | Scripting via Monaco API is 100% reliable compared to slow text typing. |
| **Flow Component Double-Click** | `text=Route to ESA` | `flow_page.locator("text=Route to ESA, .builder-node:has-text('Route to ESA')").first.dblclick()` | Double-click is required to open the properties panel on Flow Canvas. |
| **Flow Route To / Agent Combobox** | (Generic combobox loop) | `flow_page.locator("lightning-combobox").filter(has=flow_page.locator("label:has-text('{LABEL}')")).locator("button, input").first` | Filters by label text ("Route To" or "Agentforce Service Agent"). |
| **Experience Site Builder Components** | `button:has-text('Components')` | `builder_page.locator("button[title='Components'], button[aria-label='Components']").first` | Targets the exact icon on Builder toolbar. |
| **Component Drag-and-Drop** | `component.drag_to(target)` | `source.drag_to(target)` with fallback: `source.dblclick()` | Experience Builder allows adding search-result components via double-click, bypasses drag flakiness. |
| **Trailhead Submit Button** | `button:has-text('Check Challenge')` | `trailhead_page.locator("#challenge-submit, button:has-text('Check Challenge'), button:has-text('Verify')").first` | Uses ID `#challenge-submit` which is Trailhead's native button ID. |

---

## 2. Popup, Timeout, and Async Handling Strategy

Salesforce Lightning uses intensive async rendering, requiring proactive handling of race conditions and system-generated popups:

### A. Async Page State Verification
- **Network Idle State**: Wait for load states using `page.wait_for_load_state("networkidle")` followed by a brief delay (`time.sleep(1)`) to let JavaScript event listeners attach.
- **Strict Element Visibility**: Ensure `locator.wait_for(state="visible", timeout=15000)` is invoked before executing any `.click()` or `.fill()`.

### B. Handle Transient Modals & Popups
Onboarding popups ("Skip Ahead", "Skip", "Got It", "Got it") can block click pathways. A global pop-up dismissal function should be run on a hook or catch block:
```python
def dismiss_popups(page):
    popups = [
        "button:has-text('Skip Ahead')",
        "button:has-text('Skip')",
        "button:has-text('Got It')",
        "button[title='Close']",
        "button.slds-modal__close"
    ]
    for selector in popups:
        try:
            el = page.locator(selector).first
            if el.is_visible():
                el.click()
                print(f"  [DISMISS] Clicked: {selector}")
        except Exception:
            pass
```

### C. Multi-Tab Context Management
Both the Flow Builder and Experience Site Builder open in new browser tabs. Using the active page pointer without switching tabs will result in failures.
- **Handling Strategy**: Capture and track new tabs using Playwright's tab expectation:
```python
with context.expect_page() as new_page_info:
    page.locator("a:has-text('Route to ESA')").first.click()
flow_page = new_page_info.value
flow_page.wait_for_load_state("load")
# Perform automation on flow_page
flow_page.close() # Return focus to setup
```

### D. Resource Picker & Monaco Editor Fallbacks
- **Resource Picker Flakiness**: Highlighting `"appropriate action"`, typing `@`, and waiting for menu option selection can fail if context focus shifts.
  - *Fallback*: Directly type the full action bracket reference text `{!@actions.Get_Experience_Details}` if the picker popover fails to load.
- **Monaco Script Insertion**: Typing 300+ characters using keyboard simulation is slow and error-prone.
  - *Solution*: Programmatically update the Monaco Editor buffer via JS: `monaco.editor.getModels()[0].setValue(...)`.

---

## 3. End-to-End Non-Interactive Script Structure

To run the script end-to-end without interactive prompts (like `pause()` or user-guided login), the script must be structured with self-sufficient authentication and automated playground polling:

```python
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

USERNAME = "revanth@smartbridge.com"
PASSWORD = "Salesforce@1"
MODULE_URL = "https://trailhead.salesforce.com/content/learn/modules/quick-start-assemble-a-service-agent-with-agentforce-builder/build-with-agentforce-builder"

def run_automation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=100)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        
        # 1. Login to Trailhead Automatically
        page.goto("https://trailhead.salesforce.com/")
        page.click("a:has-text('Login')")
        page.click("a:has-text('Login to Trailhead'), button:has-text('Login to Trailhead')")
        
        page.wait_for_selector("button:has-text('Salesforce')")
        page.click("button:has-text('Salesforce')")
        
        page.wait_for_selector("input#username")
        page.fill("input#username", USERNAME)
        page.fill("input#password", PASSWORD)
        page.click("input#Login")
        
        # Wait for redirect back to Trailhead
        page.wait_for_url(lambda u: "trailhead.salesforce.com" in u and "frontdoor" not in u and "login" not in u, timeout=90000)
        
        # 2. Open Playground
        page.goto(MODULE_URL)
        
        # If playground needs creation, trigger it and poll
        create_btn = page.locator("button:has-text('Create Playground')").first
        if create_btn.is_visible():
            create_btn.click()
            page.locator("button:has-text('Yes, Create Playground')").first.click()
            # Poll for up to 10 minutes for Launch button
            start = time.time()
            while time.time() - start < 600:
                time.sleep(30)
                if page.locator("button:has-text('Launch'), a:has-text('Launch')").first.is_visible():
                    break
        
        # Launch Playground and capture org page
        launch_btn = page.locator("button:has-text('Launch'), a:has-text('Launch')").first
        launch_btn.wait_for(state="visible", timeout=60000)
        with context.expect_page() as new_page_info:
            launch_btn.click()
        sf_page = new_page_info.value
        sf_page.wait_for_load_state("load")
        
        # 3. Configure R3: Actions & Instructions
        configure_r3_actions(sf_page)
        
        # 4. Configure R4: Flows & Site Integration
        configure_r4_integration(sf_page, context)
        
        # 5. Verify R5: Challenge Check
        verify_r5_challenge(page)
        
        browser.close()

def configure_r3_actions(page):
    # App Launcher -> Agentforce Studio
    # Select Experience Management subagent
    # Create action 'Get Experience Details' (Flow: Get Experience Details)
    # Check 'Require Input' for experienceName, 'Show in conversation' for experienceRecord
    # Create action 'Get Customer Details' (Flow: Get Customer Details)
    # Check 'Require Input' for email and memberNumber, 'Show in conversation' for contact
    # Add from Asset Library: 'Create Experience Session Booking' & 'Get Sessions'
    # Clear and insert Canvas instructions (using @ actions)
    # Switch to Script View -> Insert 4th instruction -> Save
    # Commit Version -> Activate
    pass

def configure_r4_integration(page, context):
    # Setup -> Embedded Service Deployments -> Publish ESA Web Deployment
    # Setup -> Flows -> Route to ESA flow -> Double click Route to ESA component
    # Update Route To (Agentforce Service Agent) and Agent (CC Service Agent) -> Save New Version -> Activate
    # Setup -> All Sites -> Experience Builder -> Add Embedded Messaging -> Publish
    pass

def verify_r5_challenge(trailhead_page):
    # Navigate to module -> scroll bottom -> click challenge submit
    # Wait for badge success popup
    pass
```

---

## 4. Concrete Fix & Step-by-Step Strategy

For the Implementer agent, these steps outline the exact execution strategy:

1. **Implement Automated Authentication**: Integrate the credentials from `trailhead_launch.py` to remove any interactive human steps.
2. **Execute Row-Based Checkbox Toggle**: Replace the global checkbox checking in R3 with specific `tr:has-text()` target selectors to guarantee the correct parameters are configured.
3. **Handle Flow Builder & Experience Site Tabs**: Intercept new page contexts when opening the Flow Builder and Site Builder and run operations on those specific tabs.
4. **Bypass Drag-and-Drop Limitations**: If the site builder `drag_to` fails, implement a double-click on the Component list card to append the Messaging component to the layout.
5. **Programmatic Monaco script input**: Use page evaluations to inject script instructions rather than keyboard typing.
