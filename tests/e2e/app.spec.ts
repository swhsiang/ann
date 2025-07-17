import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Virtual Character App/);
});

test("displays welcome message", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Virtual Character App")).toBeVisible();
  await expect(
    page.getByText("Welcome to your virtual character desktop application built with Electron, React, and TypeScript.")
  ).toBeVisible();
});