import { test, expect } from '@playwright/test';

test("Login page has heading" async({page}) => {
    await page.goto("http://localhost:5173/");
    await expect(page.getByRole("heading", { name: "Üdvözlünk újra!"})).toBeVisible();
});

test("Login page has username and password inputs", async ({page }) => {
    await page.goto("https://localhost:5173/");
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Jelszó")).toBeVisible();

    // ID alapján
    await expect(page.locator("#email"))
})