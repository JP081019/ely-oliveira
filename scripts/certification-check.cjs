const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { chromium } = createRequire('C:/Users/joao0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json')('playwright');
const url = process.argv[2] || 'http://127.0.0.1:3030';
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const page = await browser.newPage({ reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(url, { waitUntil: 'networkidle' });
    assert(await page.locator('#certificacao').innerText().then(text => text.includes('360 horas') && text.includes('09/10/2026') && text.includes('validade provisória de 12 meses')));
    assert(await page.evaluate(() => document.querySelector('#certificacao').previousElementSibling.id === 'sobre' && document.querySelector('#certificacao').nextElementSibling.id === 'trg'));
    for (const width of process.argv[3] === 'smoke' ? [390] : [320, 375, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      await page.locator('.certificate-frame').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.certificate-frame')).opacity === '1');
      await page.locator('.certificate-frame img').evaluate(img => img.decode());
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const button = page.getByRole('link', { name: 'Ver certificado', exact: true });
      await button.click();
      const dialog = page.getByRole('dialog', { name: 'Certificado TRG · Ely Oliveira' });
      await dialog.waitFor({ state: 'visible' });
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
      const img = dialog.locator('img');
      await img.evaluate(el => el.decode());
      assert(await img.evaluate(el => el.naturalWidth > 0 && Math.abs(el.clientWidth / el.clientHeight - 670 / 465) < .03 && getComputedStyle(el).objectFit === 'contain'));
      for (let i = 0; i < 4; i++) { await page.keyboard.press('Tab'); assert(await dialog.evaluate(el => el.contains(document.activeElement))); }
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      await page.waitForFunction(() => document.activeElement?.textContent.includes('Ver certificado'));
      assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
      await page.locator('.certificate-frame').click();
      await dialog.waitFor({ state: 'visible' });
      await page.getByRole('button', { name: 'Fechar certificado' }).click();
      await dialog.waitFor({ state: 'hidden' });
      await page.waitForFunction(() => document.activeElement?.classList.contains('certificate-frame'));
      await button.click(); await dialog.waitFor({ state: 'visible' });
      await page.mouse.click(2, 2); await dialog.waitFor({ state: 'hidden' });
      console.log(`PASS ${width}px: image, overflow, modal, keyboard, focus, scroll lock, backdrop`);
    }
    assert.equal(await page.locator('a.credits').getAttribute('href'), 'https://jpcreative.com.br');
    assert.equal(errors.length, 0, errors.join('; '));
    const noJS = await browser.newPage({ javaScriptEnabled: false });
    await noJS.goto(url, { waitUntil: 'networkidle' });
    assert.equal(await noJS.getByRole('link', { name: 'Ver certificado', exact: true }).getAttribute('href'), '/images/certificado-trg-ely.jpeg');
    assert.equal(await noJS.locator('.certification-copy').evaluate(el => getComputedStyle(el).opacity), '1');
    console.log('PASS certificate fallback without JavaScript and no asset errors');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
