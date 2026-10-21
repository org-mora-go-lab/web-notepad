import { expect, test } from "@playwright/test";

test("3. 추가 modifier와 Ctrl+B 및 일반 B는 패널을 토글하지 않는다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.focus();
  for (const key of ["b", "Control+b", "Meta+Shift+b", "Meta+Alt+b", "Meta+Control+b"]) {
    await page.keyboard.press(key);
    await expect(page.locator("#groups-menu")).toHaveCount(0);
  }
  await expect(editor).toHaveValue("b");
});
