import { expect, test } from "@playwright/test";

test("4. 편집기의 Cmd+A 또는 Alt+A는 내용 전체를 선택한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const readSelection = () => editor.evaluate((element) => [
    (element as HTMLTextAreaElement).selectionStart,
    (element as HTMLTextAreaElement).selectionEnd,
  ]);
  const collapseSelection = () => editor.evaluate((element) =>
    (element as HTMLTextAreaElement).setSelectionRange(0, 0),
  );
  await editor.fill("select me");
  await collapseSelection();
  await page.keyboard.press("Meta+a");
  await expect.poll(readSelection).toEqual([0, 9]);
  await page.waitForTimeout(100);
  await collapseSelection();
  await page.keyboard.press("Alt+a");
  await expect.poll(readSelection).toEqual([0, 9]);
});
