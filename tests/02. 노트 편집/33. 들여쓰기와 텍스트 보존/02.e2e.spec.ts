import { expect, test } from "@playwright/test";

test("2. 여러 줄 내어쓰기는 공백 들여쓰기를 탭으로 오인해 제거하지 않는다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("\tfirst\n  second\n\tthird");
  await editor.evaluate((element: HTMLTextAreaElement) =>
    element.setSelectionRange(0, element.value.length),
  );
  await editor.press("Shift+Tab");
  await expect(editor).toHaveValue("first\n  second\nthird");
  await expect(editor).toBeFocused();
});
