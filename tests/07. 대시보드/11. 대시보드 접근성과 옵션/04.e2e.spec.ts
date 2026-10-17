import { expect, test } from "@playwright/test";

test("4. Note 표시 명령은 aria-pressed로 표시 상태를 제공한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "DASHBOARD" }).click();
  await page.getByRole("button", { name: "Dashboard options" }).click();
  await expect(page.getByRole("button", { name: "Note", exact: true })).toHaveAttribute("aria-pressed", "false");
});
