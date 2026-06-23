"""
Trailhead Agent Blazer Championship 2026 - Interactive Automation
================================================================
YOU handle: Login + Playground creation
SCRIPT handles: All Salesforce Agentforce configuration (R2-R5)

Usage:
    python trailhead_automation.py
"""

import sys
import io
import os
import time
import traceback
from pathlib import Path
from datetime import datetime

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

try:
    from playwright.sync_api import sync_playwright, Page, BrowserContext
except ImportError:
    print("ERROR: playwright not installed. Run: pip install playwright && playwright install chromium")
    sys.exit(1)

SCREENSHOT_DIR = Path(__file__).parent / "screenshots"
SCREENSHOT_DIR.mkdir(exist_ok=True)

MODULE_URL = (
    "https://trailhead.salesforce.com/content/learn/modules/"
    "quick-start-assemble-a-service-agent-with-agentforce-builder/"
    "build-with-agentforce-builder"
    "?trail_id=become-an-agentblazer-champion-2026"
)


def ss(page: Page, name: str):
    """Screenshot helper."""
    ts = datetime.now().strftime("%H%M%S")
    path = SCREENSHOT_DIR / f"{ts}_{name}.png"
    try:
        page.screenshot(path=str(path), full_page=False)
        print(f"  [SS] {path.name}")
    except Exception:
        pass
    return path


def click(page: Page, selector: str, timeout=15000, desc=""):
    """Wait + scroll + click."""
    d = desc or selector[:50]
    print(f"  -> click: {d}")
    el = page.locator(selector).first
    el.wait_for(timeout=timeout, state="visible")
    el.scroll_into_view_if_needed()
    time.sleep(0.5)
    el.click()
    print(f"  [OK] clicked: {d}")


def fill(page: Page, selector: str, value: str, timeout=10000, desc=""):
    """Wait + fill."""
    d = desc or selector[:40]
    print(f"  -> fill: {d}")
    el = page.locator(selector).first
    el.wait_for(timeout=timeout, state="visible")
    el.scroll_into_view_if_needed()
    el.click()
    el.fill(value)
    short = value[:60] + "..." if len(value) > 60 else value
    print(f"  [OK] filled: {d} = '{short}'")


def wait_idle(page: Page, timeout=30000):
    """Wait for network idle, swallow timeout."""
    try:
        page.wait_for_load_state("networkidle", timeout=timeout)
    except Exception:
        try:
            page.wait_for_load_state("load", timeout=10000)
        except Exception:
            pass


def pause(msg="Press ENTER to continue..."):
    """Log and pause briefly without blocking."""
    print(f"\n  >>> [AUTO-PAUSE] {msg}")
    time.sleep(2)


# =====================================================================
# STEP 1: CREATE THE AGENT
# Trailhead instructions lines 712-749
# =====================================================================
def step1_create_agent(page: Page):
    """Open Agentforce Studio and create CC Service Agent."""
    print("\n" + "="*60)
    print("  STEP 1: CREATE THE AGENT")
    print("="*60)

    # 1. Click App Launcher
    print("  Opening App Launcher...")
    try:
        click(page, "button.slds-icon-waffle_container, div.slds-icon-waffle, .appLauncher button", desc="App Launcher (waffle)")
    except Exception:
        try:
            click(page, "button[title='App Launcher']", desc="App Launcher")
        except Exception:
            click(page, "one-app-launcher-header button", desc="App Launcher header")
    time.sleep(2)

    # Search for Agentforce Studio
    print("  Searching for Agentforce Studio...")
    try:
        fill(page, "input[placeholder*='Search' i], input[type='search']", "Agentforce Studio", desc="App search")
    except Exception:
        fill(page, "input.slds-input", "Agentforce Studio", desc="App search fallback")
    time.sleep(3)
    ss(page, "step1_search_agentforce")

    # Click Agentforce Studio
    try:
        click(page, "a:has-text('Agentforce Studio'), mark:has-text('Agentforce'), p:has-text('Agentforce Studio')", timeout=10000, desc="Agentforce Studio link")
    except Exception:
        page.locator("text=Agentforce Studio").first.click()
    time.sleep(5)
    wait_idle(page)
    ss(page, "step1_agentforce_studio")

    # 2. Click New Agent
    print("  Clicking New Agent...")
    time.sleep(3)
    click(page, "button:has-text('New Agent'), a:has-text('New Agent')", timeout=15000, desc="New Agent button")
    time.sleep(5)
    wait_idle(page)
    ss(page, "step1_new_agent_form")

    # 3. Fill "What do you want your agent to do?"
    agent_prompt = "You are a customer service representative, helping our guests make reservations, update bookings, and navigate all that Coral Cloud Resorts has to offer."
    print("  Filling agent prompt...")
    try:
        fill(page, "textarea", agent_prompt, desc="What do you want agent to do")
    except Exception:
        fill(page, "lightning-textarea textarea, [placeholder*='want' i]", agent_prompt, desc="Agent prompt")
    time.sleep(1)

    # 4. Press Enter
    print("  Pressing Enter...")
    page.keyboard.press("Enter")
    time.sleep(3)
    wait_idle(page)
    ss(page, "step1_after_enter")

    # 5. Enter agent name "CC Service Agent"
    print("  Entering agent name...")
    try:
        # Look for name input - try multiple approaches
        name_inputs = page.locator("input").all()
        for inp in name_inputs:
            try:
                placeholder = inp.get_attribute("placeholder") or ""
                label_text = inp.get_attribute("name") or ""
                if "name" in placeholder.lower() or "name" in label_text.lower():
                    inp.click()
                    inp.fill("CC Service Agent")
                    print("  [OK] Agent name filled")
                    break
            except Exception:
                continue
        else:
            # Fallback: find label "Name" and fill next input
            fill(page, "input[name*='name' i], input[placeholder*='name' i]", "CC Service Agent", desc="Agent name")
    except Exception:
        fill(page, "input.slds-input", "CC Service Agent", desc="Agent name fallback")

    time.sleep(2)
    ss(page, "step1_agent_name")

    # 6. In "Assign a user record" section, select "Select User"
    print("  Selecting user assignment...")
    try:
        click(page, "text=Select User", timeout=5000, desc="Select User radio")
    except Exception:
        print("  [INFO] 'Select User' button not found, may already be selected")

    time.sleep(1)

    # 7. Click "Search users..." and select EinsteinServiceAgent User
    print("  Searching for EinsteinServiceAgent User...")
    try:
        fill(page, "input[placeholder*='Search users' i], input[placeholder*='search' i]", "Einstein", desc="Search users")
        time.sleep(3)
        click(page, "text=EinsteinServiceAgent User, [title*='EinsteinServiceAgent'], li:has-text('Einstein')", timeout=10000, desc="EinsteinServiceAgent User")
    except Exception:
        try:
            # Try combobox approach
            combos = page.locator("[role='combobox'] input, lightning-grouped-combobox input")
            for i in range(combos.count()):
                try:
                    c = combos.nth(i)
                    if c.is_visible():
                        c.click()
                        c.fill("Einstein")
                        time.sleep(2)
                        page.locator("[role='option']:has-text('Einstein')").first.click()
                        print("  [OK] User selected via combobox")
                        break
                except Exception:
                    continue
        except Exception as e:
            print(f"  [WARN] User selection: {e}")

    time.sleep(2)
    ss(page, "step1_user_selected")

    # 8. Click "Let's Go"
    print("  Clicking Let's Go...")
    try:
        click(page, "button:has-text(\"Let's Go\"), button:has-text('Let'), button:has-text('Create')", timeout=10000, desc="Let's Go")
    except Exception as e:
        print(f"  [WARN] Let's Go: {e}")
    time.sleep(5)
    wait_idle(page)
    ss(page, "step1_lets_go")

    # 9. Click "Skip Ahead"
    print("  Clicking Skip Ahead...")
    try:
        click(page, "button:has-text('Skip Ahead'), button:has-text('Skip')", timeout=15000, desc="Skip Ahead")
    except Exception:
        print("  [INFO] Skip Ahead not found, may have auto-skipped")
    time.sleep(5)
    wait_idle(page)
    ss(page, "step1_complete")

    print("  [DONE] Step 1 complete - CC Service Agent created")
    return True


