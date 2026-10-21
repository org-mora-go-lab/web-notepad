import { expect, test } from "@playwright/test";

test("3. 굵게 텍스트 내부의 Cmd+B는 표식을 제거한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("before **bold text** after");
  await editor.evaluate((element) => (element as HTMLTextAreaElement).setSelectionRange(12, 12));

  await editor.press("Meta+b");

  await expect(editor).toHaveValue("before bold text after");
  await expect
    .poll(() => editor.evaluate((element) => (element as HTMLTextAreaElement).selectionStart))
    .toBe(10);
});
