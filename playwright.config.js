// @ts-check
import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",

  // Plus stable : évite que des tests influencent les autres
  fullyParallel: true,

  // Sécurité CI : empêche de pousser un test.only
  forbidOnly: isCI,

  // Flakies : retries en CI
  retries: isCI ? 2 : 0,

  // Parallélisme : en CI on limite un peu (ajuste selon ton repo)
  workers: isCI ? 2 : undefined,

  // Timeouts globaux
  timeout: 30_000,
  expect: { timeout: 10_000 },

  // Rapport détaillé
  reporter: isCI
    ? [
        ["github"],
        ["html", { open: "never", outputFolder: "playwright-report" }],
        ["junit", { outputFile: "test-results/junit.xml" }],
      ]
    : [["html", { open: "on-failure", outputFolder: "playwright-report" }]],

  use: {
    // ✅ URL cible (injectée depuis le workflow), fallback vers prod
    baseURL: process.env.BASE_URL || "https://bugcorp.vercel.app",

    // CI = headless
    headless: true,

    // Pour réduire les faux rouges réseau/chargements
    navigationTimeout: 30_000,
    actionTimeout: 10_000,

    // Artifacts de debug
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    // Recommandé : isole mieux le state entre tests
    // (Playwright le fait déjà bien, mais ça aide parfois)
    // storageState: undefined,
  },

  // Navigateurs
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],

  // Optionnel : pour garder le CI moins verbeux (et utile en debug)
  // quiet: isCI,
});