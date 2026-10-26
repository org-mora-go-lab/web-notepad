import { expect, test } from "@playwright/test";

test("7. Done 표시를 끄면 컬럼을 숨기고 눌림 상태를 해제한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "DASHBOARD" }).click();
  await page.getByRole("button", { name: "Dashboard options" }).click();
  const command = page.getByRole("button", { name: "Done", exact: true });
  await command.click();
  await expect(command).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".dashboard-done-column")).toHaveCount(0);
});
