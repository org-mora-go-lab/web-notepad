import { expect, test } from "@playwright/test";

test("7. Shift+Tab은 탭 문자를 삽입하지 않고 편집기에서 역방향으로 포커스를 이동한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator(".note-area");
  await editor.fill("Keep this text unchanged");
  await editor.focus();

  await page.keyboard.press("Shift+Tab");

  await expect(editor).toHaveValue("Keep this text unchanged");
  await expect(editor).not.toBeFocused();
  await expect(page.locator('.line-rail [role="button"]').last()).toBeFocused();
});