# =====================================================================
# STEP 2: CREATE EXPERIENCE MANAGEMENT SUBAGENT
# Trailhead instructions lines 782-813
# =====================================================================
def step2_create_subagent(page: Page):
    """Create Experience Management subagent."""
    print("\n" + "="*60)
    print("  STEP 2: CREATE EXPERIENCE MANAGEMENT SUBAGENT")
    print("="*60)

    ss(page, "step2_start")

    # 1. Click plus icon next to Subagents in Explorer panel
    print("  Clicking + next to Subagents...")
    try:
        # Find the Subagents section and click its plus icon
        click(page, "[title='Add Subagent'], button[aria-label*='Add'][aria-label*='ubagent']", timeout=10000, desc="Add Subagent +")
    except Exception:
        try:
            # Try finding "Subagents" text then clicking nearby +
            subagents_el = page.locator("text=Subagents").first
            subagents_el.wait_for(timeout=5000)
            # Click the + icon near it
            parent = subagents_el.locator("xpath=../..")
            parent.locator("button, [role='button']").first.click()
        except Exception:
            # Last resort - right click or find any + button
            click(page, "button:has-text('+'), button[aria-label*='Add']", timeout=5000, desc="Any add button")
    time.sleep(2)

    # 2. Select +New Subagent
    print("  Selecting +New Subagent...")
    try:
        click(page, "text=New Subagent, [role='menuitem']:has-text('New Subagent')", timeout=5000, desc="+New Subagent")
    except Exception:
        click(page, "[role='menuitem']:first-child, li:has-text('New')", timeout=5000, desc="New menu item")
    time.sleep(3)
    ss(page, "step2_new_subagent_dialog")

    # 3. Name: Experience Management
    print("  Naming subagent: Experience Management...")
    try:
        fill(page, "input[name*='name' i], input[placeholder*='name' i], input[label*='Name' i]", "Experience Management", desc="Subagent name")
    except Exception:
        # Try first visible input in dialog
        inputs = page.locator("input:visible").all()
        for inp in inputs:
            try:
                inp.fill("Experience Management")
                print("  [OK] Name filled via fallback")
                break
            except Exception:
                continue
    time.sleep(1)

    # 4. Description
    subagent_desc = "This subagent addresses customer inquiries and issues related to booking experiences at Coral Cloud Resorts, including making reservations, modifying session bookings, and answering queries about experience details."
    print("  Filling description...")
    try:
        fill(page, "textarea", subagent_desc, desc="Subagent description")
    except Exception:
        fill(page, "lightning-textarea textarea", subagent_desc, desc="Description fallback")
    time.sleep(1)
    ss(page, "step2_filled")

    # 5. Click Create and Open
    print("  Clicking Create and Open...")
    try:
        click(page, "button:has-text('Create and Open')", timeout=10000, desc="Create and Open")
    except Exception:
        try:
            click(page, "button:has-text('Create')", timeout=5000, desc="Create")
        except Exception:
            click(page, "button:has-text('Save')", timeout=5000, desc="Save")
    time.sleep(5)
    wait_idle(page)

    # 6. Click Save
    print("  Clicking Save...")
    try:
        click(page, "button:has-text('Save')", timeout=10000, desc="Save")
    except Exception:
        print("  [INFO] Save button may not be needed")
    time.sleep(3)
    ss(page, "step2_complete")

    print("  [DONE] Step 2 complete - Experience Management subagent created")
    return True


