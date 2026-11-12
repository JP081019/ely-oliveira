import { test, expect } from "@playwright/test";
import { join } from "node:path";

test("toque, FAQ e rodapé em iPhone 13 com WebKit", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
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
  expect(await page.locator(".skip-link").evaluate(element => element.getBoundingClientRect().bottom <= 0)).toBe(true);
  await page.locator("#contato").screenshot({ path: join(process.cwd(), ".private", "review", "iphone-13-footer.png"), animations: "disabled" });
  expect(errors).toEqual([]);
});
