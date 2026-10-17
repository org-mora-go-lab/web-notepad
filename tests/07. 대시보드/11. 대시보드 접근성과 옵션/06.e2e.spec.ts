import { expect, test } from "@playwright/test";

test("6. Note 표시를 켜면 Note 컬럼과 눌림 상태를 함께 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "DASHBOARD" }).click();
  await page.getByRole("button", { name: "Dashboard options" }).click();
  const command = page.getByRole("button", { name: "Note", exact: true });
  await command.click();
  await expect(command).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".dashboard-icebox-column")).toBeVisible();
});
