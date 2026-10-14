import { expect, test } from "@playwright/test";

test("6. 자동 줄바꿈된 긴 원본 줄의 커서를 편집기와 줄 번호 영역이 함께 따라간다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 700, height: 320 });
  await page.goto("/");
  const editor = page.locator("textarea");
  const lineRail = page.locator(".line-rail");
  await editor.fill("wrapped caret ".repeat(400));
  await expect
    .poll(() =>
      editor.evaluate(
        (element) => element.scrollHeight > element.clientHeight,
      ),
    )
    .toBe(true);

  await editor.evaluate((element) => {
    const textarea = element as HTMLTextAreaElement;
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    textarea.scrollTop = 0;
  });
  await editor.press("Enter");

  await expect
    .poll(() => editor.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  await expect
    .poll(async () => {
      const [editorScrollTop, railScrollTop] = await Promise.all([
        editor.evaluate((element) => element.scrollTop),
        lineRail.evaluate((element) => element.scrollTop),
      ]);
      return Math.abs(editorScrollTop - railScrollTop);
    })
    .toBeLessThan(1);
});
