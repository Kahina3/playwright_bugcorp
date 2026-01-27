// tests/lighthouse.spec.js
import { test, expect } from "@playwright/test";
import { playAudit } from "playwright-lighthouse";

import lighthouseDesktopConfig from "lighthouse/core/config/lr-desktop-config.js";

test.use({ browserName: "chromium" });
test.describe.configure({ mode: "serial" });

const BASE_URL = "https://bugcorp.vercel.app";
const PORT = 9222; // Port nécessaire pour l'utilisation de Lighthouse

// ✅ Seuils d'audit dans une variable
const LIGHTHOUSE_THRESHOLDS = {
  performance: 80,
  accessibility: 90,
  "best-practices": 85,
  seo: 80,
};

test.describe("Lighthouse - tests de performances", () => {
  let browser;
  let page;

  test.beforeAll(async ({ playwright }) => {
    browser = await playwright.chromium.launch({
      headless: false,
      args: [`--remote-debugging-port=${PORT}`],
    });
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  // lancer Lighthouse sur la page courante
  async function auditPage(pageName) {
    await page.waitForLoadState("networkidle").catch(() => {});
    await playAudit({
      page,
      port: PORT,
      reports: {
        name: pageName,
        directory: "lighthouse-reports",
        formats: { html: true, json: true },
      },
      thresholds: LIGHTHOUSE_THRESHOLDS,
      config: lighthouseDesktopConfig,
    });
  }

  async function goToAnnuaire() {
    await page.goto(BASE_URL);
    await page.getByRole("button", { name: "Accéder à l'Annuaire" }).click();
    await expect(page.getByRole("heading", { name: "L'Annuaire Enterprise" })).toBeVisible();
  }

  async function goToContact() {
    await page.goto(BASE_URL);
    await page.getByRole("button", { name: "Ouvrir un ticket" }).click();
    await expect(page.getByRole("heading", { name: "Contact Support" })).toBeVisible();
  }

  async function goToElementsInstables() {
    await page.goto(BASE_URL);
    await page.getByRole("button", { name: "Tester vos réflexes" }).click();
    await expect(page.getByRole("heading", { name: "Éléments Instables" })).toBeVisible();
  }

  test("Lighthouse - Annuaire", async () => {
    await goToAnnuaire();
    await auditPage("annuaire");
  });

  test("Lighthouse - Contact", async () => {
    await goToContact();
    await auditPage("contact");
  });

  test("Lighthouse - Éléments Instables", async () => {
    await goToElementsInstables();
    await auditPage("elements-instables");
  });
});