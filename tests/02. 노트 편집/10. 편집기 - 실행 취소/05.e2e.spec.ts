import { expect, test } from "@playwright/test";

test("5. 실행 취소 후 새 편집을 시작하면 이전 다시 실행 기록을 제거한다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("first");
  await editor.fill("second");
  await editor.press("Meta+z");
  await expect(editor).toHaveValue("first");

  await editor.fill("branched");
  await editor.press("Meta+Shift+z");
  await expect(editor).toHaveValue("branched");
});
