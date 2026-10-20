import { expect, test } from "@playwright/test";

test("4. 줄 중간 커서 앞의 탭을 내어써도 뒤쪽 텍스트를 보존한다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("ab\tcd");
  await editor.evaluate((element: HTMLTextAreaElement) =>
    element.setSelectionRange(3, 3),
  );
  await editor.press("Shift+Tab");
  await expect(editor).toHaveValue("abcd");
  expect(
    await editor.evaluate(
      (element: HTMLTextAreaElement) => element.selectionStart,
    ),
  ).toBe(2);
});
