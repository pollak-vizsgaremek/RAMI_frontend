import { test, expect } from '@playwright/test';

test("Home page loads", async({page}) => {
    await page.goto("http://localhost:5173/");
    await page.waitForTimeout(1000);
});

test("Browse Instructors page loads", async({page}) => {
    await page.goto("http://localhost:5173/browse-instructors");
    await page.waitForTimeout(1000);
});

test("Leaderboard page loads", async({page}) => {
    await page.goto("http://localhost:5173/leaderboard");
    await page.waitForTimeout(1000);
});

test("Instructor profile page loads", async({page}) => {
    await page.goto("http://localhost:5173/instructor/507f1f77bcf86cd799439011");
    await page.waitForTimeout(1000);
});

test("User profile page loads", async({page}) => {
    await page.goto("http://localhost:5173/profile");
    await page.waitForTimeout(1000);
});

test("Review page loads", async({page}) => {
    await page.goto("http://localhost:5173/review");
    await page.waitForTimeout(1000);
});
