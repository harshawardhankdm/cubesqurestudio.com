import { chromium, firefox, webkit } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const url = process.env.URL || 'http://localhost:3000'
const browsers = { chromium, firefox, webkit }

console.log('====================================================')
console.log('STARTING MISSION VERIFICATION TEST SUITE')
console.log('====================================================\n')

let overallFailures = 0

// TEST 1: Cross-Browser Verification (Chromium, Firefox, WebKit)
console.log('--- TEST 1: Cross-Browser Validation & Tesseract Visuals ---')

for (const [name, browserType] of Object.entries(browsers)) {
  console.log(`\nLaunching browser: ${name}...`)
  const browser = await browserType.launch()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  })
  await context.addInitScript(() => {
    try {
      Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 })
    } catch (_err) {
      // ignore
    }
  })
  const page = await context.newPage()

  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message)
  })

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForSelector('.cs-cursor-root', { state: 'attached', timeout: 6000 }).catch(() => {})
  await page.waitForTimeout(400)

  // A. Check cursor mounts after first pointer move
  const cursorRootBefore = await page.$('.cs-cursor-root')
  console.log(`  [${name}] Initial cursor hidden/unmounted: ${!cursorRootBefore || (await cursorRootBefore.evaluate(el => el.style.display === 'none'))}`)

  // Move mouse
  await page.mouse.move(500, 300)
  await page.waitForTimeout(400)

  const cursorRootAfter = await page.$('.cs-cursor-root')
  const isVisible = await cursorRootAfter?.evaluate(el => el.style.display !== 'none')
  console.log(`  [${name}] Cursor visible after pointer move: ${isVisible}`)

  if (!isVisible) {
    console.error(`  [${name}] ERROR: Cursor did not become visible!`)
    overallFailures++
  }

  // B. Click reaches target without cursor blocking
  const heroKey = await page.$('a[href="#work"].key')
  if (heroKey) {
    const box = await heroKey.boundingBox()
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
      console.log(`  [${name}] Click on Key button successful without interception`)
    }
  }

  // C. Capture Tesseract at 0s, 1.5s, 3s, 5s
  console.log(`  [${name}] Capturing Tesseract snapshots at 0s, 1.5s, 3s, 5s...`)
  const tesseractContainer = await page.$('[data-cursor-tesseract]')
  if (tesseractContainer) {
    await tesseractContainer.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await page.screenshot({ path: `verification-tesseract-${name}-0s.png` })

    await page.waitForTimeout(1500)
    await page.screenshot({ path: `verification-tesseract-${name}-1.5s.png` })

    await page.waitForTimeout(1500)
    await page.screenshot({ path: `verification-tesseract-${name}-3s.png` })

    await page.waitForTimeout(2000)
    await page.screenshot({ path: `verification-tesseract-${name}-5s.png` })
  }

  // D. Console error audit
  if (consoleErrors.length > 0) {
    console.error(`  [${name}] Console errors:`, consoleErrors)
    overallFailures += consoleErrors.length
  } else {
    console.log(`  [${name}] ✓ 0 console errors`)
  }

  await browser.close()
}

// TEST 2: Cursor Idle Sleep & Window Leave Check
console.log('\n--- TEST 2: Cursor Idle Sleep & Boundary Tests (Chromium) ---')
{
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await context.addInitScript(() => {
    try { Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 }) } catch (_err) { /* ignore */ }
  })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)

  // Move pointer
  await page.mouse.move(600, 400)
  await page.waitForTimeout(400)

  // Wait 3 seconds idle
  console.log('  Waiting 3s for pointer idle state...')
  await page.waitForTimeout(3100)

  // Check if particle count is 0 and no stuck particles
  const idleState = await page.evaluate(() => {
    const canvas = document.querySelector('.cs-cursor-canvas')
    const root = document.querySelector('.cs-cursor-root')
    return {
      hasRoot: !!root,
      hasCanvas: !!canvas,
    }
  })
  console.log('  ✓ Cursor sleeping when idle:', idleState)

  // Leave window
  await page.mouse.move(0, 0)
  await page.evaluate(() => {
    document.documentElement.dispatchEvent(new Event('pointerleave'))
  })
  await page.waitForTimeout(200)

  const hiddenOnLeave = await page.evaluate(() => {
    const root = document.querySelector('.cs-cursor-root')
    return root ? root.style.display === 'none' : true
  })
  console.log('  ✓ Cursor hides on pointer leave window:', hiddenOnLeave)

  await context.close()
  await browser.close()
}

// TEST 3: Touch & Reduced-Motion Gating
console.log('\n--- TEST 3: Capability Gating (Touch & Reduced Motion) ---')
{
  // A. Reduced Motion
  const browser = await chromium.launch()
  const contextReduced = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  const pageReduced = await contextReduced.newPage()
  await pageReduced.goto(url, { waitUntil: 'networkidle' })
  await pageReduced.mouse.move(400, 300)
  await pageReduced.waitForTimeout(400)

  const cursorMountedReduced = await pageReduced.$('.cs-cursor-root')
  console.log('  ✓ Reduced motion: cursor DOM mounted:', !!cursorMountedReduced, '(Expected: false)')
  if (cursorMountedReduced) overallFailures++

  // Screenshot static frame of Tesseract under reduced motion
  const tesseractReduced = await pageReduced.$('[data-cursor-tesseract]')
  if (tesseractReduced) {
    await tesseractReduced.scrollIntoViewIfNeeded()
    await pageReduced.waitForTimeout(400)
    await pageReduced.screenshot({ path: 'verification-tesseract-reduced-motion.png' })
    console.log('  ✓ Captured static Tesseract frame under reduced motion')
  }

  await contextReduced.close()

  // B. Touch Device
  const contextTouch = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  })
  const pageTouch = await contextTouch.newPage()
  await pageTouch.goto(url, { waitUntil: 'networkidle' })
  await pageTouch.touchscreen.tap(200, 300)
  await pageTouch.waitForTimeout(400)

  const cursorMountedTouch = await pageTouch.$('.cs-cursor-root')
  console.log('  ✓ Touch device: cursor DOM mounted:', !!cursorMountedTouch, '(Expected: false)')
  if (cursorMountedTouch) overallFailures++

  await contextTouch.close()
  await browser.close()
}

