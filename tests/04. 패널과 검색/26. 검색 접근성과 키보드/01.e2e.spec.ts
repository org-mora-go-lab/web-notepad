import { expect, test } from "@playwright/test";

test("1. 검색 명령은 팝업 제어 대상과 펼침 상태를 제공한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "SEARCH", exact: true });
  await expect(trigger).toHaveAttribute("aria-controls", "global-search-popup");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});
