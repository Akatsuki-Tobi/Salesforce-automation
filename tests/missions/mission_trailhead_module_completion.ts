import { Test } from '../../types'
import { setupBrowser } from '../../browser'
import { loginToTrailhead } from '../../salesforce'

describe('Trailhead Module Completion', () => {
  let browser
  let page

  beforeEach(async () => {
    browser = await setupBrowser()
    page = await browser.newPage()
  })

  afterEach(async () => {
    await page.close()
  })

  test('should complete Quick Start module', async () => {
    // 1. Login to Trailhead
    await loginToTrailhead(page, 'revanth@smartbridge.com', 'Salesforce@1')

    // 2. Navigate to module
    await page.goto('https://trailhead.salesforce.com/content/learn/modules/quick-start-assemble-a-service-agent-with-agentforce-builder/build-with-agentforce-builder')

    // 3. Create playground
    await page.click('.create-playground-button')
    await page.fill('#playground-name', 'Salesforce-Proxy-Playground')
    await page.select('#playground-type', 'Developer')
    await page.click('.create-playground-confirmation')

    // 4. Configure service agent
    await page.waitForSelector('.service-agent-configuration')
    await page.fill('#agent-name', 'Salesforce Proxy Agent')
    await page.select('#agent-language', 'en')
    await page.click('.deploy-agent')

    // 5. Complete module tasks
    await page.click('.build-with-agentforce-builder')
    await page.waitForSelector('.module-completed-badge')

    // 6. Verify completion
    const completionBadge = await page.$('.module-completed-badge')
    const isCompleted = await completionBadge?.isVisible()

    expect(isCompleted).toBe(true)
  }, 30000)
})