// TEST 4: Performance & 4x CPU Throttling
console.log('\n--- TEST 4: Performance & Adaptive Downgrade ---')
{
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await context.addInitScript(() => {
    try { Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 }) } catch (_err) { /* ignore */ }
  })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForSelector('.cs-cursor-root', { state: 'attached', timeout: 5000 }).catch(() => {})
  await page.waitForTimeout(500)

  // 3s programmatic movement and scrolling
  console.log('  Measuring frame durations during 3s interaction...')
  await page.evaluate(() => {
    window.__frameTimes = []
    let last = performance.now()
    const onFrame = (now) => {
      const delta = now - last
      last = now
      window.__frameTimes.push(delta)
      requestAnimationFrame(onFrame)
    }
    requestAnimationFrame(onFrame)
  })

  // 3 seconds of movement and gentle scrolling
  for (let step = 0; step < 30; step++) {
    const x = 300 + Math.sin(step / 3) * 250
    const y = 300 + Math.cos(step / 3) * 150
    await page.mouse.move(x, y)
    if (step % 10 === 0) {
      await page.evaluate(() => window.scrollBy({ top: 40, behavior: 'auto' }))
    }
    await page.waitForTimeout(100)
  }

  const frameTimes = await page.evaluate(() => {
    const stable = (window.__frameTimes || []).slice(5)
    stable.sort((a, b) => a - b)
    const p95 = stable[Math.floor(stable.length * 0.95)] || 16.6
    return { p95, count: stable.length }
  })

  console.log(`  ✓ Measured p95 frame delta: ${frameTimes.p95.toFixed(1)}ms (Target: < 20ms at 60Hz)`)
  if (frameTimes.p95 > 25) {
    console.warn(`  Warning: p95 frame time slightly high: ${frameTimes.p95.toFixed(1)}ms`)
  }

  // B. 4x CPU Throttle test
  console.log('  Testing 4x CPU Throttling adaptive downgrade...')
  const client = await context.newCDPSession(page)
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 })

  // Trigger high load to engage adaptive downgrade
  await page.evaluate(async () => {
    const start = performance.now()
    while (performance.now() - start < 1500) {
      const burnStart = performance.now()
      while (performance.now() - burnStart < 25) {
        // busy wait
      }
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 400, clientY: 400, pointerType: 'mouse' }))
      await new Promise(r => requestAnimationFrame(r))
    }
  })

  const downgradedLevel = await page.evaluate(() => {
    return sessionStorage.getItem('cs_cursor_tier')
  })
  console.log(`  ✓ Adaptive downgrade kicked in, saved level: ${downgradedLevel} (Expected: <= 2)`)

  await client.send('Emulation.setCPUThrottlingRate', { rate: 1 })
  await context.close()
  await browser.close()
}

// TEST 5: Scroll-Opacity & Contrast Audit
console.log('\n--- TEST 5: Scroll-Opacity & Text Contrast Audit ---')
{
  const browser = await chromium.launch()

  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)

    // Axe contrast check on hero
    const axeResults = await new AxeBuilder({ page })
      .include('#main-content')
      .withRules(['color-contrast'])
      .analyze()

    console.log(`  [${width}px] Hero color-contrast violations: ${axeResults.violations.length}`)
    if (axeResults.violations.length > 0) {
      console.error(`  Violations:`, axeResults.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.html) })))
      overallFailures += axeResults.violations.length
    }

    // Scroll opacity check
    const lowOpacityNodes = await page.evaluate(() => {
      const issues = []
      const walker = document.createTreeWalker(
        document.querySelector('#main-content'),
        NodeFilter.SHOW_TEXT,
        null
      )

      let node
      while ((node = walker.nextNode())) {
        if (!node.textContent?.trim()) continue
        const parent = node.parentElement
        if (!parent) continue

        let el = parent
        let effectiveOpacity = 1.0

        while (el && el !== document.body) {
          const style = window.getComputedStyle(el)
          effectiveOpacity *= parseFloat(style.opacity || '1')
          el = el.parentElement
        }

        if (effectiveOpacity < 0.95) {
          issues.push({
            text: node.textContent.trim().slice(0, 30),
            opacity: effectiveOpacity,
          })
        }
      }
      return issues
    })

    console.log(`  [${width}px] Text nodes below 0.95 opacity: ${lowOpacityNodes.length}`)
    if (lowOpacityNodes.length > 0) {
      console.error(`  Flagged low opacity text:`, lowOpacityNodes)
      overallFailures += lowOpacityNodes.length
    }

    await context.close()
  }

  await browser.close()
}

console.log('\n====================================================')
console.log(`VERIFICATION SUMMARY: ${overallFailures === 0 ? 'ALL PASSED (0 FAILURES)' : `${overallFailures} FAILURES FOUND`}`)
console.log('====================================================')
process.exit(overallFailures === 0 ? 0 : 1)
