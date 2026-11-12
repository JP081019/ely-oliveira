import { test, expect, devices } from "@playwright/test";
import { join } from "node:path";

for (const deviceName of ["Pixel 7"] as const) {
  test(`navegação por toque em ${deviceName}`, async ({ browser }) => {
    const context = await browser.newContext({ ...devices[deviceName], baseURL: "http://127.0.0.1:3100" });
    try {
      const page = await context.newPage();
      const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
      await page.goto("/"); await page.waitForLoadState("networkidle");
      await page.getByRole("button", { name: "Rejeitar opcionais", exact: true }).first().tap();
      await page.getByRole("button", { name: "Seções", exact: true }).tap();
      await page.getByRole("navigation", { name: "Todas as seções" }).getByRole("link", { name: "Dúvidas", exact: true }).tap();
      await page.getByRole("button", { name: "Você atende casais?", exact: true }).tap();
      await expect(page.locator("#answer-4")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.locator("#contato").scrollIntoViewIfNeeded();
      await expect(page.locator("#contato")).toHaveAttribute("data-scene-ready", "true");
      await expect(page.locator(".mrf-logo img")).toBeVisible();
      await page.locator("#contato").screenshot({ path: join(process.cwd(), ".private", "review", `${deviceName.replace(/ /g, "-").toLowerCase()}-footer.png`), animations: "disabled" });
      expect(errors).toEqual([]);
    } finally { await context.close(); }
  });
}

test("reflow equivalente a 200% em um monitor de 1440px", async ({ browser }) => {
  // Browser zoom halves the available CSS width. Keep a 720px layout with a
  // 2x device scale to verify this layout without simulating pinch-to-zoom.
  const context = await browser.newContext({ viewport: { width: 720, height: 500 }, deviceScaleFactor: 2 });
  try {
    const page = await context.newPage(); await page.goto("http://127.0.0.1:3100");
    await page.getByRole("button", { name: "Rejeitar opcionais", exact: true }).first().click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.getByRole("button", { name: "Seções", exact: true }).click();
    await expect(page.getByRole("navigation", { name: "Todas as seções" })).toBeVisible();
    await page.getByRole("navigation", { name: "Todas as seções" }).getByRole("link", { name: "Sobre Ely", exact: true }).click();
    await page.getByRole("button", { name: "Continue minha história" }).click();
    await expect(page.getByText("Seja bem-vindo(a). Que Deus abençoe sua caminhada.")).toBeVisible();
  } finally { await context.close(); }
});

test("Vercel configurado: uma tag após aceite e bloqueio após revogação", async ({ page, context }) => {
  test.skip(process.env.TEST_VERCEL !== "true", "Requer build local com Vercel Analytics habilitado na porta 3101.");
  let scripts = 0;
  await context.route(/googletagmanager\.com|google-analytics\.com/, route => route.fulfill({ contentType: "text/javascript", body: "/* no external collection in verification */" }));
  await context.route(/_vercel\/insights\/script\.js/, route => { scripts++; return route.fulfill({ contentType: "text/javascript", body: "/* no external collection in verification */" }); });
  await context.route(/_vercel\/insights\/(?:view|event)/, route => route.fulfill({ status: 204 }));
  await page.goto("http://127.0.0.1:3101"); await page.waitForLoadState("networkidle");
  expect(scripts).toBe(0);
  await page.getByRole("button", { name: "Aceitar opcionais", exact: true }).click();
  await expect.poll(() => scripts).toBe(1);
  expect(await page.locator('script[src*="_vercel/insights/script.js"]').count()).toBe(1);
  const beforeSend = await page.evaluate(() => {
    const queue = (window as unknown as { vaq?: [string, (event: { type: string; url: string }) => unknown][] }).vaq;
    return queue?.filter(entry => entry[0] === "beforeSend").at(-1)?.[1]({ type: "pageview", url: "https://www.terapiaely.com.br/?private=value#section" });
  });
  expect(beforeSend).toEqual({ type: "pageview", url: "https://www.terapiaely.com.br/" });
  await page.getByRole("button", { name: "Preferências de Cookies", exact: true }).click();
  await page.getByRole("button", { name: "Rejeitar opcionais", exact: true }).click();
  const revokedEvent = await page.evaluate(() => {
    const queue = (window as unknown as { vaq?: [string, (event: { type: string; url: string }) => unknown][] }).vaq;
    return queue?.filter(entry => entry[0] === "beforeSend").at(-1)?.[1]({ type: "pageview", url: "https://www.terapiaely.com.br/" });
  });
  expect(revokedEvent).toBeNull();
  await page.reload(); await page.waitForLoadState("networkidle");
  expect(scripts).toBe(1);
});
