import { expect, test } from "@playwright/test";

test("5. 내어쓰기 후 실행 취소로 원래 탭 들여쓰기를 복구한다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("\tfirst\n\tsecond");
  await editor.evaluate((element: HTMLTextAreaElement) =>
    element.setSelectionRange(0, element.value.length),
  );
  await editor.press("Shift+Tab");
  await expect(editor).toHaveValue("first\nsecond");
  await editor.press("Control+z");
  await expect(editor).toHaveValue("\tfirst\n\tsecond");
});
