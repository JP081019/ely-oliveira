import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { join } from "node:path";

test("V3 preserva sete seções no HTML e suas âncoras", async ({ page, request }) => {
  const html = await (await request.get("/")).text();
  const ids = [...html.matchAll(/<(?:section|footer)\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]);
  expect(ids).toEqual(["inicio", "sobre", "trg", "atendimento", "qualificacoes", "perguntas", "contato"]);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Rejeitar opcionais", exact: true }).first().click();
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("Um olhar cuidadoso");
  const missing = await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute("href")!.slice(1)).filter(id => id && !document.getElementById(id)));
  expect(missing).toEqual([]);
  for (const id of ids) await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator('.hero-brand img')).toHaveAttribute("src", /Ely_04_Negativa_Principal/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.terapiaely.com.br");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#171717");
  await expect(page.locator('.jp-signature')).toContainText("Desenvolvido pela JP Creative");
  expect(errors).toEqual([]);
});

test("V3 mantém as frases abaixo das fotos nos nove tamanhos", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Rejeitar opcionais", exact: true }).first().click();
  for (const width of [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    const metrics = await page.evaluate(() => {
      const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
      const heroPhoto = box(".hero-photo"), heroCaption = box(".hero-photo-caption");
      const aboutPhoto = box(".about-photo"), aboutCaption = box(".about-portrait figcaption"), note = box(".portrait-note");
      const heading = box("#hero-title");
      const overlap = heading.left < heroPhoto.right && heading.right > heroPhoto.left && heading.top < heroPhoto.bottom && heading.bottom > heroPhoto.top;
      return { overflow: document.documentElement.scrollWidth > innerWidth + 1, heroGap: heroCaption.top - heroPhoto.bottom, aboutGap: aboutCaption.top - aboutPhoto.bottom, noteGap: note.top - aboutCaption.bottom, captionRight: heroCaption.right, width: innerWidth, overlap, body: getComputedStyle(document.body).backgroundColor, dock: getComputedStyle(document.querySelector(innerWidth <= 800 ? ".mobile-dock" : ".desktop-dock")!).backgroundColor };
    });
    expect(metrics.overflow, `${width}px: sem rolagem horizontal`).toBe(false);
    expect(metrics.heroGap, `${width}px: frase do Hero abaixo da foto`).toBeGreaterThanOrEqual(20);
    expect(metrics.aboutGap, `${width}px: identificação fora da foto`).toBeGreaterThanOrEqual(0);
    expect(metrics.noteGap, `${width}px: frase da história abaixo da imagem`).toBeGreaterThanOrEqual(15);
    expect(metrics.captionRight).toBeLessThanOrEqual(width);
    expect(metrics.overlap, `${width}px: título não cobre a foto`).toBe(false);
    expect(metrics.body).toBe("rgb(23, 23, 23)");
    expect(metrics.dock).toBe("rgb(255, 255, 255)");
  }
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(process.cwd(), ".private/review/v3-desktop.png"), animations: "disabled" });
  await page.locator("#sobre").screenshot({ path: join(process.cwd(), ".private/review/v3-about.png"), animations: "disabled" });
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await expect(page.locator("#contato")).toHaveAttribute("data-scene-ready", "true");
  await page.locator("#contato").screenshot({ path: join(process.cwd(), ".private/review/v3-footer.png"), animations: "disabled" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(process.cwd(), ".private/review/v3-mobile.png"), animations: "disabled" });
});

test("V3 preserva contraste, leitura da história e diálogo de preferências", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const tags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];
  const audit = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(audit.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
  await page.getByRole("button", { name: "Rejeitar opcionais", exact: true }).first().click();
  await page.getByRole("button", { name: "Continue minha história" }).click();
  await expect(page.locator(".story-rest blockquote")).toContainText("Foi pelas minhas filhas");
  await page.getByRole("button", { name: "Preferências de Cookies", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const dialogAudit = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(dialogAudit.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
