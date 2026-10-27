import { expect, test } from "@playwright/test";

test("1. Cmd+B는 선택 텍스트의 굵게 표식을 적용하고 해제한다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("bold text");
  await editor.selectText();

  await editor.press("Meta+b");
  await expect(editor).toHaveValue("**bold text**");
  await editor.press("Meta+b");
  await expect(editor).toHaveValue("bold text");
});
