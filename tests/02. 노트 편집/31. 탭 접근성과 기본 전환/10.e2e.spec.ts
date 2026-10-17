import { expect, test } from "@playwright/test";

test("10. 탭 선택 버튼은 키보드 포커스를 받을 수 있다", async ({ page }) => {
  await page.goto("/");
  const tab = page.getByRole("tab");
  await tab.focus();
  await expect(tab).toBeFocused();
});
