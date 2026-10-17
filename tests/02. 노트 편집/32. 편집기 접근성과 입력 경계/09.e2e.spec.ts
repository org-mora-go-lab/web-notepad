import { expect, test } from "@playwright/test";

test("9. Tab 키는 편집기에 탭 문자를 삽입한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("ab");
  await editor.press("End");
  await editor.press("Tab");
  await expect(editor).toHaveValue("ab\t");
});
