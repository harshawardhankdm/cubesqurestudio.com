import { chromium } from 'playwright'

const url = process.env.URL || 'http://localhost:3000'
const browser = await chromium.launch({
  args: ['--enable-gpu-rasterization', '--disable-background-timer-throttling'],
})
const page = await browser.newPage({
  viewport: { width: 1440, height: 1080 },
})

await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)

// 1. Screenshot Cube with Chips at 0s, 2s, 5s (scroll so cube is fully centered)
console.log('Capturing Hero Cube & Satellites at 0s, 2s, 5s...')
await page.evaluate(() => {
  const cube = document.querySelector('#main-content')
  if (cube) {
    const rect = cube.getBoundingClientRect()
    window.scrollTo(0, 320)
  }
})
await page.waitForTimeout(500)
await page.screenshot({ path: 'verification-cube-0s.png' })

await page.waitForTimeout(2000)
await page.screenshot({ path: 'verification-cube-2s.png' })

await page.waitForTimeout(3000)
await page.screenshot({ path: 'verification-cube-5s.png' })

// 2. Screenshot Hero Buttons & Stat Tiles
console.log('Capturing Hero buttons & stats...')
await page.evaluate(() => window.scrollTo(0, 520))
await page.waitForTimeout(500)
await page.screenshot({ path: 'verification-hero-buttons-stats.png' })

// 3. Screenshot Process Section (scroll so "Our Process" heading and steps are visible)
console.log('Capturing Process Section...')
await page.evaluate(() => {
  const heading = document.querySelector('#process h2')
  if (heading) {
    const top = heading.getBoundingClientRect().top + window.scrollY - 180
    window.scrollTo(0, top)
  }
})
await page.waitForTimeout(1000)
await page.screenshot({ path: 'verification-process.png' })

// 4. Cursor verification: Hover over Hero CTA key to verify morph & magnetic shift
console.log('Testing cursor morph over Key...')
await page.evaluate(() => window.scrollTo(0, 500))
await page.waitForTimeout(400)
const heroBtn = await page.$('a[href="#work"].key')
if (heroBtn) {
  const box = await heroBtn.boundingBox()
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.waitForTimeout(400)
    await page.screenshot({ path: 'verification-cursor-morph.png' })
  }
}

// 5. Work card lens test
console.log('Testing cursor lens over Work card...')
const workCard = await page.$('#work [data-card]')
if (workCard) {
  await workCard.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  const box = await workCard.boundingBox()
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 3)
    await page.waitForTimeout(400)
    await page.screenshot({ path: 'verification-cursor-lens.png' })
  }
}

// 6. Test Nav "Let's talk" fitting inside nav pill
console.log('Testing Nav Let\'s talk key inset...')
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(400)
const navHeader = await page.$('header')
if (navHeader) {
  await navHeader.screenshot({ path: 'verification-nav.png' })
}

// 7. Keys showcase test: capture buttons at rest, hover, pressed
console.log('Capturing Key states...')
const testBtn = await page.$('a[href="#work"].key')
if (testBtn) {
  await testBtn.scrollIntoViewIfNeeded()
  await page.waitForTimeout(200)
  await testBtn.screenshot({ path: 'verification-key-rest.png' })
  
  const box = await testBtn.boundingBox()
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.waitForTimeout(200)
    await testBtn.screenshot({ path: 'verification-key-hover.png' })
    
    await page.mouse.down()
    await page.waitForTimeout(100)
    await testBtn.screenshot({ path: 'verification-key-pressed.png' })
    await page.mouse.up()
  }
}

// 8. FPS audit during smooth scroll
console.log('Measuring scroll FPS...')
const fpsResult = await page.evaluate(async () => {
  return new Promise((resolve) => {
    let frames = 0
    let start = performance.now()
    function loop() {
      frames++
      window.scrollBy(0, 8)
      if (performance.now() - start < 1500) {
        requestAnimationFrame(loop)
      } else {
        const dur = (performance.now() - start) / 1000
        resolve(Math.round(frames / dur))
      }
    }
    requestAnimationFrame(loop)
  })
})

console.log(`Measured scroll FPS: ~${fpsResult} fps`)

await browser.close()
console.log('Visual audit complete!')

