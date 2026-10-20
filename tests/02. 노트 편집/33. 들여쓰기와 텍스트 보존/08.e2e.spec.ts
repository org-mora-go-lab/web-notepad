import { expect, test } from "@playwright/test";

test("8. 이모지와 결합 문자를 포함한 노트는 편집 실행 취소와 재방문에도 손실되지 않는다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const content = "가족 👨‍👩‍👧‍👦\ne\u0301 한글 📝\n";
  await editor.fill(content);
  await editor.fill(content + "changed");
  await editor.press("Control+z");
  await expect(editor).toHaveValue(content);
  await page.reload();
  await expect(editor).toHaveValue(content);
});
