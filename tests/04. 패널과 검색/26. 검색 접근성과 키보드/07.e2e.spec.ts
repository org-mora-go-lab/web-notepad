import { expect, test } from "@playwright/test";

test("7. Escape로 검색을 닫으면 검색 명령으로 포커스를 복원한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "SEARCH", exact: true });
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#global-search-popup")).not.toHaveAttribute("open", "");
  await expect(trigger).toBeFocused();
});
