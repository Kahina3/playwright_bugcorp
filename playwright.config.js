// @ts-check
import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,

  timeout: 30_000,
  expect: { timeout: 10_000 },

  reporter: isCI
    ? [
        ["github"],
        ["html", { open: "never", outputFolder: "playwright-report" }],
        ["junit", { outputFile: "test-results/junit.xml" }],
      ]
    : [["html", { open: "on-failure", outputFolder: "playwright-report" }]],

  use: {
    baseURL: process.env.BASE_URL || "https://bugcorp.vercel.app",
    headless: true,
    navigationTimeout: 30_000,
    actionTimeout: 10_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // ✅ Projet normal
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },

    // ✅ Projet Lighthouse (un seul navigateur, un seul worker)
    {
      name: "lighthouse",
      testMatch: /lighthouse\.spec\.js/,
      workers: 1,
      use: {
        ...devices["Desktop Chrome"],
        browserName: "chromium",
        headless: false,
      },
    },
  ],
});