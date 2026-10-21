const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { chromium } = createRequire('C:/Users/joao0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json')('playwright');
const base = process.argv[2] || 'http://127.0.0.1:3035';
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const page = await browser.newPage({ reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    for (const width of process.argv[3] === 'smoke' ? [390] : [320, 375, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForFunction(() => !document.querySelector('.header').classList.contains('compact'));
      assert(await page.evaluate(() => {
        const banner = document.querySelector('.october-bar').getBoundingClientRect();
        const header = document.querySelector('.header').getBoundingClientRect();
        return banner.bottom <= header.top + 1 && header.bottom < document.querySelector('.hero-topline').getBoundingClientRect().top && document.documentElement.scrollWidth <= innerWidth;
      }), `Header/banner/hero geometry at ${width}px`);
      await page.locator('.october-bar>a').click();
      await page.waitForFunction(() => {
        const top = document.querySelector('#outubro-rosa').getBoundingClientRect().top;
        const bottom = document.querySelector('.header').getBoundingClientRect().bottom;
        return top >= bottom - 1 && top < bottom + 90;
      });
      await page.locator('.october-button').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.october-button').parentElement).opacity === '1');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (width < 900) {
        await page.getByRole('button', { name: 'Abrir menu' }).click();
        await page.getByRole('dialog', { name: 'Menu de navegação' }).waitFor({ state: 'visible' });
        await page.keyboard.press('Escape');
        await page.getByRole('dialog', { name: 'Menu de navegação' }).waitFor({ state: 'hidden' });
      }
      console.log(`PASS ${width}px: banner, header, hero, anchor, reveals, menu, overflow`);
    }
    const campaignText = await page.locator('#outubro-rosa').innerText();
    assert(campaignText.includes('4 sessões de terapia') && campaignText.includes('600,00') && campaignText.includes('Valor total do pacote com 4 sessões.'));
    assert(!/R\$\s*100(?:\b|,00)/.test(await page.locator('body').textContent()));
    assert(await page.locator('body').textContent().then(text => text.includes('Triagem / anamnese') && !text.toLowerCase().includes('anamnese gratuita')));
    const campaignURL = new URL(await page.locator('.october-button').getAttribute('href'));
    const regularURL = new URL(await page.locator('.floating-whatsapp').getAttribute('href'));
    assert.equal(campaignURL.pathname, regularURL.pathname);
    assert.equal(campaignURL.searchParams.get('text'), 'Olá, Ely! Vi no seu site a campanha de Outubro Rosa com o pacote de 4 sessões por R$ 600,00. Gostaria de saber mais informações.');
    await page.getByRole('button', { name: 'Como funciona a primeira conversa?' }).click();
    const firstConversation = page.getByRole('region', { name: 'Como funciona a primeira conversa?' });
    await firstConversation.waitFor({ state: 'visible' });
    assert(await firstConversation.textContent().then(text => text.includes('anamnese') && !text.includes('R$ 100')));
    await page.getByRole('tab', { name: 'Relacionamentos' }).click();
    assert(await page.getByRole('tabpanel').filter({ hasText: 'cada parceiro' }).isVisible());
    await page.getByRole('link', { name: 'Ver certificado', exact: true }).click();
    await page.getByRole('button', { name: 'Fechar certificado' }).click();
    assert.equal(await page.locator('a.credits').getAttribute('href'), 'https://jpcreative.com.br');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => !document.documentElement.classList.contains('motion-ready'));
    assert.equal(errors.length, 0, errors.join('; '));
    const noJS = await browser.newPage({ javaScriptEnabled: false });
    await noJS.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await noJS.locator('#october-title').evaluate(el => getComputedStyle(el).opacity), '1');
    assert(await noJS.locator('#outubro-rosa').textContent().then(text => text.includes('600,00')));
    console.log('PASS package total, official WhatsApp/message, no anamnese price, FAQ, audience, certificate, footer, reduced motion, no-JS');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
