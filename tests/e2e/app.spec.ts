import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Ann AI/);
});

test("displays welcome message", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Ann AI")).toBeVisible();
  await expect(
    page.getByText("Welcome to your Ann AI desktop application built with Electron, React, and TypeScript.")
  ).toBeVisible();
});