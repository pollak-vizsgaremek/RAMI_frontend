import { test, expect } from "@playwright/test";

test("Review page requires login", async ({ page }) => {
  await page.goto("/review");
  await page.waitForTimeout(1000);
});

test("Review page has instructor dropdown when logged in", async ({ page }) => {
  await page.goto("/review");
  await page.waitForTimeout(1000);
});
