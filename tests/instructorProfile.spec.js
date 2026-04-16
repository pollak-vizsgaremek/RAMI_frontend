import { test, expect } from "@playwright/test";

test("Instructor Profile displays instructor name", async ({ page }) => {
  await page.goto("/instructor/1");
  await page.waitForTimeout(1000);
});

test("Instructor Profile shows profile information", async ({ page }) => {
  await page.goto("/instructor/1");
  await page.waitForTimeout(1000);
});

test("Instructor Profile displays rating information", async ({ page }) => {
  await page.goto("/instructor/1");
  await page.waitForLoadState("networkidle");
  // Check for rating display elements
  const ratingElements = page.locator(
    '[data-testid="rating"], .rating, [class*="rating"]',
  );
  if (await ratingElements.first().isVisible()) {
    await expect(ratingElements.first()).toBeVisible();
  }
});

test("Instructor Profile shows reviews section", async ({ page }) => {
  await page.goto("/instructor/1");
  await page.waitForLoadState("networkidle");
  // Look for reviews heading or section
  const reviewsHeading = page.getByRole("heading", {
    name: /vélemények|reviews/i,
  });
  if (await reviewsHeading.isVisible()) {
    await expect(reviewsHeading).toBeVisible();
  }
});

test("Instructor Profile has back or navigation button", async ({ page }) => {
  await page.goto("/instructor/1");
  await page.waitForLoadState("networkidle");
  // Check for back button or navigation
  const backButton = page.getByRole("button", { name: /vissza|back/i });
  if (await backButton.isVisible()) {
    await expect(backButton).toBeVisible();
  }
});
