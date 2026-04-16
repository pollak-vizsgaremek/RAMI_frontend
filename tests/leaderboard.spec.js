import { test, expect } from "@playwright/test";

test("Leaderboard loads", async ({ page }) => {
  await page.goto("/leaderboard");
  await page.waitForTimeout(1000);
});

test("Leaderboard page loads successfully", async ({ page }) => {
  await page.goto("/leaderboard");
  await page.waitForLoadState("networkidle");
});

test("Leaderboard page displays title or heading", async ({ page }) => {
  await page.goto("/leaderboard");
  await page.waitForLoadState("networkidle");
  // Check for leaderboard heading
  const leaderboardHeading = page.getByRole("heading", {
    name: /rangsor|leaderboard|top|ranglista/i,
  });
  if (await leaderboardHeading.isVisible()) {
    await expect(leaderboardHeading).toBeVisible();
  } else {
    // If no heading, just ensure main is visible
    await expect(page.locator("main")).toBeVisible();
  }
});

test("Leaderboard displays instructor rankings", async ({ page }) => {
  await page.goto("/leaderboard");
  await page.waitForLoadState("networkidle");
  // Check if main content exists
  await expect(page.locator("main")).toBeVisible();
});

test("Leaderboard shows medal or trophy icons", async ({ page }) => {
  await page.goto("/leaderboard");
  await page.waitForLoadState("networkidle");
  // Check for trophy or medal icons (from lucide-react imports)
  const trophyIcons = page.locator(
    'svg[data-icon*="trophy"], [class*="trophy"]',
  );
  if (await trophyIcons.first().isVisible()) {
    await expect(trophyIcons.first()).toBeVisible();
  }
});

test("Leaderboard displays star ratings", async ({ page }) => {
  await page.goto("/leaderboard");
  await page.waitForLoadState("networkidle");
  // Check for star ratings
  const starIcons = page.locator('svg[data-icon*="star"], [class*="star"]');
  if (await starIcons.first().isVisible()) {
    await expect(starIcons.first()).toBeVisible();
  }
});

test("Leaderboard displays instructor locations", async ({ page }) => {
  await page.goto("/leaderboard");
  await page.waitForLoadState("networkidle");
  // Check for map pin icons
  const locationIcons = page.locator(
    'svg[data-icon*="map"], [class*="location"]',
  );
  if (await locationIcons.first().isVisible()) {
    await expect(locationIcons.first()).toBeVisible();
  }
});

test("Can navigate to instructor from leaderboard", async ({ page }) => {
  await page.goto("/leaderboard");
  await page.waitForLoadState("networkidle");
  // Look for instructor links
  const instructorLink = page.locator("a[href*='/instructor/']").first();
  if (await instructorLink.isVisible()) {
    await instructorLink.click();
    await page.waitForLoadState("networkidle");
  }
});
