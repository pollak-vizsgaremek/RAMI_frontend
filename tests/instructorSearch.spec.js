import { test, expect } from "@playwright/test";

test("Instructor Search page displays content", async ({ page }) => {
  await page.goto("/instructor-profile");
  await page.waitForTimeout(1000);
});
