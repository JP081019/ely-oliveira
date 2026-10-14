const { createRequire } = require('node:module');
const assert = require('node:assert/strict');
let playwright;
try { playwright = require('playwright'); }
catch { playwright = createRequire(process.env.PLAYWRIGHT_PACKAGE || 'C:/Users/joao0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json')('playwright'); }

(async () => {
  const browser = await playwright.chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage();
  const errors = [];
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto(process.env.SITE_URL || 'http://127.0.0.1:3016', { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'), null, { timeout: 10000 }).catch(error => { throw new Error(`Hydration: ${errors.join('; ')}; ${error.message}`); });
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
  const fonts = await page.evaluate(() => ['Figtree', 'Instrument Serif', 'Dancing Script'].map(name => [...document.fonts].some(font => font.family.toLowerCase().replaceAll(' ', '').includes(name.toLowerCase().replaceAll(' ', '')) && font.status === 'loaded')));
  assert(fonts.every(Boolean), `Fonts missing: ${fonts}`);
  const colors = await page.evaluate(() => Object.fromEntries(['.hero', '.statement', '.online', '.final-cta'].map(selector => [selector, getComputedStyle(document.querySelector(selector)).backgroundColor])));
  assert.equal(colors['.hero'], 'rgb(36, 23, 20)');
  assert.equal(colors['.statement'], 'rgb(36, 23, 20)');
  assert.equal(colors['.online'], 'rgb(247, 243, 232)');
  assert.notEqual(colors['.final-cta'], 'rgb(190, 49, 0)');
  for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const smallText = await page.locator('.hero-bottom p, .intro-copy p, .about-copy > p:not(.about-small), .trg-body > div > p:not(.muted), .audience-note p, .step-copy p, .faq-answer p, .cta-bottom p').evaluateAll(elements => elements.filter(el => parseFloat(getComputedStyle(el).fontSize) < 16).map(el => el.className || el.textContent.slice(0, 40)));
    assert.equal(smallText.length, 0, `Small relevant text at ${width}px: ${smallText.join(', ')}`);
    for (const selector of ['#inicio', '#sobre', '#atendimento', '#duvidas', '#contato', 'footer']) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
      assert(dimensions.document <= width && dimensions.body <= width, `Overflow ${width} ${selector}: ${JSON.stringify(dimensions)}`);
    }
    console.log(`PASS viewport ${width}px: no horizontal overflow`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const imageInfo = await page.locator('img').evaluateAll(images => images.map(img => ({ alt: img.alt, loaded: img.complete && img.naturalWidth > 0, fit: getComputedStyle(img).objectFit, ratio: img.getBoundingClientRect().width / img.getBoundingClientRect().height, originalRatio: Number(img.getAttribute('width')) / Number(img.getAttribute('height')) })));
  assert.equal(imageInfo.length, 6, 'Three photographs and three logo instances');
  for (const image of imageInfo) {
    assert(image.loaded, `Image not loaded: ${image.alt}`);
    assert.equal(image.fit, 'contain', `Image cropped: ${image.alt}`);
    assert(Math.abs(image.ratio - image.originalRatio) < 0.02, `Image ratio: ${image.alt}`);
  }
  assert.equal(await page.locator('.logo-placeholder').count(), 0);
  assert(await page.locator('.header').evaluate(el => el.classList.contains('compact')));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.getByRole('dialog').waitFor({ state: 'visible' });
  assert(await page.getByRole('dialog').isVisible());
  await page.keyboard.press('Escape');
  assert(!(await page.getByRole('dialog').isVisible()));
  assert.equal(await page.getByRole('button', { name: 'Abrir menu' }).evaluate(el => el === document.activeElement), true);
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.getByRole('navigation', { name: 'Navegação mobile' }).getByRole('link', { name: 'Sobre' }).click();
  assert(!(await page.getByRole('dialog').isVisible()));
  assert.equal(new URL(page.url()).hash, '#sobre');
  const faq = page.getByRole('button', { name: 'Como funciona o pagamento?' });
  await faq.click();
  assert.equal(await faq.getAttribute('aria-expanded'), 'true');
  assert(await page.locator('#resposta-4').innerText().then(text => text.includes('R$ 300')));
  await faq.click();
  assert.equal(await faq.getAttribute('aria-expanded'), 'false');
  await page.getByRole('tab', { name: 'Relacionamentos' }).click();
  assert(await page.getByRole('tabpanel').filter({ hasText: 'cada parceiro é atendido individualmente' }).isVisible());
  await page.getByRole('tab', { name: 'Relacionamentos' }).focus();
  await page.keyboard.press('Home');
  assert.equal(await page.getByRole('tab', { name: 'Traumas', exact: true }).getAttribute('aria-selected'), 'true');
  const links = await page.locator('a[href*="wa.me"]').evaluateAll(elements => elements.map(el => el.href));
  assert(links.length >= 4);
  for (const link of links) {
    const url = new URL(link);
    assert.equal(url.pathname, '/553197779876');
    assert.equal(url.searchParams.get('text'), 'Olá, Ely! Vim pelo site e gostaria de saber mais sobre a terapia.');
  }
  const anchors = await page.locator('a[href^="#"]').evaluateAll(elements => elements.map(el => el.getAttribute('href').slice(1)));
  assert(await page.evaluate(ids => ids.every(id => document.getElementById(id)), anchors));
  assert.equal(await page.locator('a.credits').getAttribute('href'), 'https://jpcreative.com.br');
  const iconFont = await page.locator('.floating-whatsapp i').evaluate(el => getComputedStyle(el, '::before').fontFamily);
  assert(iconFont.includes('bootstrap-icons'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => !document.documentElement.classList.contains('motion-ready'));
  const animated = await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length);
  assert.equal(animated, 0);
  assert.equal(errors.length, 0, `Browser errors: ${errors.join('; ')}`);
  console.log('PASS menu, Escape/focus, navigation, FAQ, keyboard tabs, WhatsApp, Bootstrap Icons, fonts, reduced motion, console');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
