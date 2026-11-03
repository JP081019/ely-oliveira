const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
let playwright;
try { playwright = require('playwright'); }
catch { playwright = createRequire(process.env.PLAYWRIGHT_PACKAGE || 'C:/Users/joao0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json')('playwright'); }
const url = process.env.SITE_URL || 'http://127.0.0.1:3016';
const key = 'ely-analytics-consent-v1';
const google = /googletagmanager|google-analytics\.com/;

(async () => {
  const browser = await playwright.chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const context = await browser.newContext();
    await context.route('**/_vercel/insights/script.js', route => route.fulfill({ contentType: 'application/javascript', body: '' }));
    const page = await context.newPage();
    const requests = [], errors = [];
    page.on('request', request => { if (google.test(request.url())) requests.push(request.url()); });
    page.on('pageerror', error => errors.push(error.message));
    // Keep tests local: inspect the queued Google commands without sending data.
    await context.route('https://www.googletagmanager.com/**', route => route.fulfill({ contentType: 'application/javascript', body: '/* analytics network stub */' }));
    await context.route('**/google-analytics.com/**', route => route.abort());
    await page.goto(url + '/?motivo=private-test#private-test', { waitUntil: 'networkidle' });
    assert.equal(requests.length, 0, 'Google must not load before consent');
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(new URL(await page.locator('link[rel=canonical]').getAttribute('href')).href, 'https://www.terapiaely.com.br/');
    assert.equal(await page.locator('meta[property="og:title"]').count(), 1);
    assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute('content'), 'summary_large_image');
    assert.equal(await page.locator('script[type="application/ld+json"]').count(), 1);
    assert(!/outubro rosa|600,00|4 sessões/i.test(await page.locator('body').innerText()));
    await page.getByRole('button', { name: 'Recusar', exact: true }).click();
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(requests.length, 0, 'Google must stay blocked after saved refusal');
    assert.equal(await page.locator('.cookie-banner').count(), 0);

    for (const width of [320, 375, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (let i = 0; i < 3; i++) {
        const frame = page.locator('.certificate-frame').nth(i);
        await frame.scrollIntoViewIfNeeded();
        await frame.locator('img').evaluate(img => img.decode());
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'overflow at ' + width);
        await frame.click();
        const dialog = page.locator('.certificate-dialog');
        await dialog.waitFor({ state: 'visible' });
        await dialog.locator('img').evaluate(img => img.decode());
        assert.equal(await dialog.locator('.certificate-original').getAttribute('href'), await frame.getAttribute('href'));
        assert(await dialog.locator('img').evaluate(img => Math.abs(img.clientWidth / img.clientHeight - img.naturalWidth / img.naturalHeight) < 0.025));
        for (let n = 0; n < 3; n++) {
          await page.keyboard.press('Tab');
          assert(await dialog.evaluate(el => el.contains(document.activeElement)));
        }
        if (i === 1) await dialog.getByRole('button', { name: 'Fechar certificado' }).click();
        else await page.keyboard.press('Escape');
        await page.waitForFunction(() => document.body.style.overflow === '');
        assert(await frame.evaluate(el => el === document.activeElement));
      }
    }
    console.log('PASS three real certificates: images, ratios, modal, Tab, Escape, focus, six viewports');

    await page.locator('.footer-privacy button').click();
    await page.getByRole('button', { name: 'Aceitar', exact: true }).click();
    await page.waitForFunction(() => !!window.gtag && window.elyAnalyticsAllowed);
    await page.waitForFunction(() => [...document.scripts].some(s => s.src.includes('googletagmanager')));
    await page.waitForLoadState('networkidle');
    assert.equal(requests.filter(u => u.includes('googletagmanager')).length, 1);
    const commands = () => page.evaluate(() => window.dataLayer.map(item => Array.from(item)));
    let queue = await commands();
    assert.equal(queue.filter(c => c[0] === 'config').length, 1);
    assert.equal(queue.filter(c => c[0] === 'event' && c[1] === 'page_view').length, 1);
    assert(!JSON.stringify(queue).includes('private-test'));
    // Trigger each real React handler, canceling only the external browser navigation.
    const links = page.locator('a[href*="wa.me"]');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      await links.nth(i).evaluate(el => {
        el.addEventListener('click', event => event.preventDefault(), { once: true });
        el.click();
      });
    }
    queue = await commands();
    const clicks = queue.filter(c => c[0] === 'event' && c[1] === 'whatsapp_click');
    assert.equal(clicks.length, count);
    for (const click of clicks) assert.deepEqual(Object.keys(click[2]).sort(), ['cta_type', 'location']);
    assert(!JSON.stringify(clicks).includes('5531'));
    assert.equal(await page.evaluate(k => localStorage.getItem(k), key), 'accepted');
    await page.goto(url + '/privacidade?private=private-test', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://www.terapiaely.com.br/privacidade');
    assert(!(await page.locator('body').innerText()).includes('Psicóloga'));
    await page.getByRole('button', { name: 'Preferências de cookies' }).click();
    const previousRequests = requests.length;
    await page.getByRole('button', { name: 'Recusar', exact: true }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(k => localStorage.getItem(k) === 'rejected' && !window.elyAnalyticsAllowed, key);
    assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 0);
    assert.equal(requests.length, previousRequests);
    console.log('PASS consent: zero Google before accept/after refusal, one init/pageview, safe WhatsApp payload, withdrawal');
    for (const path of ['/robots.txt', '/sitemap.xml', '/opengraph-image']) {
      const response = await context.request.get(url + path);
      assert.equal(response.status(), 200, path);
      if (path.includes('sitemap')) assert((await response.text()).includes('https://www.terapiaely.com.br/privacidade'));
      if (path.includes('robots')) assert((await response.text()).includes('https://www.terapiaely.com.br/sitemap.xml'));
      if (path.includes('opengraph')) assert(response.headers()['content-type'].includes('image/png'));
    }
    assert.equal(errors.length, 0, errors.join('; '));
    console.log('PASS canonical, OG, Twitter, JSON-LD, promotion removal, privacy, sitemap, robots, social image, browser errors');
    await context.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
