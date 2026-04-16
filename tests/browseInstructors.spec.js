import { test, expect } from "@playwright/test";

test("Browse with query parameters", async ({ page }) => {
  await page.goto("/browse-instructors?q=test&city=Budapest");
  await page.waitForTimeout(1000);
});

test("Instructor profile with ID loads", async ({ page }) => {
  await page.goto("/instructor/1");
  await page.waitForTimeout(1000);
});

test("Instructor search page loads", async ({ page }) => {
  await page.goto("/instructor-profile");
  await page.waitForTimeout(1000);
});

test("Review page with instructor param", async ({ page }) => {
  await page.goto("/review?instructorId=123");
  await page.waitForTimeout(1000);
});
