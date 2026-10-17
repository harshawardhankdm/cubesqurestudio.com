import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const url = process.env.URL || 'http://localhost:3000'
const widths = [390, 768, 1440]
const browser = await chromium.launch()

let totalFailures = 0

for (const w of widths) {
  console.log(`\n========================================`)
  console.log(`AUDIT FOR VIEWPORT: ${w}px`)
  console.log(`========================================`)

  const context = await browser.newContext({
    viewport: { width: w, height: 900 },
  })
  const page = await context.newPage()

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  // Scroll to sections and test stops
  const sectionIds = ['#main-content', '#services', '#work', '#process', '#contact']
  
  for (const sec of sectionIds) {
    console.log(`\n--- Inspecting section: ${sec} at ${w}px ---`)
    
    // Scroll element into view
    const exists = await page.$(sec)
    if (!exists) continue
    
    await page.evaluate((selector) => {
      const el = document.querySelector(selector)
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
    }, sec)
    
    // Wait 1.5s as required by Part 4
    await page.waitForTimeout(1500)

    // 1. Axe color-contrast check
    try {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze()

      const contrastViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === 'color-contrast'
      )

      if (contrastViolations.length > 0) {
        console.log(`  [AXE COLOR CONTRAST] Found ${contrastViolations.length} violation(s):`)
        contrastViolations.forEach((v) => {
          v.nodes.forEach((n) => {
            console.log(`    - Target: ${n.target.join(' ')}: ${n.failureSummary}`)
            totalFailures++
          })
        })
      } else {
        console.log(`  ✓ Axe color-contrast: 0 violations`)
      }
    } catch (err) {
      console.log(`  [AXE ERROR]`, err.message)
    }

    // 2. Opacity audit: Walk every visible text node and compute effective opacity
    const opacityIssues = await page.evaluate(() => {
      const issues = []
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      )

      let node
      while ((node = walker.nextNode())) {
        const text = node.textContent.trim()
        if (!text || text.length < 2) continue

        const parent = node.parentElement
        if (!parent) continue

        // Ignore hidden elements or script/style/svg text
        if (
          parent.closest('script, style, noscript, svg, [aria-hidden="true"], [data-debug]')
        ) {
          continue
        }

        const rect = parent.getBoundingClientRect()
        // Must be in viewport
        if (rect.width === 0 || rect.height === 0) continue
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue

        const cs = window.getComputedStyle(parent)
        if (cs.display === 'none' || cs.visibility === 'hidden') continue

        // Compute effective opacity (product of all ancestor opacities)
        let effectiveOpacity = 1.0
        let curr = parent
        while (curr && curr !== document.documentElement) {
          const comp = window.getComputedStyle(curr)
          effectiveOpacity *= parseFloat(comp.opacity || '1')
          curr = curr.parentElement
        }

        if (effectiveOpacity < 0.95) {
          issues.push({
            text: text.slice(0, 30),
            tag: parent.tagName.toLowerCase(),
            className: parent.className,
            opacity: effectiveOpacity.toFixed(2),
          })
        }
      }

      return issues
    })

    if (opacityIssues.length > 0) {
      console.log(`  [OPACITY AUDIT] Found ${opacityIssues.length} element(s) with effective opacity < 0.95:`)
      opacityIssues.forEach((issue) => {
        console.log(`    - <${issue.tag} class="${issue.className}"> "${issue.text}..." (opacity: ${issue.opacity})`)
        totalFailures++
      })
    } else {
      console.log(`  ✓ Opacity audit: 0 text nodes below 0.95 opacity`)
    }
  }

  await context.close()
}

await browser.close()
console.log(`\n========================================`)
console.log(`FINAL RESULT: ${totalFailures === 0 ? 'ALL PASSED (0 failures)' : `${totalFailures} FAILURE(S)`}`)
console.log(`========================================`)
process.exit(totalFailures ? 1 : 0)
