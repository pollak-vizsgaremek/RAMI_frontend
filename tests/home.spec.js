import { test, expect } from "@playwright/test";

test("Home page loads", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1000);
});

test("Browse Instructors page loads", async ({ page }) => {
  await page.goto("/browse-instructors");
  await page.waitForTimeout(1000);
});

test("Leaderboard page loads", async ({ page }) => {
  await page.goto("/leaderboard");
  await page.waitForTimeout(1000);
});

test("Instructor profile page loads", async ({ page }) => {
  await page.goto("/instructor/507f1f77bcf86cd799439011");
  await page.waitForTimeout(1000);
});

test("User profile page loads", async ({ page }) => {
  await page.goto("/profile");
  await page.waitForTimeout(1000);
});

test("Review page loads", async ({ page }) => {
  await page.goto("/review");
  await page.waitForTimeout(1000);
});
