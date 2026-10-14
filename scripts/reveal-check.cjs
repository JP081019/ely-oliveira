const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { chromium } = createRequire('C:/Users/joao0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json')('playwright');
const base = process.env.SITE_URL || 'http://127.0.0.1:3016';
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const width of process.env.REVEAL_WIDTHS ? process.env.REVEAL_WIDTHS.split(',').map(Number) : [320, 390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: 'no-preference' });
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'));
      const elements = page.locator('[data-reveal]');
      for (let i = 0; i < await elements.count(); i++) {
        await elements.nth(i).scrollIntoViewIfNeeded();
        await page.waitForFunction(index => {
          const el = document.querySelectorAll('[data-reveal]')[index];
          return el.classList.contains('is-visible') && getComputedStyle(el).opacity === '1' && !el.classList.contains('reveal-pending');
        }, i);
      }
      await page.waitForTimeout(1250);
      assert(await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].every(el => !getComputedStyle(el).clipPath.includes('100%'))));
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => !document.documentElement.classList.contains('motion-ready'));
      assert(await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].every(el => getComputedStyle(el).opacity === '1')));
      await page.close();
      console.log(`PASS reveals, clip, scroll and reduced motion: ${width}px`);
    }
    for (const mode of ['no-js', 'missing-observer', 'broken-observer', 'silent-observer']) {
      const page = await browser.newPage({ javaScriptEnabled: mode !== 'no-js', reducedMotion: 'no-preference' });
      if (mode !== 'no-js') await page.addInitScript(mode => {
        if (mode === 'missing-observer') delete window.IntersectionObserver;
        else window.IntersectionObserver = class { constructor() { if (mode === 'broken-observer') throw Error('Simulated failure'); } observe() {} unobserve() {} disconnect() {} };
      }, mode);
      await page.goto(base, { waitUntil: 'networkidle' });
      assert(await page.locator('[data-reveal]').evaluateAll(els => els.every(el => getComputedStyle(el).opacity === '1' && !getComputedStyle(el).clipPath.includes('100%'))));
      await page.close();
      console.log(`PASS visible fallback: ${mode}`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