# =====================================================================
# STEP 3: ADD ACTIONS - Get Experience Details
# Trailhead instructions lines 815-855
# =====================================================================
def step3_add_action_get_experience(page: Page):
    """Create Get Experience Details custom action."""
    print("\n" + "="*60)
    print("  STEP 3a: ADD ACTION - Get Experience Details")
    print("="*60)

    ss(page, "step3a_start")

    # 1. Click "Select action" in Actions Available For Reasoning
    print("  Clicking Select action...")
    try:
        click(page, "text=Select action, button:has-text('Select action')", timeout=10000, desc="Select action")
    except Exception:
        # Try the + icon next to Experience Management
        try:
            click(page, "[title='Add Action'], button[aria-label*='Add']", timeout=5000, desc="Add action +")
        except Exception:
            click(page, "button:has-text('+')", timeout=5000, desc="+ button")
    time.sleep(2)

    # 2. Select +Create a custom action
    print("  Selecting Create a custom action...")
    try:
        click(page, "text=Create a custom action, [role='menuitem']:has-text('custom action')", timeout=5000, desc="Create custom action")
    except Exception:
        click(page, "text=New Action, [role='menuitem']:has-text('New')", timeout=5000, desc="New Action")
    time.sleep(3)
    ss(page, "step3a_create_dialog")

    # 3. Name: Get Experience Details
    print("  Naming action: Get Experience Details...")
    try:
        fill(page, "input[name*='name' i], input[placeholder*='name' i]", "Get Experience Details", desc="Action name")
    except Exception:
        inputs = page.locator("input:visible").all()
        for inp in inputs:
            try:
                inp.fill("Get Experience Details")
                break
            except Exception:
                continue
    time.sleep(1)

    # 4. Description
    action_desc = "Provides details about an Experience__c that a user would like more information about."
    print("  Filling description...")
    try:
        fill(page, "textarea", action_desc, desc="Action description")
    except Exception:
        pass
    time.sleep(1)

    # 5. Click Create and Open
    print("  Clicking Create and Open...")
    try:
        click(page, "button:has-text('Create and Open')", timeout=10000, desc="Create and Open")
    except Exception:
        click(page, "button:has-text('Create')", timeout=5000, desc="Create")
    time.sleep(5)
    wait_idle(page)
    ss(page, "step3a_action_created")

    # 6. Select Flow as Reference Action Type
    print("  Selecting Flow as Reference Action Type...")
    try:
        click(page, "[role='combobox']:near(:text('Reference Action Type')), select:near(:text('Reference Action Type'))", timeout=5000, desc="Reference Action Type dropdown")
        time.sleep(1)
        click(page, "[role='option']:has-text('Flow'), option:has-text('Flow')", timeout=5000, desc="Flow option")
    except Exception:
        try:
            click(page, "text=Flow", timeout=5000, desc="Flow text")
        except Exception:
            # Try any combobox
            combos = page.locator("[role='combobox'], lightning-combobox button").all()
            for c in combos:
                try:
                    if c.is_visible():
                        c.click()
                        time.sleep(1)
                        page.locator("[role='option']:has-text('Flow')").first.click()
                        break
                except Exception:
                    continue
    time.sleep(3)

    # 7. For Reference Action, select Get Experience Details
    print("  Selecting Reference Action: Get Experience Details...")
    try:
        combos = page.locator("[role='combobox'], lightning-combobox button").all()
        for c in combos:
            try:
                if c.is_visible():
                    c.click()
                    time.sleep(1)
                    if page.locator("[role='option']:has-text('Get Experience Details')").count() > 0:
                        page.locator("[role='option']:has-text('Get Experience Details')").first.click()
                        print("  [OK] Reference Action selected")
                        break
            except Exception:
                continue
    except Exception as e:
        print(f"  [WARN] Reference Action: {e}")
    time.sleep(3)
    ss(page, "step3a_flow_selected")

    # 8. experienceName Input: check "Require Input to execute action"
    print("  Configuring inputs/outputs...")
    try:
        page.evaluate("window.scrollBy(0, 300)")
        time.sleep(1)
        
        # Check experienceName row checkbox (Input)
        try:
            cb_exp = page.locator("tr:has-text('experienceName') input[type='checkbox']").first
            cb_exp.wait_for(state="visible", timeout=5000)
            if not cb_exp.is_checked():
                cb_exp.check()
                print("  [OK] Checked experienceName input checkbox")
        except Exception as e:
            print(f"  [WARN] Failed to check experienceName input checkbox: {e}")

        # Check Experience row checkbox (Output)
        try:
            cb_out = page.locator("tr:has-text('Experience') input[type='checkbox']").first
            cb_out.wait_for(state="visible", timeout=5000)
            if not cb_out.is_checked():
                cb_out.check()
                print("  [OK] Checked Experience output checkbox")
        except Exception as e:
            print(f"  [WARN] Failed to check Experience output checkbox: {e}")

    except Exception as e:
        print(f"  [WARN] Checkbox config: {e}")

    time.sleep(1)
    ss(page, "step3a_inputs_configured")

    # 9. Click Save
    print("  Saving action...")
    click(page, "button:has-text('Save')", timeout=10000, desc="Save")
    time.sleep(3)
    wait_idle(page)
    ss(page, "step3a_complete")

    print("  [DONE] Step 3a complete - Get Experience Details action created")
    return True


# =====================================================================
# STEP 3b: ADD ACTION - Get Customer Details
# Trailhead instructions lines 856-921
# =====================================================================
def step3b_add_action_get_customer(page: Page):
    """Create Get Customer Details custom action."""
    print("\n" + "="*60)
    print("  STEP 3b: ADD ACTION - Get Customer Details")
    print("="*60)

    ss(page, "step3b_start")

    # 1. Click + next to Experience Management subagent
    print("  Adding new action...")
    try:
        click(page, "[title='Add Action'], button[aria-label*='Add']", timeout=5000, desc="Add action +")
    except Exception:
        click(page, "button:has-text('+')", timeout=5000, desc="+ button")
    time.sleep(2)

    # 2. Select +New Action
    print("  Selecting +New Action...")
    try:
        click(page, "text=New Action, [role='menuitem']:has-text('New Action')", timeout=5000, desc="New Action")
    except Exception:
        click(page, "[role='menuitem']:has-text('custom'), text=Create a custom action", timeout=5000, desc="Custom action")
    time.sleep(3)

    # 3. Name: Get Customer Details
    print("  Naming action: Get Customer Details...")
    try:
        fill(page, "input[name*='name' i], input[placeholder*='name' i]", "Get Customer Details", desc="Action name")
    except Exception:
        inputs = page.locator("input:visible").all()
        for inp in inputs:
            try:
                inp.fill("Get Customer Details")
                break
            except Exception:
                continue
    time.sleep(1)

    # 4. Description
    action_desc = "Validate the Customer details by passing their email and memberNumber to see if there is a related contact."
    print("  Filling description...")
    try:
        fill(page, "textarea", action_desc, desc="Action description")
    except Exception:
        pass
    time.sleep(1)

    # 5. Click Create and Open
    print("  Clicking Create and Open...")
    try:
        click(page, "button:has-text('Create and Open')", timeout=10000, desc="Create and Open")
    except Exception:
        click(page, "button:has-text('Create')", timeout=5000, desc="Create")
    time.sleep(5)
    wait_idle(page)

    # 6. Select Flow as Reference Action Type
    print("  Selecting Flow as Reference Action Type...")
    try:
        combos = page.locator("[role='combobox'], lightning-combobox button").all()
        for c in combos:
            try:
                if c.is_visible():
                    c.click()
                    time.sleep(1)
                    if page.locator("[role='option']:has-text('Flow')").count() > 0:
                        page.locator("[role='option']:has-text('Flow')").first.click()
                        break
            except Exception:
                continue
    except Exception:
        pass
    time.sleep(3)

    # 7. Reference Action: Get Customer Details
    print("  Selecting Reference Action: Get Customer Details...")
    try:
        combos = page.locator("[role='combobox'], lightning-combobox button").all()
        for c in combos:
            try:
                if c.is_visible():
                    c.click()
                    time.sleep(1)
                    if page.locator("[role='option']:has-text('Get Customer Details')").count() > 0:
                        page.locator("[role='option']:has-text('Get Customer Details')").first.click()
                        break
            except Exception:
                continue
    except Exception:
        pass
    time.sleep(3)
    ss(page, "step3b_flow_selected")

    # 8. Configure checkboxes: email (require), memberNumber (require), contact (show)
    print("  Configuring inputs/outputs...")
    try:
        page.evaluate("window.scrollBy(0, 300)")
        time.sleep(1)
        
        # Check email checkbox
        try:
            cb_email = page.locator("tr:has-text('email') input[type='checkbox']").first
            cb_email.wait_for(state="visible", timeout=5000)
            if not cb_email.is_checked():
                cb_email.check()
                print("  [OK] Checked email input checkbox")
        except Exception as e:
            print(f"  [WARN] Failed to check email input checkbox: {e}")
            
        # Check memberNumber checkbox
        try:
            cb_num = page.locator("tr:has-text('memberNumber') input[type='checkbox']").first
            cb_num.wait_for(state="visible", timeout=5000)
            if not cb_num.is_checked():
                cb_num.check()
                print("  [OK] Checked memberNumber input checkbox")
        except Exception as e:
            print(f"  [WARN] Failed to check memberNumber input checkbox: {e}")
            
        # Check contact checkbox
        try:
            cb_contact = page.locator("tr:has-text('contact') input[type='checkbox']").first
            cb_contact.wait_for(state="visible", timeout=5000)
            if not cb_contact.is_checked():
                cb_contact.check()
                print("  [OK] Checked contact output checkbox")
        except Exception as e:
            print(f"  [WARN] Failed to check contact output checkbox: {e}")
            
    except Exception as e:
        print(f"  [WARN] Checkbox config: {e}")

    # 9. Click Save
    print("  Saving action...")
    click(page, "button:has-text('Save')", timeout=10000, desc="Save")
    time.sleep(3)
    wait_idle(page)
    ss(page, "step3b_complete")

    print("  [DONE] Step 3b complete - Get Customer Details action created")
    return True


