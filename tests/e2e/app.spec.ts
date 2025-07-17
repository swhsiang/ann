import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Virtual Character App/);
});

test("displays welcome message", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Virtual Character App")).toBeVisible();
  await expect(
    page.getByText("Welcome to Your Virtual Character Desktop App")
  ).toBeVisible();
});