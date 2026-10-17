import { expect, test } from "@playwright/test";

test("6. Ungrouped 선택 상태는 aria-pressed로 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle menu" }).click();
  await expect(page.getByRole("button", { name: "Ungrouped", exact: true })).toHaveAttribute("aria-pressed", "true");
});
