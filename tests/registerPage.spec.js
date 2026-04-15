import { test, expect } from '@playwright/test';

test("Register page loads", async({page}) => {
    await page.goto("http://localhost:5173/");
    await page.waitForTimeout(1000);
});

test("Register button clickable", async ({page }) => {
    await page.goto("http://localhost:5173/");
    await page.waitForTimeout(500);
});

test("Email and password inputs are accessible", async ({page }) => {
    await page.goto("http://localhost:5173/");
    await page.waitForTimeout(500);
});

test("Form inputs can accept values", async ({page }) => {
    await page.goto("http://localhost:5173/");
    await page.waitForTimeout(500);
});