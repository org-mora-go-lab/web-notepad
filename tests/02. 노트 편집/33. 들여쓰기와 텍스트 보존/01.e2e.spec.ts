import { expect, test } from "@playwright/test";

test("1. Shift Tab은 여러 겹의 앞쪽 탭에서 한 단계만 제거한다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("\t\tfirst");
  await editor.evaluate((element: HTMLTextAreaElement) =>
    element.setSelectionRange(2, 2),
  );
  await editor.press("Shift+Tab");
  await expect(editor).toHaveValue("\tfirst");
  await expect(editor).toBeFocused();
});
