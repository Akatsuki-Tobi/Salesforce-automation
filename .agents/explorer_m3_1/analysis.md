# Analysis Report: Trailhead Automation Optimization

## Executive Summary
This report details the findings and concrete implementation strategy for automating the Trailhead login process, bypassing steps 1 and 2 (since the agent and subagent are already created), running the automation script non-interactively, and determining browser compatibility (headless and remote debugging support) for Milestones 3, 4, and 5.

---

## 1. Automated Login & Playground Launch
To automate Trailhead login and launch the Salesforce Org playground without user intervention, we can adapt the logic found in the scratch script `trailhead_launch.py`.

### Flow & Playwright Selectors
1. **Navigate to Trailhead Home**: 
   `page.goto("https://trailhead.salesforce.com/", timeout=60000, wait_until="domcontentloaded")`
2. **Open Login Menu**:
   `page.click("a:has-text('Login')")`
3. **Select Login to Trailhead**:
   `page.click("a:has-text('Login to Trailhead'), button:has-text('Login to Trailhead')")`
4. **Choose Salesforce Authenticator**:
   `page.click("button:has-text('Salesforce')")`
5. **Fill Credentials on Salesforce Page**:
   - Username input: `input#username` -> fill `revanth@smartbridge.com`
   - Password input: `input#password` -> fill `Salesforce@1`
   - Click login: `input#Login`
6. **Wait for OAuth Redirects**:
   Wait for the browser to redirect back to Trailhead, ignoring transitional OAuth/Frontdoor URLs:
   ```python
   page.wait_for_url(
       lambda url: "trailhead.salesforce.com" in url 
       and "oauth" not in url 
       and "authorize" not in url 
       and "callback" not in url
       and "frontdoor" not in url,
       timeout=90000
   )
   ```
7. **Navigate to module URL**:
   `page.goto("https://trailhead.salesforce.com/content/learn/modules/quick-start-assemble-a-service-agent-with-agentforce-builder/build-with-agentforce-builder", timeout=60000, wait_until="domcontentloaded")`
8. **Handle Playground Launch / Creation**:
   - *If "Create Playground" button is visible*: Click `button:has-text('Create Playground')` followed by `button:has-text('Yes, Create Playground')`. Poll every 30 seconds (up to 10 minutes) until `button:has-text('Launch')` becomes visible.
   - *If "Launch" is visible*: Use `context.expect_page()` to capture the new tab/window when clicking it:
     ```python
     launch_btn = page.locator("button:has-text('Launch'), a:has-text('Launch')").first
     with context.expect_page() as new_page_info:
         launch_btn.click()
     sf_page = new_page_info.value
     sf_page.wait_for_load_state("load")
     ```

---

## 2. Bypassing Steps 1 & 2
Since `CC Service Agent` and `Experience Management` Subagent already exist in the playground, we can bypass `step1_create_agent` and `step2_create_subagent` and navigate straight to the subagent configuration panel.

### Navigation Logic & Selectors
1. **Open App Launcher (Waffle)**:
   - Click `button.slds-icon-waffle_container, div.slds-icon-waffle, .appLauncher button`
2. **Search Agentforce Studio**:
   - Type `"Agentforce Studio"` into `input[placeholder*='Search' i], input[type='search']`
3. **Open Agentforce Studio**:
   - Click `a:has-text('Agentforce Studio'), mark:has-text('Agentforce'), p:has-text('Agentforce Studio')`
4. **Select Existing Agent**:
   - Wait for list of agents to load.
   - Click the link matching `"CC Service Agent"`: `a:has-text('CC Service Agent'), [title='CC Service Agent'], text=CC Service Agent`
5. **Select Existing Subagent**:
   - Wait for the CC Service Agent workspace.
   - In the left Explorer panel, find and click `"Experience Management"` subagent under the Subagents section: `a:has-text('Experience Management'), [title='Experience Management'], button:has-text('Experience Management')`
   - Wait for the subagent workspace (which contains the "Actions Available For Reasoning" section) to load.

---

## 3. Non-Interactive Execution
To run the automation script end-to-end without requiring user input or blocking:

### Modifications Required
1. **Redefine the `pause()` function**:
   Change `pause()` so it does not call `input()`. Instead, log the message and apply a short sleep to allow the UI to stabilize:
   ```python
   def pause(msg=""):
       print(f"  [PAUSE BYPASSED] {msg}")
       time.sleep(2)
   ```
2. **Refactor `main()` Flow**:
   Remove the manual verification pauses between steps in the execution loop of `main()`. Instead of:
   ```python
   step1_create_agent(sf_page)
   pause("Step 1 done. Check the browser. Press ENTER to continue to Step 2...")
   step2_create_subagent(sf_page)
   ```
   Execute the bypass and steps sequentially:
   ```python
   # Bypass steps 1 and 2
   bypass_steps_1_and_2(sf_page)
   
   # Run remaining steps non-interactively
   step3_add_action_get_experience(sf_page)
   step3b_add_action_get_customer(sf_page)
   step3c_add_asset_library_actions(sf_page)
   step4_add_instructions(sf_page)
   step5_publish_and_update(sf_page, context)
   step6_verify(sf_page, context)
   ```

---

## 4. Headless Mode & Existing Browser Compatibility

### Headless Mode Support
- **Headless Mode is NOT recommended/supported directly** for Salesforce/Trailhead login.
- **Reasoning**:
  - *Cloudflare / Bot Protection*: Trailhead/Salesforce uses advanced security mechanisms that block headless browsers (which report `navigator.webdriver=true` and lack typical headed window signatures).
  - *MFA/Device Verification*: Logging in headlessly from a new user context or profile will trigger a device verification challenge (MFA) sending a passcode to the email, halting automation.
- *Workaround for headless environments (e.g. CI)*: Run headed mode inside a virtual framebuffer (like `Xvfb` on Linux) to simulate a display, combined with standard user profile directories.

### Existing Browser Support
- **Supported and Highly Recommended**: Playwright can connect to an already running Chrome browser.
- **Method**:
  1. Launch Chrome with debugging enabled:
     `chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\Users\MANIKANTA\AppData\Local\Google\Chrome\UserDataDebug"`
  2. In Python, connect Playwright:
     ```python
     with sync_playwright() as pw:
         browser = pw.chromium.connect_over_cdp("http://localhost:9222")
         context = browser.contexts[0]
         # Reuse an open page or open a new one in the existing context
         page = context.pages[0] if context.pages else context.new_page()
     ```
- **Benefits**:
  - **MFA Bypass**: Bypasses Trailhead and Salesforce login entirely if the user is already logged in on that Chrome session.
  - **No Bot Detection**: Operates inside a normal headed Chrome session with real user state/cookies.

### Standard Playwright Launch Args (for headed scratch launch)
If launching chromium directly from Python:
```python
browser = pw.chromium.launch(
    headless=False,
    slow_mo=200,
    args=["--start-maximized", "--disable-blink-features=AutomationControlled"]
)
```
- `--disable-blink-features=AutomationControlled` prevents websites from detecting the browser is automated.
- Modern `user_agent` and `viewport` configurations are mandatory to ensure pages render in desktop layout.

---

## Step-by-Step Fix Strategy

### Step 1: Create/Modify the Helper Functions
Implement the automated login, playground launch, and bypass functions in `trailhead_automation.py` or a wrapper script.

### Step 2: Update the `pause` and `main` Functions
Overwrite `pause` to avoid input prompt block and update `main` to coordinate the non-interactive flow.

See the complete proposed code changes in the accompanying handoff file.
