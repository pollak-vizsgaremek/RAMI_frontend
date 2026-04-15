import { test, expect } from '@playwright/test';

test("User Profile page loads", async({page}) => {
    await page.goto("http://localhost:5173/profile");
    await page.waitForTimeout(1000);
});

test("User Profile displays user information", async({page}) => {
    await page.goto("http://localhost:5173/profile");
    await page.waitForTimeout(1000);
});

test("User Profile displays reviews", async({page}) => {
    await page.goto("http://localhost:5173/profile");
    await page.waitForTimeout(1000);
});
