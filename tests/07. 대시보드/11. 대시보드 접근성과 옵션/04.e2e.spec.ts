import { expect, test } from "@playwright/test";

test("4. 새 작업공간은 Note를 기본 표시하고 눌림 상태를 제공한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "DASHBOARD" }).click();
  await page.getByRole("button", { name: "Dashboard options" }).click();
  await expect(page.getByRole("button", { name: "Note", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".dashboard-icebox-column")).toBeVisible();
});