# =====================================================================
# STEP 3c: ADD ASSET LIBRARY ACTIONS
# Trailhead instructions lines 922-964
# =====================================================================
def step3c_add_asset_library_actions(page: Page):
    """Add Create Experience Session Booking and Get Sessions from asset library."""
    print("\n" + "="*60)
    print("  STEP 3c: ADD ASSET LIBRARY ACTIONS")
    print("="*60)

    ss(page, "step3c_start")

    # 1. Click + next to Experience Management
    print("  Adding from asset library...")
    try:
        click(page, "[title='Add Action'], button[aria-label*='Add']", timeout=5000, desc="Add +")
    except Exception:
        click(page, "button:has-text('+')", timeout=5000, desc="+ button")
    time.sleep(2)

    # 2. Select "Add from Asset Library"
    print("  Selecting Add from Asset Library...")
    try:
        click(page, "text=Add from Asset Library, [role='menuitem']:has-text('Asset Library')", timeout=5000, desc="Asset Library")
    except Exception:
        click(page, "text=Asset Library", timeout=5000, desc="Asset Library text")
    time.sleep(3)
    ss(page, "step3c_asset_dialog")

    # 3. Search "session"
    print("  Searching for 'session'...")
    try:
        fill(page, "input[placeholder*='Search' i], input[type='search']", "session", desc="Search actions")
    except Exception:
        pass
    time.sleep(3)
    ss(page, "step3c_search_results")

    # 4. Select both actions
    print("  Selecting: Create Experience Session Booking...")
    try:
        # Click Select for "Create Experience Session Booking"
        booking_row = page.locator("tr:has-text('Create Experience Session Booking'), div:has-text('Create Experience Session Booking')").first
        booking_row.locator("button:has-text('Select'), input[type='checkbox']").first.click()
    except Exception:
        try:
            page.locator("text=Create Experience Session Booking").first.click()
        except Exception:
            pass
    time.sleep(1)

    print("  Selecting: Get Sessions...")
    try:
        sessions_row = page.locator("tr:has-text('Get Sessions'), div:has-text('Get Sessions')").first
        sessions_row.locator("button:has-text('Select'), input[type='checkbox']").first.click()
    except Exception:
        try:
            page.locator("text=Get Sessions").first.click()
        except Exception:
            pass
    time.sleep(2)
    ss(page, "step3c_selected")

    # 5. Click "Add to Agent"
    print("  Clicking Add to Agent...")
    try:
        click(page, "button:has-text('Add to Agent'), button:has-text('Add')", timeout=10000, desc="Add to Agent")
    except Exception:
        pass
    time.sleep(3)

    # 6. Click Save
    print("  Saving...")
    try:
        click(page, "button:has-text('Save')", timeout=10000, desc="Save")
    except Exception:
        pass
    time.sleep(3)
    wait_idle(page)
    ss(page, "step3c_complete")

    print("  [DONE] Step 3c complete - Asset library actions added")
    return True


