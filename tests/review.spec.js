import { test, expect } from '@playwright/test';

test("Review page requires login", async({page}) => {
    await page.goto("http://localhost:5173/review");
    await page.waitForTimeout(1000);
});

test("Review page has instructor dropdown when logged in", async({page}) => {
    await page.goto("http://localhost:5173/review");
    await page.waitForTimeout(1000);
});
