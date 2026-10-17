import { chromium } from 'playwright';

const url = process.env.URL || 'http://localhost:3000';
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

const issues = await page.evaluate(() => {
  const out = [];
  const bodyText = document.body.innerText;
  if (!bodyText.includes('We turn bold visions into')) out.push('Missing Hero headline');
  if (!bodyText.includes('Projects Done')) out.push('Missing Stats');
  if (!bodyText.includes('Web & App Development')) out.push('Missing Services');
  if (!bodyText.includes('Pretty Bee')) out.push('Missing Work');
  if (!bodyText.includes('Discovery')) out.push('Missing Process');
  if (!bodyText.includes('Start a Project')) out.push('Missing Contact');
  return out;
});

console.log('Reduced motion audit results:', issues.length === 0 ? 'ALL PASSED (0 issues)' : issues);
await browser.close();
process.exit(issues.length ? 1 : 0);