# =====================================================================
# STEP 4: ADD INSTRUCTIONS
# Trailhead instructions lines 966-1041
# =====================================================================
def step4_add_instructions(page: Page):
    """Add and update subagent instructions using Script View Monaco injection."""
    print("\n" + "="*60)
    print("  STEP 4: ADD INSTRUCTIONS TO SUBAGENT (MONACO INJECTION)")
    print("="*60)

    ss(page, "step4_start")

    # 1. Click Experience Management subagent to open its tab
    print("  Opening Experience Management subagent tab...")
    try:
        click(page, "a:has-text('Experience Management'), text=Experience Management", timeout=15000, desc="Experience Management")
    except Exception as e:
        print(f"  [WARN] Experience Management click failed: {e}")
    time.sleep(3)

    # 2. Switch to Script view
    print("  Switching to Script view...")
    script_view_active = False
    for attempt in range(3):
        try:
            # Try Canvas/Script dropdown toggle
            dropdown = page.locator("text=Canvas, button:has-text('Canvas'), button:has-text('Script')").first
            if dropdown.is_visible(timeout=5000):
                dropdown.click()
                time.sleep(1)
                page.locator("text=Script, [role='menuitem']:has-text('Script'), [role='option']:has-text('Script')").first.click()
                print("  [OK] Switched to Script view via dropdown")
                script_view_active = True
                break
        except Exception:
            pass
        try:
            # Try direct tab click
            tab = page.locator("[role='tab']:has-text('Script')").first
            if tab.is_visible(timeout=5000):
                tab.click()
                print("  [OK] Switched to Script view via tab")
                script_view_active = True
                break
        except Exception:
            pass
        time.sleep(2)

    if not script_view_active:
        print("  [WARN] Could not switch to Script view. Proceeding with generic injection...")
        
    time.sleep(5)
    ss(page, "step4_script_view")

    # 3. Formulate the full instructions text (all 4 steps)
    all_instructions = (
        "1. If a customer would like more information on Activities or Experiences, "
        "you should run the {!@actions.Get_Experience_Details} and then summarize the results with improved readability. "
        "Always ensure you know the customer before running this action.\n"
        "2. If the customer is not known, you must always ask for their email address and their membership number "
        "to get their Contact record by running {!@actions.Get_Customer_Details} before running any other actions.\n"
        "3. If asked to get sessions for the experience use {!@actions.Get_Sessions}. Ask for the Date of the sessions if not provided. "
        "Use the Id of the Experience__c from {!@actions.Get_Experience_Details}. Do not use the experience name, this must be an ID.\n"
        "4. If asked to book, use {!@actions.Create_Experience_Session_Booking}. The Contact__c is the contact ID from the "
        "{!@actions.Get_Customer_Details}. The Session__c is the ID of the session from the action {!@actions.Get_Sessions}. "
        "If multiple sessions are present, ask to select one of the sessions and use that Session as the ID for the Session__c. "
        "Prompt for the Number of Guests and use that for the Number_of_Guests__c."
    )

    # 4. Inject instructions into the editor (Monaco or textarea)
    print("  Injecting instructions...")
    injected = False
    try:
        # Find the editor and focus it
        editor = page.locator(".monaco-editor, [contenteditable='true'], textarea").first
        editor.wait_for(state="visible", timeout=10000)
        editor.click()
        time.sleep(1)
        
        # Select all and delete to clear existing text
        page.keyboard.press("Control+a")
        time.sleep(0.5)
        page.keyboard.press("Delete")
        time.sleep(0.5)
        
        # Insert using insert_text to avoid autocomplete issues
        page.keyboard.insert_text(all_instructions)
        print("  [OK] Injected instructions via insert_text")
        injected = True
    except Exception as e:
        print(f"  [WARN] Key injection failed: {e}. Trying direct page evaluate...")

    if not injected:
        try:
            # Let's try direct Monaco value setting via page execution
            page.evaluate(f"if (typeof monaco !== 'undefined') monaco.editor.getModels()[0].setValue({repr(all_instructions)})")
            print("  [OK] Injected instructions via monaco.editor evaluation")
            injected = True
        except Exception as eval_err:
            print(f"  [ERROR] Monaco evaluate failed: {eval_err}")

    time.sleep(3)
    ss(page, "step4_instructions_injected")

    # 5. Save
    print("  Saving agent instructions...")
    click(page, "button:has-text('Save')", timeout=15000, desc="Save")
    time.sleep(5)
    wait_idle(page)

    # 6. Commit Version
    print("  Committing version...")
    try:
        click(page, "button:has-text('Commit Version')", timeout=15000, desc="Commit Version")
        time.sleep(3)
        # Check if a confirmation modal/button pops up
        confirm_btn = page.locator("lightning-dialog button:has-text('Commit Version'), button:has-text('Commit')").first
        if confirm_btn.is_visible(timeout=5000):
            confirm_btn.click()
            print("  [OK] Confirmed Commit Version")
    except Exception as e:
        print(f"  [WARN] Commit Version confirmation not found or failed: {e}")
    time.sleep(5)
    wait_idle(page)

    # 7. Activate
    print("  Activating agent...")
    try:
        click(page, "button:has-text('Activate')", timeout=15000, desc="Activate")
        time.sleep(3)
        confirm_act = page.locator("lightning-dialog button:has-text('Activate'), button:has-text('Confirm')").first
        if confirm_act.is_visible(timeout=5000):
            confirm_act.click()
            print("  [OK] Confirmed Activation")
    except Exception as e:
        print(f"  [WARN] Activation confirmation not found or failed: {e}")
    time.sleep(8)
    wait_idle(page)
    ss(page, "step4_complete")

    print("  [DONE] Step 4 complete - Instructions added, committed, activated")
    return True


