import { expect, test } from "@playwright/test";

test("4. GROUP 접기 버튼은 제어 대상 목록 ID를 제공한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle groups" }).click();
  await expect(page.getByRole("button", { name: "GROUP", exact: true })).toHaveAttribute("aria-controls", "group-sidebar-list");
});
