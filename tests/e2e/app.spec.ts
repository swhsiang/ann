import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Ann AI/);
});

test("displays app title", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Ann AI")).toBeVisible();
});