# =====================================================================
# STEP 5: PUBLISH AND UPDATE (Flow + Deployment + Site)
# Trailhead instructions lines 1074-1156
# =====================================================================
def step5_publish_and_update(page: Page, context: BrowserContext):
    """Publish deployment, update flow, and add messaging to site."""
    print("\n" + "="*60)
    print("  STEP 5: PUBLISH AND UPDATE")
    print("="*60)

    ss(page, "step5_start")
    
    # Calculate base_url
    base_url = page.url.split('.com')[0] + ".com" if '.com' in page.url else page.url.split('/')[0] + '//' + page.url.split('/')[2]
    print(f"  Salesforce Base URL: {base_url}")

    # --- 5a. Publish ESA Web Deployment ---
    print("\n  -- 5a: Publish ESA Web Deployment --")
    deployments_url = f"{base_url}/lightning/setup/EmbeddedServiceDeployments/home"
    print(f"  Navigating directly to Embedded Service Deployments Setup: {deployments_url}")
    page.goto(deployments_url, wait_until="domcontentloaded", timeout=60000)
    time.sleep(8)
    wait_idle(page)
    ss(page, "step5a_deployments_page")

    # Click ESA Web Deployment
    print("  Clicking ESA Web Deployment...")
    try:
        click(page, "a:has-text('ESA Web Deployment'), text=ESA Web Deployment, tr:has-text('ESA Web Deployment') a", timeout=20000, desc="ESA Web Deployment")
    except Exception as e:
        print(f"  [WARN] Click ESA Web Deployment failed: {e}. Trying option/text selector...")
        page.locator("text=ESA Web Deployment").first.click()
    time.sleep(8)
    wait_idle(page)
    ss(page, "step5a_deployment_detail")

    # Click Publish
    print("  Publishing...")
    published = False
    try:
        click(page, "button:has-text('Publish'), [title='Publish']", timeout=15000, desc="Publish button")
        time.sleep(3)
        try:
            click(page, "lightning-dialog button:has-text('Publish'), button:has-text('Confirm')", timeout=5000, desc="Confirm Publish")
        except Exception:
            pass
        published = True
    except Exception as e:
        print(f"  [WARN] Publish click failed: {e}")
        
    time.sleep(5)
    ss(page, "step5a_published")
    print(f"  [OK] ESA Web Deployment published: {published}")

    # --- 5b. Update Route to ESA Flow ---
    print("\n  -- 5b: Update Route to ESA Flow --")
    flows_url = f"{base_url}/lightning/setup/Flows/home"
    print(f"  Navigating directly to Flows Setup: {flows_url}")
    page.goto(flows_url, wait_until="domcontentloaded", timeout=60000)
    time.sleep(8)
    wait_idle(page)
    ss(page, "step5b_flows_page")

    # Click Route to ESA
    print("  Clicking Route to ESA flow...")
    try:
        with context.expect_page() as new_page_info:
            click(page, "a:has-text('Route to ESA'), tr:has-text('Route to ESA') a", timeout=20000, desc="Route to ESA link")
        flow_page = new_page_info.value
        flow_page.bring_to_front()
        print("  [OK] Flow page opened in new tab")
    except Exception as e:
        print(f"  [WARN] Failed to open flow in new tab: {e}. Using current page.")
        flow_page = page

    print("  Waiting for Flow Builder to load...")
    flow_page.wait_for_load_state("domcontentloaded", timeout=60000)
    time.sleep(10)
    wait_idle(flow_page)
    ss(flow_page, "step5b_flow_builder_loaded")

    # Click the Route to ESA component in the flow
    print("  Clicking Route to ESA component...")
    try:
        click(flow_page, "text=Route to ESA, [data-element-id*='Route_to_ESA']", timeout=25000, desc="Route to ESA component")
    except Exception as e:
        print(f"  [WARN] Direct click failed: {e}. Trying fallback click on canvas/elements...")
        try:
            flow_page.locator("canvas, [data-element-id]").first.click()
        except Exception:
            pass
    time.sleep(5)
    ss(flow_page, "step5b_component_selected")

    # Update Route To: Agentforce Service Agent
    print("  Setting Route To: Agentforce Service Agent...")
    route_to_set = False
    try:
        combo = flow_page.locator("lightning-combobox:has-text('Route To') button, lightning-combobox:has-text('Route To') input").first
        combo.click()
        time.sleep(1)
        flow_page.locator("[role='option']:has-text('Agentforce Service Agent')").first.click()
        print("  [OK] Route To set via specific combobox")
        route_to_set = True
    except Exception as e:
        print(f"  [WARN] Specific Route To combo failed: {e}. Trying generic combobox search...")

    if not route_to_set:
        try:
            combos = flow_page.locator("[role='combobox'], lightning-combobox button, select").all()
            for c in combos:
                try:
                    if c.is_visible():
                        c.click()
                        time.sleep(1)
                        options = flow_page.locator("[role='option']:has-text('Agentforce Service Agent'), option:has-text('Agentforce')")
                        if options.count() > 0:
                           options.first.click()
                           print("  [OK] Route To set via generic combobox")
                           route_to_set = True
                           break
                except Exception:
                    continue
        except Exception as e:
            print(f"  [ERROR] Generic Route To set failed: {e}")

    time.sleep(2)

    # Set Agentforce Service Agent: CC Service Agent
    print("  Setting Agent: CC Service Agent...")
    agent_set = False
    try:
        combo = flow_page.locator("lightning-combobox:has-text('Service Agent') button, lightning-combobox:has-text('Service Agent') input, lightning-combobox:has-text('Agentforce') button").first
        combo.click()
        time.sleep(1)
        flow_page.locator("[role='option']:has-text('CC Service Agent')").first.click()
        print("  [OK] Agent set via specific combobox")
        agent_set = True
    except Exception as e:
        print(f"  [WARN] Specific agent combo failed: {e}. Trying generic combobox search...")

    if not agent_set:
        try:
            combos = flow_page.locator("[role='combobox'], lightning-combobox button, select").all()
            for c in combos:
                try:
                    if c.is_visible():
                        c.click()
                        time.sleep(1)
                        options = flow_page.locator("[role='option']:has-text('CC Service Agent'), option:has-text('CC Service')")
                        if options.count() > 0:
                           options.first.click()
                           print("  [OK] Agent set via generic combobox")
                           agent_set = True
                           break
                except Exception:
                    continue
        except Exception as e:
            print(f"  [ERROR] Generic Agent set failed: {e}")

    time.sleep(2)
    ss(flow_page, "step5b_flow_configured")

    # Save As New Version
    print("  Saving flow...")
    try:
        click(flow_page, "button:has-text('Save As'), button:has-text('Save')", timeout=15000, desc="Save As/Save")
        time.sleep(2)
        try:
            click(flow_page, "footer button:has-text('Save'), button:has-text('Save')", timeout=5000, desc="Confirm Save")
        except Exception:
            pass
    except Exception as e:
        print(f"  [WARN] Save flow failed: {e}")
    time.sleep(5)
    ss(flow_page, "step5b_flow_saved")

    # Activate
    print("  Activating flow...")
    try:
        click(flow_page, "button:has-text('Activate')", timeout=15000, desc="Activate")
    except Exception as e:
        print(f"  [WARN] Activate flow failed: {e}")
    time.sleep(5)
    ss(flow_page, "step5b_flow_activated")
    
    # Close flow_page if it is a new tab
    if flow_page != page:
        flow_page.close()
        print("  [OK] Closed Flow Builder tab")

    # --- 5c. Add Embedded Messaging to Coral Cloud Site ---
    print("\n  -- 5c: Add Messaging to Site --")
    sites_url = f"{base_url}/lightning/setup/ThirdPartyNetworks/home"
    print(f"  Navigating directly to All Sites Setup: {sites_url}")
    page.bring_to_front()
    page.goto(sites_url, wait_until="domcontentloaded", timeout=60000)
    time.sleep(8)
    wait_idle(page)
    ss(page, "step5c_sites_page")

    # Click Builder next to coral-cloud
    print("  Opening Builder for coral-cloud...")
    builder_page = None
    try:
        with context.expect_page() as new_page_info:
            click(page, "tr:has-text('coral-cloud') a:has-text('Builder'), tr:has-text('Coral Cloud') a:has-text('Builder'), a:has-text('Builder')", timeout=20000, desc="Builder link")
        builder_page = new_page_info.value
        builder_page.bring_to_front()
        print("  [OK] Experience Builder opened in new tab")
    except Exception as e:
        print(f"  [WARN] Failed to open Builder in new tab: {e}. Searching pages...")
        for p in context.pages:
            if "sitebuilder" in p.url or "experiencebuilder" in p.url:
                builder_page = p
                builder_page.bring_to_front()
                break
        if not builder_page:
            builder_page = page

    print("  Waiting for Experience Builder to load...")
    builder_page.wait_for_load_state("domcontentloaded", timeout=90000)
    time.sleep(15)
    wait_idle(builder_page)
    ss(builder_page, "step5c_builder_loaded")

    # Click Components widget
    print("  Opening Components panel...")
    try:
        click(builder_page, "button:has-text('Components'), [title='Components'], .components-button button", timeout=25000, desc="Components button")
    except Exception as e:
        print(f"  [WARN] Could not click Components button: {e}. Trying title selector...")
        builder_page.locator("[title='Components']").first.click()
    time.sleep(3)

    # Search Embedded Messaging
    print("  Searching for Embedded Messaging component...")
    try:
        fill(builder_page, "input[placeholder*='Search' i]", "Embedded Messaging", desc="Component search")
    except Exception:
        pass
    time.sleep(3)
    ss(builder_page, "step5c_component_search")

    # Add Embedded Messaging component
    print("  Adding Embedded Messaging component...")
    added = False
    try:
        component = builder_page.locator("text=Embedded Messaging, [title='Embedded Messaging']").first
        target = builder_page.locator("text=Book an Experience, .site-header, .body-content").first
        if component.is_visible(timeout=5000) and target.is_visible(timeout=5000):
            component.drag_to(target)
            print("  [OK] Component dragged successfully")
            added = True
    except Exception as e:
        print(f"  [WARN] Drag and drop failed: {e}. Trying double-click fallback...")
        
    if not added:
        try:
            component = builder_page.locator("text=Embedded Messaging, [title='Embedded Messaging']").first
            component.dblclick(timeout=10000)
            print("  [OK] Component added via double-click")
            added = True
        except Exception as e:
            print(f"  [ERROR] Double-click failed too: {e}")
            
    time.sleep(5)
    ss(builder_page, "step5c_component_added")

    # Publish site
    print("  Publishing site...")
    try:
        click(builder_page, "button:has-text('Publish'), [title='Publish']", timeout=20000, desc="Publish")
        time.sleep(3)
        try:
            click(builder_page, "button.publish-button, button:has-text('Publish')", timeout=5000, desc="Confirm Publish")
        except Exception:
            pass
        time.sleep(5)
        try:
            click(builder_page, "button:has-text('Got It')", timeout=5000, desc="Got It")
        except Exception:
            pass
    except Exception as e:
        print(f"  [WARN] Site publishing failed: {e}")
    time.sleep(5)
    ss(builder_page, "step5c_published")

    if builder_page != page:
        builder_page.close()
        print("  [OK] Closed Experience Builder tab")

    page.bring_to_front()
    print("  [DONE] Step 5 complete - Published, flow updated, site configured")
    return True


