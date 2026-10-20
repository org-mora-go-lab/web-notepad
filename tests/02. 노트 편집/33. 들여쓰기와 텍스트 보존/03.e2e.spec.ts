import { expect, test } from "@playwright/test";

test("3. 선택 끝이 다음 줄 시작이면 내어쓰기에서 다음 줄을 제외한다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("\tfirst\n\tsecond");
  await editor.evaluate((element: HTMLTextAreaElement) =>
    element.setSelectionRange(0, 7),
  );
  await editor.press("Shift+Tab");
  await expect(editor).toHaveValue("first\n\tsecond");
});
