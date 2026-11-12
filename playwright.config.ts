import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: ".private/review/browser-results.json" }]],
  use: { baseURL: process.env.TEST_BASE_URL || "http://127.0.0.1:3100", viewport: { width: 1440, height: 1000 }, screenshot: "only-on-failure", trace: "retain-on-failure" },
  projects: [
    { name: "chrome", testIgnore: /iphone\.spec\.ts/, use: { browserName: "chromium", channel: "chrome" } },
    { name: "webkit-iphone", testMatch: /iphone\.spec\.ts/, use: { ...devices["iPhone 13"], browserName: "webkit" } },
  ],
});
