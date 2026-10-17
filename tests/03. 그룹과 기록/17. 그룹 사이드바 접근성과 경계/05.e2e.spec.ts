import { expect, test } from "@playwright/test";

test("5. All Group 선택 상태는 aria-pressed로 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  const all = page.getByRole("button", { name: "All Group", exact: true });
  await all.click();
  await expect(all).toHaveAttribute("aria-pressed", "true");
});