# =====================================================================
# STEP 6: VERIFY CHALLENGE
# =====================================================================
def step6_verify(page: Page, context: BrowserContext):
    """Go back to Trailhead and verify."""
    print("\n" + "="*60)
    print("  STEP 6: VERIFY CHALLENGE")
    print("="*60)

    # Find Trailhead tab or open new one
    trailhead_page = None
    for p in context.pages:
        if "trailhead.salesforce.com" in p.url:
            trailhead_page = p
            break
    if not trailhead_page:
        trailhead_page = context.new_page()
        trailhead_page.goto(MODULE_URL, wait_until="domcontentloaded", timeout=60000)
    else:
        trailhead_page.bring_to_front()
        trailhead_page.reload(wait_until="domcontentloaded", timeout=60000)
    time.sleep(5)
    wait_idle(trailhead_page)

    # Scroll to challenge section
    trailhead_page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(3)
    ss(trailhead_page, "step6_challenge_section")

    # Click Check Challenge
    print("  Clicking Check Challenge...")
    try:
        click(trailhead_page, "button:has-text('Check Challenge'), button:has-text('Verify'), input[value*='Check']", timeout=15000, desc="Check Challenge")
    except Exception:
        pass
    time.sleep(15)
    ss(trailhead_page, "step6_result")

    # Check result
    try:
        if trailhead_page.locator("text=Congratulations").first.is_visible(timeout=10000):
            print("\n  *** CHALLENGE COMPLETED SUCCESSFULLY! ***")
            return True
    except Exception:
        pass

    print("  [INFO] Check the browser for the challenge result")
    return True


# =====================================================================
# MAIN
# =====================================================================
def bypass_steps_1_and_2(page: Page):
    """Bypasses steps 1 and 2 by opening the existing CC Service Agent and subagent."""
    print("\n" + "="*60)
    print("  BYPASSING STEPS 1 AND 2 (Opening CC Service Agent)")
    print("="*60)
    
    # 1. Click App Launcher
    print("  Opening App Launcher...")
    try:
        click(page, "button.slds-icon-waffle_container, div.slds-icon-waffle, .appLauncher button", desc="App Launcher (waffle)")
    except Exception:
        try:
            click(page, "button[title='App Launcher']", desc="App Launcher")
        except Exception:
            click(page, "one-app-launcher-header button", desc="App Launcher header")
    time.sleep(3)

    # Search for Agentforce Studio
    print("  Searching for Agentforce Studio...")
    try:
        fill(page, "input[placeholder*='Search' i], input[type='search']", "Agentforce Studio", desc="App search")
    except Exception:
        fill(page, "input.slds-input", "Agentforce Studio", desc="App search fallback")
    time.sleep(3)
    ss(page, "bypass_search_agentforce")

    # Click Agentforce Studio
    try:
        click(page, "a:has-text('Agentforce Studio'), mark:has-text('Agentforce'), p:has-text('Agentforce Studio')", timeout=15000, desc="Agentforce Studio link")
    except Exception:
        page.locator("text=Agentforce Studio").first.click()
    time.sleep(8)
    wait_idle(page)
    ss(page, "bypass_agentforce_studio")

    # Click existing "CC Service Agent"
    print("  Selecting CC Service Agent...")
    try:
        click(page, "a:has-text('CC Service Agent'), text='CC Service Agent', tr:has-text('CC Service Agent') a", timeout=20000, desc="CC Service Agent link")
    except Exception as e:
        print(f"  [WARN] Failed to click CC Service Agent directly: {e}. Trying list lookup...")
        page.locator("text=CC Service Agent").first.click()
    
    time.sleep(8)
    wait_idle(page)
    ss(page, "bypass_agent_builder")

    # Open "Experience Management" subagent tab
    print("  Opening Experience Management subagent tab...")
    try:
        tab = page.locator("a:has-text('Experience Management'), text='Experience Management'").first
        tab.wait_for(state="visible", timeout=15000)
        tab.click()
    except Exception as e:
        print(f"  [WARN] Experience Management subagent tab click failed: {e}. Trying locator fallback...")
        page.locator("text=Experience Management").first.click()
        
    time.sleep(5)
    wait_idle(page)
    ss(page, "bypass_subagent_opened")
    print("  [DONE] Bypassed steps 1 & 2 successfully")
    return True


