import { chromium } from 'playwright';
const url = process.env.URL || 'http://localhost:3000';
const widths = [360, 390, 768, 1024, 1280, 1440, 1920];
const browser = await chromium.launch();
let total = 0;
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  const issues = await page.evaluate(() => {
    const out = [];
    const vw = document.documentElement.clientWidth;
    const label = (el) =>
      el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
      (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '') +
      ' "' + (el.textContent || '').trim().slice(0, 30) + '"';
    const ownText = (el) =>
      [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (document.documentElement.scrollWidth > vw + 1) out.push('PAGE has horizontal scroll');
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') return;
      if (ownText(el)) {
        if (r.left < -1 || r.right > vw + 1) out.push('OFFSCREEN text: ' + label(el));
        let p = el.parentElement;
        while (p && p !== document.body) {
          const pc = getComputedStyle(p);
          if (pc.overflow !== 'visible' || pc.overflowX !== 'visible' || pc.overflowY !== 'visible') {
            const pr = p.getBoundingClientRect();
            if (r.bottom > pr.bottom + 1 || r.right > pr.right + 1 || r.left < pr.left - 1)
              out.push('CLIPPED by ' + label(p) + ': ' + label(el));
          }
          p = p.parentElement;
        }
      }
      if (el.matches('button, a[class*="btn"], [role="button"], input, textarea, select')) {
        const pl = parseFloat(cs.paddingLeft), pr2 = parseFloat(cs.paddingRight);
        if (pl < 12 || pr2 < 12) out.push('TIGHT PADDING (' + pl + '/' + pr2 + '): ' + label(el));
      }
      if (el.matches('[data-card], .glass')) {
        if (parseFloat(cs.paddingLeft) < 20) out.push('CARD NO PADDING: ' + label(el));
      }
    });
    // containers must be centered
    document.querySelectorAll('section > div, [data-container]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < vw - 1 && Math.abs(r.left - (vw - r.right)) > 2)
        out.push('NOT CENTERED: ' + label(el) + ` (left ${Math.round(r.left)}, right ${Math.round(vw - r.right)})`);
    });
    return [...new Set(out)];
  });
  console.log(`\n--- ${w}px: ${issues.length} issue(s)`);
  issues.forEach((i) => console.log('  ' + i));
  total += issues.length;
  await page.screenshot({ path: `audit-${w}.png`, fullPage: true });
  await page.close();
}
await browser.close();
process.exit(total ? 1 : 0);
