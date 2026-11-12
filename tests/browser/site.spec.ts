import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { join } from "node:path";

const screenshotRoot = join(process.cwd(), ".private", "review");
const sizes = [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920];

async function reject(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "Rejeitar opcionais", exact: true }).first().click();
  await expect(page.locator(".cookie-banner")).toHaveCount(0);
}

test("conteúdo completo, navegação, FAQ e documentos privados", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/"); await page.waitForLoadState("networkidle");
  await reject(page);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("#sobre")).toBeVisible();
  await page.getByRole("button", { name: "Continue minha história" }).click();
  await expect(page.getByText("Seja bem-vindo(a). Que Deus abençoe sua caminhada.")).toBeVisible();
  await page.getByRole("button", { name: "Recolher minha história" }).click();
  await page.getByRole("button", { name: "Você atende casais?", exact: true }).click();
  await expect(page.locator("#answer-4")).toBeVisible();
  await expect(page.locator("#answer-4")).toContainText("totalmente online");
  await page.getByRole("button", { name: "Quantas sessões preciso fazer?", exact: true }).click();
  await expect(page.locator("#answer-4")).toBeHidden();
  await expect(page.locator("#answer-3")).toContainText("Não existe uma quantidade única");
  await page.getByRole("button", { name: "Quantas sessões preciso fazer?", exact: true }).click();
  const missingAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute("href")!).filter(href => href.length > 1 && !document.getElementById(decodeURIComponent(href.slice(1)))));
  expect(missingAnchors).toEqual([]);
  const wa = page.locator('a[href="https://wa.me/5531997779876"]');
  expect(await wa.count()).toBeGreaterThanOrEqual(5);
  for (const link of await wa.all()) await expect(link).toHaveAttribute("rel", /noopener/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.terapiaely.com.br");
  expect((await request.get("/diplomas/psicologia-clinica.jpeg")).status()).toBe(404);
  expect((await request.get("/.private/diplomas/psicologia-forense.jpeg")).status()).toBe(404);
  expect((await request.get("/icons.svg")).status()).toBe(200);
  expect((await request.get("/opengraph-image")).status()).toBe(200);
  const oldPolicy = await request.get("/privacidade", { maxRedirects: 0 });
  expect(oldPolicy.status()).toBe(308);
  expect(oldPolicy.headers().location).toBe("/politica-de-privacidade");
  const robots = await (await request.get("/robots.txt")).text(); expect(robots).toContain("Disallow: /");
  expect(errors).toEqual([]);
});

test("sem rolagem horizontal nos nove tamanhos e com menu móvel acessível", async ({ page }) => {
  await page.goto("/"); await reject(page);
  for (const width of sizes) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    expect(metrics.document, `largura ${width}`).toBeLessThanOrEqual(metrics.viewport + 1);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Seções", exact: true }).click();
  await expect(page.getByRole("navigation", { name: "Todas as seções" })).toBeVisible();
  await page.getByRole("navigation", { name: "Todas as seções" }).getByRole("link", { name: "Atendimento", exact: true }).click();
  await expect(page.getByRole("button", { name: "Seções", exact: true })).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#atendimento/);
  await page.getByRole("button", { name: "Seções", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Seções", exact: true })).toBeFocused();
  await page.goto("/"); await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(screenshotRoot, "mobile-390.png"), fullPage: true, animations: "disabled" });
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(screenshotRoot, "desktop-1440.png"), fullPage: true, animations: "disabled" });
});

test("consentimento bloqueia tags, aceita, revoga e persiste a rejeição", async ({ page, context }) => {
  const googleRequests: string[] = [];
  await context.route(/googletagmanager\.com\/gtag\/js/, async route => { googleRequests.push(route.request().url()); await route.fulfill({ contentType: "text/javascript", body: "/* mocked for local verification; no measurement sent */" }); });
  await context.route(/google-analytics\.com/, route => route.fulfill({ status: 204 }));
  await page.goto("/"); await page.waitForLoadState("networkidle");
  expect(googleRequests).toHaveLength(0);
  await expect(page.locator("#ely-ga4")).toHaveCount(0);
  await reject(page); await page.reload();
  expect(googleRequests).toHaveLength(0);
  await page.getByRole("button", { name: "Preferências de Cookies", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Salvar preferências" }).click();
  await expect(page.locator("#ely-ga4")).toHaveCount(1);
  await expect.poll(() => googleRequests.length).toBe(1);
  const events = await page.evaluate(() => (window as unknown as { dataLayer: unknown[][] }).dataLayer.map(entry => Array.from(entry)));
  expect(events.filter(entry => entry[0] === "event" && entry[1] === "page_view")).toHaveLength(1);
  const defaults = events.find(entry => entry[0] === "consent" && entry[1] === "default");
  expect(defaults?.[2]).toMatchObject({ analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  await context.addCookies([{ name: "_ga", value: "test", url: "http://127.0.0.1:3100" }]);
  await page.getByRole("button", { name: "Preferências de Cookies", exact: true }).click();
  await page.getByRole("button", { name: "Rejeitar opcionais", exact: true }).click();
  await expect(page.locator("#ely-ga4")).toHaveCount(0);
  expect((await context.cookies()).filter(cookie => cookie.name.startsWith("_ga"))).toEqual([]);
  await page.reload(); await page.waitForLoadState("networkidle");
  expect(googleRequests).toHaveLength(1);
  await expect(page.locator(".cookie-banner")).toHaveCount(0);
});

test("teclado, movimento reduzido e acessibilidade", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/"); await reject(page);
  await page.keyboard.press("Tab");
  await page.locator(".desktop-dock a").nth(1).focus();
  await expect(page.locator(".desktop-dock a").nth(1)).toBeFocused();
  await expect(page.locator(".desktop-dock .dock-label").nth(1)).toHaveCSS("opacity", "1");
  await page.getByRole("button", { name: "O que é TRG?", exact: true }).focus();
  await page.keyboard.press("Enter"); await expect(page.locator("#answer-0")).toBeVisible();
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(audit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await expect(page.locator("#contato")).toHaveAttribute("data-scene-ready", "true");
  await page.locator("#contato").screenshot({ path: join(screenshotRoot, "footer-desktop.png"), animations: "disabled" });
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileAudit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(mobileAudit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
});