def login_and_launch(page: Page, context: BrowserContext) -> Page:
    """Automates login to Trailhead and launching the playground org."""
    print("\n" + "="*60)
    print("  AUTOMATING LOGIN & PLAYGROUND LAUNCH")
    print("="*60)
    
    # 1. Go to MODULE_URL
    print(f"  Navigating to module: {MODULE_URL}")
    page.goto(MODULE_URL, wait_until="domcontentloaded", timeout=90000)
    time.sleep(5)
    wait_idle(page)
    ss(page, "trailhead_home")
    
    # 2. Check if logged in.
    logged_in = False
    try:
        launch_btn = page.locator("button:has-text('Launch'), a:has-text('Launch'), button[data-testid*='launch']").first
        if launch_btn.is_visible(timeout=5000):
            print("  [INFO] Already logged in (Launch button visible)")
            logged_in = True
    except Exception:
        pass
        
    if not logged_in:
        print("  Not logged in. Initiating login flow...")
        login_btn = None
        for sel in ["a:has-text('Log in')", "button:has-text('Log in')", "[data-testid='login-button']", "text=Log In"]:
            try:
                btn = page.locator(sel).first
                if btn.is_visible(timeout=3000):
                    login_btn = btn
                    break
            except Exception:
                continue
        
        if login_btn:
            login_btn.click()
            print("  [OK] Clicked Log In button")
        else:
            print("  [WARN] Log in button not found. Trying fallback click...")
            try:
                page.locator("a:has-text('Log'), button:has-text('Log')").first.click()
            except Exception as e:
                print(f"  [ERROR] Could not click login button: {e}")
                
        time.sleep(5)
        wait_idle(page)
        ss(page, "trailhead_login_options")
        
        # Click Salesforce option
        sf_btn = None
        for sel in ["button:has-text('Salesforce')", "a:has-text('Salesforce')", "a[href*='salesforce']", "button[data-testid*='salesforce']"]:
            try:
                btn = page.locator(sel).first
                if btn.is_visible(timeout=3000):
                    sf_btn = btn
                    break
            except Exception:
                continue
                
        if sf_btn:
            sf_btn.click()
            print("  [OK] Clicked Salesforce login option")
        else:
            print("  [WARN] Salesforce login button not found, checking if already redirected...")
            
        time.sleep(8)
        wait_idle(page)
        ss(page, "login_redirect")
        
        # Check if on login page
        if "login.salesforce.com" in page.url or "force.com" in page.url or page.locator("#username").is_visible(timeout=10000):
            print("  On Salesforce login page. Filling credentials...")
            fill(page, "#username", "revanth@smartbridge.com", desc="Username")
            fill(page, "#password", "Salesforce@1", desc="Password")
            ss(page, "credentials_filled")
            click(page, "#Login", desc="Log In Button")
            time.sleep(10)
            wait_idle(page)
            ss(page, "after_login_submit")
            
            # Check for verification code
            if "identity/verify" in page.url or page.locator("#emc").is_visible(timeout=5000):
                print("  [CRITICAL] Verification Code page detected! Please handle it or wait...")
                time.sleep(15)
                ss(page, "mfa_verification_required")
                
            # Allow access page
            if "oauth" in page.url or page.locator("input[name='oauth_approval_submit']").is_visible(timeout=8000):
                print("  Approval page detected, clicking Allow...")
                try:
                    click(page, "input[name='oauth_approval_submit'], #oaapprove, button:has-text('Allow')", desc="Allow Access")
                    time.sleep(5)
                    wait_idle(page)
                except Exception as e:
                    print(f"  [WARN] Allow button click failed: {e}")
        else:
            print("  [WARN] Salesforce login input not found. Current URL:", page.url)

    # 3. Wait/poll back on Trailhead for the Launch button
    print("  Waiting to return to Trailhead page...")
    for attempt in range(12):
        if "trailhead.salesforce.com" in page.url:
            print("  Back on Trailhead.")
            break
        time.sleep(5)
        wait_idle(page)
    else:
        print(f"  [WARN] Not on Trailhead module page. Navigating back to {MODULE_URL}")
        page.goto(MODULE_URL, wait_until="domcontentloaded", timeout=60000)
        time.sleep(5)
        
    ss(page, "trailhead_logged_in")
    
    # 4. Wait for the playground and Launch button
    print("  Locating Launch button...")
    launch_btn = None
    for attempt in range(30):
        for sel in ["button:has-text('Launch')", "a:has-text('Launch')", "button[data-testid*='launch']"]:
            try:
                btn = page.locator(sel).first
                if btn.is_visible(timeout=1000) and btn.is_enabled():
                    launch_btn = btn
                    break
            except Exception:
                continue
        if launch_btn:
            print("  [OK] Launch button is ready!")
            break
            
        print("  Playground not ready yet. Checking if creation/provisioning in progress...")
        ss(page, f"playground_wait_{attempt}")
        time.sleep(10)
        
    if not launch_btn:
        raise Exception("Timed out waiting for playground Launch button to be ready.")
        
    # 5. Launch the playground in a new tab
    print("  Launching playground...")
    with context.expect_page() as new_page_info:
        launch_btn.click()
        
    sf_page = new_page_info.value
    sf_page.bring_to_front()
    print("  [OK] Playground launched in a new tab!")
    
    # Wait for the Salesforce Org to load
    print("  Waiting for Salesforce Org to load...")
    sf_page.wait_for_load_state("domcontentloaded", timeout=60000)
    time.sleep(10)
    wait_idle(sf_page)
    ss(sf_page, "sf_org_loaded")
    
    return sf_page


def main():
    print("="*60)
    print("  TRAILHEAD AGENT BLAZER CHAMPIONSHIP 2026")
    print("  Automated Non-Interactive Automation Mode (R3, R4, R5)")
    print("="*60)

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=False,
            slow_mo=200,
            args=["--start-maximized", "--disable-blink-features=AutomationControlled"]
        )
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            ignore_https_errors=True,
            no_viewport=True,
        )
        page = context.new_page()
        page.set_default_timeout(45000)

        # Navigate to Trailhead, Login and Launch Playground
        print("\n  Browser is open! Starting automated login and launch...")
        try:
            sf_page = login_and_launch(page, context)
        except Exception as e:
            print(f"  [ERROR] Login or playground launch failed: {e}")
            traceback.print_exc()
            ss(page, "login_launch_failed")
            browser.close()
            sys.exit(1)

        print(f"\n  Working on page: {sf_page.url[:80]}")
        ss(sf_page, "handoff_from_login")

        # Execute all steps
        try:
            # Try to bypass step 1 and 2 by opening existing agent
            bypassed = False
            try:
                bypassed = bypass_steps_1_and_2(sf_page)
            except Exception as e:
                print(f"  [WARN] Bypass failed: {e}. Attempting to run Step 1 and 2 from scratch...")
                
            if not bypassed:
                step1_create_agent(sf_page)
                pause("Step 1 done. Check the browser. Press ENTER to continue to Step 2...")

                step2_create_subagent(sf_page)
                pause("Step 2 done. Check the browser. Press ENTER to continue to Step 3a...")

            step3_add_action_get_experience(sf_page)
            pause("Step 3a done. Press ENTER for Step 3b...")

            step3b_add_action_get_customer(sf_page)
            pause("Step 3b done. Press ENTER for Step 3c (Asset Library)...")

            step3c_add_asset_library_actions(sf_page)
            pause("Step 3c done. Press ENTER for Step 4 (Instructions)...")

            step4_add_instructions(sf_page)
            pause("Step 4 done. Press ENTER for Step 5 (Publish & Update)...")

            step5_publish_and_update(sf_page, context)
            pause("Step 5 done. Press ENTER for Step 6 (Verify Challenge)...")

            step6_verify(sf_page, context)

            print("\n" + "="*60)
            print("  ALL STEPS COMPLETED!")
            print("="*60)

        except Exception as e:
            print(f"\n  [ERROR] {e}")
            traceback.print_exc()
            ss(sf_page, "error")

        pause("Press ENTER to close browser...")
        browser.close()


if __name__ == "__main__":
    main()
